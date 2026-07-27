import ModelSelector from '../components/ModelSelector';
import { useModelSelection } from '../hooks/useModelSelection';

export default function PerformancePage() {
  const { displayed, displayedId, selectedId, preview, select } = useModelSelection();

  return (
    <section id="performance" className="section">
      <h2>性能评估</h2>
      <p className="section-subtitle">悬停模型卡片可预览内容，点击卡片固定选择</p>

      <ModelSelector
        displayedId={displayedId}
        selectedId={selectedId}
        onPreview={preview}
        onSelect={select}
      />

      <div className="model-detail" key={displayed.id}>
        <h3 className="model-detail-name">
          {displayed.icon} {displayed.name} · 评估结果
        </h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>指标</th>
                <th>数值</th>
                <th>测试集</th>
              </tr>
            </thead>
            <tbody>
              {displayed.metrics.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td className="metric-value">{row.value}</td>
                  <td>{row.dataset}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
