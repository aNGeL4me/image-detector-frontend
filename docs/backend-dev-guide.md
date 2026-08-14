# 生成式图像检测系统 · 后端开发指南

> 本文档是后端的完整开发需求说明，可直接交给 AI 或开发者作为实现依据。
> 前端仓库：`aNGeL4me/image-detector-frontend`，线上地址 `https://angel4me.github.io/image-detector-frontend/`

## 1. 总体架构

```
浏览器（GitHub Pages, HTTPS）
   │  POST /api/detect  (multipart/form-data: 图片 + model_id)
   ▼
Nginx（443, HTTPS 终止, 反向代理）
   ▼
FastAPI + Uvicorn（127.0.0.1:8000）
   ▼
PyTorch 模型（CUDA 推理，模型常驻内存，启动时加载一次）
```

## 2. 技术栈要求

- Python 3.10+
- FastAPI + Uvicorn（Web 框架 / ASGI 服务器）
- PyTorch + torchvision（CUDA 版本，按服务器 GPU 的 CUDA 版本安装）
- Pillow（图像解码与预处理）
- python-multipart（FastAPI 接收文件上传必需）
- Nginx（反向代理 + HTTPS）
- 可选：Docker / systemd 做进程守护

## 3. API 契约（必须与前端严格对齐）

### 3.1 健康检查

```
GET /api/health
→ 200 {"status": "ok", "models": ["texdet", "vit-guard", "meta-forensics"], "cuda": true}
```

### 3.2 图像检测（核心接口）

```
POST /api/detect
Content-Type: multipart/form-data

字段：
  file      必填，图像文件（jpg/png/webp/bmp，≤ 10MB）
  model_id  必填，字符串，取值必须为：texdet | vit-guard | meta-forensics
            （与前端 src/data/models.ts 中的 id 一一对应）
```

成功响应 `200`：

```json
{
  "label": "AI生成",
  "confidence": 96.3,
  "model_id": "vit-guard",
  "inference_ms": 132
}
```

字段约定：

- `label`：字符串，只能是 `"AI生成"` 或 `"真实"`（前端按此渲染标签颜色）
- `confidence`：浮点数，0–100，保留 1 位小数，表示判定为 `label` 的置信度
- `inference_ms`：整数，纯模型推理耗时（不含网络与解码）

错误响应：

| 状态码 | 场景 | 响应体 |
|---|---|---|
| 400 | 文件不是合法图像 / 字段缺失 / model_id 非法 | `{"detail": "错误描述"}` |
| 413 | 文件超过 10MB | `{"detail": "文件过大"}` |
| 503 | 对应模型权重未加载（未部署该模型） | `{"detail": "模型 xxx 暂不可用"}` |

### 3.3 CORS（必须配置）

前端源是 `https://angel4me.github.io`，必须放行，否则浏览器拦截：

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://angel4me.github.io",
        "http://localhost:5173",   # 本地前端调试
    ],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)
