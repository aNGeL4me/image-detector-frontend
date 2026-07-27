import ModelSelector from '../components/ModelSelector';
import { useModelSelection } from '../hooks/useModelSelection';

export default function ModelPage() {
  const { displayed, displayedId, selectedId, preview, select } = useModelSelection();

  return (
    <section id="model" className="section">
      <h2>模型介绍</h2>
      <p className="section-subtitle">悬停模型卡片可预览内容，点击卡片固定选择</p>

      <ModelSelector
        displayedId={displayedId}
        selectedId={selectedId}
        onPreview={preview}
        onSelect={select}
      />

      <div className="model-detail" key={displayed.id}>
        <h3 className="model-detail-name">
          {displayed.icon} {displayed.name}
        </h3>
        <p className="model-detail-desc">{displayed.description}</p>
        <div className="feature-grid">
          {displayed.features.map((item) => (
            <div key={item.title} className="feature-card">
              <div className="feature-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
