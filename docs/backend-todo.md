# 后端待完善事项（前端联调反馈）

> 前端已完成与 mock 接口的对接并上线（`https://angel4me.github.io/image-detector-frontend/`）。
> 本文档列出后端后续需要完善的事项，可直接交给后端 AI 作为开发依据。
> 前置文档：`backend-dev-guide.md`（总体要求）、`frontend-dev-guide.md`（对接契约）。

## 1. 【最高优先级】固定 API 公网地址

当前使用 Cloudflare 快速隧道（trycloudflare），**每次重启服务地址都会变**，前端必须改
`.env.production` 并重新构建部署才能恢复，无法长期使用。请改为以下任一方案：

- **方案 A（推荐）**：Cloudflare 命名隧道（Named Tunnel），绑定固定子域名
  （如 `detector-api.example.com`）。需要一个已接入 Cloudflare 的域名，免费。
  参考：`cloudflared tunnel create` → 配置 ingress → `cloudflared tunnel route dns`。
- **方案 B**：自有域名 + Nginx + certbot 签 HTTPS 证书，按 `backend-dev-guide.md` 第 6 节配置。
- 完成切换后，把新的固定地址告知前端负责人更新 `.env.production` 即可，只需一次。

## 2. 接入真实检测模型（替换 mock 推理）

当前 `/api/detect` 返回随机占位结果，且 `/api/health` 中 `cuda: false`。请逐个模型接入真实推理：

- 三个模型 id：`texdet`、`vit-guard`、`meta-forensics`，哪个先就绪就先接哪个，
  未接入的继续走 mock 或返回 503，**接口契约保持不变，前端无需任何改动**。
- 每个模型需要落实：
  1. 权重文件放入 `weights/`（不入 git）；
  2. 启动时（`lifespan`）一次性加载到 GPU，`model.eval()` + `torch.no_grad()`；
  3. 图像预处理（Resize / Normalize 等）必须与训练时一致，由模型提供方确认参数；
  4. 输出映射：模型输出的二分类概率 → `label`（`"AI生成"`/`"真实"`）+ `confidence`（0–100，1 位小数）。
- 接入后验收：`/api/health` 中 `cuda: true`；`inference_ms` 反映真实推理耗时；
  连续请求 20 次 `nvidia-smi` 显存占用平稳（无泄漏）。

## 3. GPU 推理的并发控制

真实模型上线后需要处理并发：

- Uvicorn 保持单 worker（多 worker 会重复加载模型、爆显存）；
- 推理函数用 `anyio.to_thread.run_sync` 或 `run_in_executor` 移出事件循环，避免阻塞；
- GPU 推理加 `asyncio.Lock`（或信号量限制并发数），防止多请求同时抢占显存导致 OOM；
- Nginx `proxy_read_timeout` 建议保持 60s 以上，容忍排队等待。

## 4. 可观测性（建议）

- 记录请求日志：时间、model_id、推理耗时、结果 label、HTTP 状态码（**不要记录图像内容本身**）；
- 可选：暴露一个简单的 `/api/stats`（请求总量、平均耗时），便于演示时展示。

## 5. 安全加固（上线前检查）

- 速率限制（如 Nginx `limit_req` 或 slowapi），防止公开接口被刷爆 GPU；
- 确认 10MB 限制在 Nginx（`client_max_body_size`）和应用层（413）同时生效；
- 服务器防火墙只放行 443 与 SSH，8000 端口不对公网开放。

## 6. 完成标准

1. 固定 HTTPS 地址，重启服务后地址不变；
2. 至少一个模型为真实推理，`cuda: true`，前端页面检测历史显示合理的结果与耗时；
3. 前端 `.env.production` 更新为固定地址后，不再因后端重启而需要改动。
