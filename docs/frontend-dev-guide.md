# 生成式图像检测系统 · 前端对接指南

> 本文档说明前端如何调用当前已部署的后端检测服务，可直接交给 AI 或开发者作为实现依据。
> 前端仓库：`aNGeL4me/image-detector-frontend`，线上地址 `https://angel4me.github.io/image-detector-frontend/`
> 对应后端文档：本仓库 `backend-dev-guide.md`

## 0. 重要：API 地址会变动（务必先读）

后端部署在 AutoDL 容器上，通过 Cloudflare 快速隧道（trycloudflare）暴露公网入口。
**快速隧道的域名不是固定的：后端每次重启服务（`server.sh start/restart`），公网地址都会改变。**

因此：

- 本文档中出现的具体 `*.trycloudflare.com` 地址**只是撰写时的示例，随时可能失效**；
- 每次联调/部署前，**先向后端负责人索取当前有效地址**（后端在服务器上执行 `./server.sh url` 可获得）；
- 前端代码中**禁止硬编码 API 地址**，必须通过环境变量注入（见第 3 节），这样地址变更只需改一行配置、重新构建，不动代码。

当前有效地址（2026-08-14 更新，可能已过期，以实际索取为准）：

```
https://gibraltar-did-fewer-eat.trycloudflare.com
```

## 1. 当前服务状态说明

- 后端为 **mock 推理阶段**：接口契约、字段格式、错误码均为最终形态，但 `label`/`confidence` 是随机生成的占位值，`inference_ms` 接近 0。
- `/api/health` 中的 `cuda` 当前为 `false`（mock 阶段未加载 torch），属正常现象。
- 前端应按正式契约开发，后端换成真实模型后前端**无需任何改动**。

## 2. API 契约

### 2.1 健康检查

```
GET {API_BASE_URL}/api/health
```

响应 `200`：

```json
{"status": "ok", "models": ["meta-forensics", "texdet", "vit-guard"], "cuda": false}
```

用途：可用于联调前探测服务是否在线、地址是否仍然有效（地址失效时表现为网络错误/超时）。

### 2.2 图像检测（核心接口）

```
POST {API_BASE_URL}/api/detect
Content-Type: multipart/form-data
```

字段：

| 字段 | 必填 | 说明 |
|---|---|---|
| `file` | 是 | 图像文件（jpg/png/webp/bmp，≤ 10MB） |
| `model_id` | 是 | 字符串，取值必须为 `texdet` \| `vit-guard` \| `meta-forensics`（与 `src/data/models.ts` 中的 id 一一对应） |

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
- `confidence`：浮点数，0–100，保留 1 位小数
- `inference_ms`：整数，纯模型推理耗时
- `model_id`：回显请求的模型 id

错误响应（响应体统一为 `{"detail": "错误描述"}`）：

| 状态码 | 场景 |
|---|---|
| 400 | 文件不是合法图像 / 字段缺失 / `model_id` 非法 |
| 413 | 文件超过 10MB |
| 503 | 对应模型权重未加载（未部署该模型） |

前端需针对非 200 响应读取 `detail` 并提示用户。

## 3. API 地址注入方式（必须按此实现）

使用 Vite 环境变量，**不要写死在代码里**：

- 仓库根目录建 `.env.production`（构建线上包时生效）：

  ```
  VITE_API_BASE_URL=https://<当前有效的隧道地址>
  ```

- 本地联调建 `.env.local`（`npm run dev` 时生效，覆盖 `.env.production`）：

  ```
  VITE_API_BASE_URL=https://<当前有效的隧道地址>
  ```

注意事项：

- 地址**不要加尾部斜杠**；
- `.env.local` 不应提交 git（确认它在 `.gitignore` 中）；
- 代码中取值：`import.meta.env.VITE_API_BASE_URL`；
- **地址更新流程**：后端重启后 → 索取新地址 → 改 `.env.production` / `.env.local` → 重新构建部署（GitHub Pages 需重新 push 触发 Actions）或重启本地 dev server。代码本身不用动。

## 4. 调用示例（Detector.tsx 改造）

把现有 mock 的 `setTimeout` 替换为真实请求：

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const detect = async (file: File, modelId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('model_id', modelId);

  const resp = await fetch(`${API_BASE_URL}/api/detect`, {
    method: 'POST',
    body: formData,  // 不要手动设置 Content-Type，浏览器会自动带 boundary
  });

  if (!resp.ok) {
    let msg = `检测失败（HTTP ${resp.status}）`;
    try {
      const err = await resp.json();
      if (err.detail) msg = err.detail;
    } catch { /* 响应体非 JSON 时用默认提示 */ }
    throw new Error(msg);
  }

  // { label: "AI生成" | "真实", confidence: number, model_id: string, inference_ms: number }
  return await resp.json();
};
```

集成要点：

- loading 状态复用已有的 `isDetecting`；
- `detect` 抛出的错误在 UI 上以 toast/提示条展示 `error.message`；
- 网络层错误（地址失效、服务未启动）`fetch` 会直接 reject，提示“无法连接检测服务，请联系后端确认服务地址”；
- 建议联调阶段先调一次 `/api/health` 验证地址有效性，失败时给出明确提示，方便排查“是代码问题还是地址过期”。

## 5. CORS 说明

后端已放行以下源，前端无需额外配置：

- `https://angel4me.github.io`（线上 GitHub Pages）
- `http://localhost:5173`（本地 Vite 调试）

如果前端本地调试用了其他端口（如 5174），或更换了 Pages 域名，需要通知后端在 CORS 白名单中添加，否则浏览器会拦截请求（控制台报 CORS 错误，这不是前端代码能绕过的）。

## 6. 其他约束

- 上传图片 ≤ 10MB，超出返回 413；建议前端在选择文件时先做大小预检，提前提示；
- 支持 jpg/png/webp/bmp；后端以实际解码结果为准，不信任文件扩展名和 Content-Type；
- 请求可能经 Cloudflare 隧道转发，冷启动或网络抖动时偶发延迟，建议给请求设置合理的 loading 表现，不必设置过短的超时。

## 7. 联调验收清单

1. `curl {API_BASE_URL}/api/health` 返回 200，`models` 含三个模型 id；
2. 本地 `npm run dev` 页面上传图片，能拿到符合第 2.2 节格式的 JSON，标签颜色渲染正确；
3. GitHub Pages 线上页面同样调通（说明 CORS 与 HTTPS 混合内容问题均已解决）；
4. 上传 txt 等非图像文件，页面正确展示后端返回的 400 错误文案；
5. 把 `.env.production` 中的地址改成一个错误地址，页面能给出“无法连接”类提示（验证地址失效场景的错误处理）。