```

## 4. 关键实现要求

### 4.1 模型管理

- 服务启动时用 FastAPI `lifespan` 一次性加载所有可用模型到显存/内存，**禁止每次请求重新加载权重**。
- 用字典做模型注册表：`{"texdet": model_a, "vit-guard": model_b, ...}`，某个模型权重文件缺失时不加载它，请求该模型返回 503。
- 模型推理统一封装为函数：`predict(model, pil_image) -> (label, confidence)`。
- 推理放在 `torch.no_grad()` + `model.eval()` 下；单卡场景注意加锁或用 `anyio.to_thread` 避免阻塞事件循环。

### 4.2 图像预处理

- 用 Pillow 解码上传内容，先 `ImageOps.exif_transpose` 修正 EXIF 方向，再转 `RGB`。
- 解码失败（非图像、损坏文件）返回 400，不能抛 500。
- 预处理变换（Resize/ToTensor/Normalize）必须与模型训练时一致，这部分由模型提供方确认。
- 上传即无损传图：后端不要对原图做有损压缩，预处理只在内存中生成 tensor 副本。

### 4.3 过渡方案（重要）

在真实模型权重就绪**之前**，先实现一个 mock 推理分支（随机返回 label + 85~99 的置信度），
保证前端联调可以先跑通全链路。权重就绪后逐个替换为真实推理。

### 4.4 安全与限制

- Nginx 层限制请求体大小：`client_max_body_size 12m;`
- 只接受 `image/*` 类型；不信任前端传来的 Content-Type，以 Pillow 实际解码结果为准。
- 文件名不要落盘，直接读字节流处理；如确需落盘，用随机文件名并定期清理。

## 5. 参考实现（可直接在此基础上补全）

目录结构建议：

```
backend/
├── app/
│   ├── main.py          # FastAPI 入口、CORS、路由
│   ├── models.py        # 模型注册表、加载与推理封装
│   └── schemas.py       # 响应模型定义
├── weights/             # 模型权重（.pth，不入 git）
├── requirements.txt
└── README.md
```

`app/main.py` 参考：

```python
import io
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageOps

from .models import load_models, predict

VALID_MODEL_IDS = {"texdet", "vit-guard", "meta-forensics"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.models = load_models("weights/")  # 启动时加载一次
    yield


app = FastAPI(title="AIGC Image Detector API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://angel4me.github.io", "http://localhost:5173"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    import torch
    return {
        "status": "ok",
        "models": sorted(app.state.models.keys()),
        "cuda": torch.cuda.is_available(),
    }


@app.post("/api/detect")
async def detect(file: UploadFile = File(...), model_id: str = Form(...)):
    if model_id not in VALID_MODEL_IDS:
        raise HTTPException(400, f"非法的 model_id: {model_id}")
    model = app.state.models.get(model_id)
    if model is None:
        raise HTTPException(503, f"模型 {model_id} 暂不可用")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(413, "文件过大（上限 10MB）")
    try:
        image = ImageOps.exif_transpose(Image.open(io.BytesIO(content))).convert("RGB")
    except Exception:
        raise HTTPException(400, "无法解析的图像文件")

    start = time.perf_counter()
    label, confidence = predict(model, image)  # 权重未就绪时先返回 mock 结果
    inference_ms = int((time.perf_counter() - start) * 1000)

    return {
        "label": label,            # "AI生成" 或 "真实"
        "confidence": round(confidence, 1),
        "model_id": model_id,
        "inference_ms": inference_ms,
    }
```

## 6. 部署步骤（服务器侧）

1. **环境**：创建独立虚拟环境（`conda create -n detector python=3.10` 或 `python -m venv .venv`），
   安装与服务器 CUDA 版本匹配的 PyTorch（参考 https://pytorch.org/get-started/locally/ 给出的安装命令）。
2. **启动**：`uvicorn app.main:app --host 127.0.0.1 --port 8000`（只监听本机，由 Nginx 对外）。
   生产环境用 systemd 或 `pm2`/`supervisor` 守护；GPU 模型通常单 worker 即可。
3. **Nginx 反代**：

   ```nginx
   server {
       listen 443 ssl;
       server_name <你的API域名>;

       ssl_certificate     /etc/letsencrypt/live/<域名>/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/<域名>/privkey.pem;

       client_max_body_size 12m;

       location /api/ {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_read_timeout 60s;
       }
   }
   ```

4. **HTTPS（必须解决）**：前端在 `https://` 的 GitHub Pages 上，浏览器会拦截发往 `http://` 接口的请求（混合内容）。可选方案：
   - 有域名：DNS 解析到服务器，用 `certbot --nginx` 免费签证书（推荐）；
   - 无域名：用 Cloudflare Tunnel（`cloudflared`）或 frp 等内网穿透工具获得一个 HTTPS 入口；
   - 仅本地联调阶段可暂时用 `http://服务器IP:8000` + 本地 `npm run dev` 的前端调试（本地 HTTP 页面不受混合内容限制）。
5. **防火墙/安全组**：只放行 443（和 SSH 端口），8000 不对外。

## 7. 前端对接方式（供前端开发者参考）

前端在 `src/components/Detector.tsx` 中把 mock 的 `setTimeout` 替换为真实请求：

```ts
const formData = new FormData();
formData.append('file', selectedFile);
formData.append('model_id', displayed.id);

const resp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/detect`, {
  method: 'POST',
  body: formData,
});
if (!resp.ok) throw new Error((await resp.json()).detail ?? '检测失败');
const data = await resp.json(); // { label, confidence, model_id, inference_ms }
```

- API 地址通过环境变量注入：仓库根目录建 `.env.production`，内容为
  `VITE_API_BASE_URL=https://<你的API域名>`（注意不要加尾部斜杠）。
- 需要处理 loading（已有 `isDetecting` 状态）和错误提示。

## 8. 验收标准

1. `curl https://<API域名>/api/health` 返回 200，`cuda: true`，`models` 列出已加载模型。
2. 用 curl 模拟上传：`curl -F "file=@test.jpg" -F "model_id=texdet" https://<API域名>/api/detect`
   返回符合第 3 节契约的 JSON。
3. 从 `https://angel4me.github.io/image-detector-frontend/` 页面上传图片能拿到真实检测结果，
   检测历史中的标签、置信度、模型名正确显示。
4. 上传非图像文件返回 400；上传超过 10MB 文件返回 413；请求未部署的模型返回 503。
5. 连续请求 20 次服务稳定，无显存泄漏（观察 `nvidia-smi` 显存占用平稳）。
