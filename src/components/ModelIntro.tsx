const features = [
  {
    title: '高准确率',
    description: '在多个公开数据集上达到 95%+ 的检测准确率',
    icon: '🎯',
  },
  {
    title: '快速推理',
    description: '单张图片检测耗时低于 100ms，支持批量处理',
    icon: '⚡',
  },
  {
    title: '多模型支持',
    description: '兼容 CNN、ViT 等多种骨干网络架构',
    icon: '🔧',
  },
];

export default function ModelIntro() {
  return (
    <section id="model" className="section">
      <h2>模型介绍</h2>
      <p className="section-subtitle">
        我们的检测模型基于 Vision Transformer 架构，专门针对生成式图像的纹理特征进行优化
      </p>
      <div className="feature-grid">
        {features.map((item) => (
          <div key={item.title} className="feature-card">
            <div className="feature-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
