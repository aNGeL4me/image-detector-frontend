const API_BASE_URL: string | undefined = import.meta.env.VITE_API_BASE_URL;

export interface DetectResponse {
  label: 'AI生成' | '真实';
  confidence: number;
  model_id: string;
  inference_ms: number;
}

function assertConfigured() {
  if (!API_BASE_URL) {
    throw new Error('未配置检测服务地址（VITE_API_BASE_URL），请联系管理员');
  }
}

/** 探测后端服务是否在线（也用于验证隧道地址是否过期） */
export async function checkHealth(): Promise<boolean> {
  if (!API_BASE_URL) return false;
  try {
    const resp = await fetch(`${API_BASE_URL}/api/health`);
    return resp.ok;
  } catch {
    return false;
  }
}

/** 上传图像并调用后端检测模型 */
export async function detectImage(file: File, modelId: string): Promise<DetectResponse> {
  assertConfigured();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('model_id', modelId);

  let resp: Response;
  try {
    resp = await fetch(`${API_BASE_URL}/api/detect`, {
      method: 'POST',
      body: formData, // 不手动设置 Content-Type，浏览器自动带 boundary
    });
  } catch {
    throw new Error('无法连接检测服务，服务地址可能已过期，请联系后端确认');
  }

  if (!resp.ok) {
    let msg = `检测失败（HTTP ${resp.status}）`;
    try {
      const err = await resp.json();
      if (err.detail) msg = err.detail;
    } catch {
      /* 响应体非 JSON 时用默认提示 */
    }
    throw new Error(msg);
  }

  return (await resp.json()) as DetectResponse;
}
