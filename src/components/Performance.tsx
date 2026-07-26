const metrics = [
  { name: '准确率', value: '96.2%', dataset: 'GenImage' },
  { name: '精确率', value: '95.8%', dataset: 'GenImage' },
  { name: '召回率', value: '96.5%', dataset: 'GenImage' },
  { name: 'F1 分数', value: '96.1%', dataset: 'GenImage' },
  { name: '推理速度', value: '87ms', dataset: '单张图片' },
];

export default function Performance() {
  return (
    <section id="performance" className="section">
      <h2>性能参数</h2>
      <p className="section-subtitle">模型在标准测试集上的评估结果</p>
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
            {metrics.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td className="metric-value">{row.value}</td>
                <td>{row.dataset}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
