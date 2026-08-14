import { useEffect, useState } from 'react';
import ModelSelector from './ModelSelector';
import { useModelSelection } from '../hooks/useModelSelection';
import { checkHealth, detectImage } from '../api/detector';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 与后端限制一致：10MB

interface DetectionResult {
  id: number;
  imageUrl: string;
  label: '真实' | 'AI生成';
  confidence: number;
  modelName: string;
  inferenceMs: number;
  timestamp: string;
}

export default function Detector() {
  const { displayed, displayedId, selectedId, preview, select } = useModelSelection();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [error, setError] = useState<string>('');
  const [serviceOnline, setServiceOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkHealth().then(setServiceOnline);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError('图片超过 10MB 上限，请选择更小的文件');
      e.target.value = '';
      return;
    }

    setError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDetect = async () => {
    if (!selectedFile) return;

    setIsDetecting(true);
    setError('');

    try {
      const data = await detectImage(selectedFile, displayed.id);
      const newResult: DetectionResult = {
        id: Date.now(),
        imageUrl: previewUrl,
        label: data.label,
        confidence: data.confidence,
        modelName: displayed.name,
        inferenceMs: data.inference_ms,
        timestamp: new Date().toLocaleTimeString(),
      };
      setResults((prev) => [newResult, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '检测失败，请稍后重试');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
  };

  return (
    <section id="detector" className="section">
      <h2>在线检测</h2>
      <p className="section-subtitle">选择检测模型，上传图片，体验 AI 检测效果</p>

      {serviceOnline !== null && (
        <p className={`service-status ${serviceOnline ? 'online' : 'offline'}`}>
          {serviceOnline
            ? '● 检测服务在线'
            : '● 检测服务当前不可用（服务地址可能已过期，请联系后端确认）'}
        </p>
      )}

      <ModelSelector
        displayedId={displayedId}
        selectedId={selectedId}
        onPreview={preview}
        onSelect={select}
      />

      <div className="detector-box">
        <p className="detector-current-model">
          当前模型：{displayed.icon} {displayed.name}
        </p>
        <label htmlFor="file-input" className="upload-btn">
          选择图片
        </label>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          hidden
        />

        {error && <p className="error-banner">{error}</p>}

        {previewUrl && (
          <div className="preview-box">
            <img src={previewUrl} alt="预览" />
            <div className="actions">
              <button onClick={handleDetect} disabled={isDetecting}>
                {isDetecting ? '检测中...' : '开始检测'}
              </button>
              <button onClick={handleReset} className="secondary">
                重新选择
              </button>
            </div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="history-section">
          <h3>检测历史</h3>
          <div className="result-list">
            {results.map((item) => (
              <div key={item.id} className="result-item">
                <img src={item.imageUrl} alt="检测记录" />
                <div className="result-info">
                  <span className={`label ${item.label === 'AI生成' ? 'fake' : 'real'}`}>
                    {item.label}
                  </span>
                  <span className="confidence">置信度：{item.confidence}%</span>
                  <span className="model-used">
                    模型：{item.modelName} · 耗时 {item.inferenceMs}ms
                  </span>
                  <span className="time">{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
