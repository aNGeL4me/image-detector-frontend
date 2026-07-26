import { useState } from 'react';

interface DetectionResult {
  id: number;
  imageUrl: string;
  label: '真实' | 'AI生成';
  confidence: number;
  timestamp: string;
}

export default function Detector() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [results, setResults] = useState<DetectionResult[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDetect = () => {
    if (!selectedFile) return;

    setIsDetecting(true);

    setTimeout(() => {
      const isFake = Math.random() > 0.5;
      const confidence = (85 + Math.random() * 14).toFixed(1);

      const newResult: DetectionResult = {
        id: Date.now(),
        imageUrl: previewUrl,
        label: isFake ? 'AI生成' : '真实',
        confidence: parseFloat(confidence),
        timestamp: new Date().toLocaleTimeString(),
      };

      setResults((prev) => [newResult, ...prev]);
      setIsDetecting(false);
    }, 1200);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

  return (
    <section id="detector" className="section">
      <h2>在线检测</h2>
      <p className="section-subtitle">上传图片，体验 AI 检测效果</p>

      <div className="detector-box">
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
