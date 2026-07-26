import Hero from '../components/Hero';
import Detector from '../components/Detector';
import { news } from '../data/news';

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="about" className="section">
        <h2>项目介绍</h2>
        <div className="about-content">
          <p>
            近年来，AI 生成图像的质量得到了显著提升，人眼已经很难分辨真实图像与生成图像。
            逼真的虚假图像加剧了人们对虚假信息传播的担忧。为了解决这一问题，
            各种虚假图像检测方法被相继提出。
          </p>
          <p>
            本项目旨在构建一个生成式图像检测系统：基于深度学习模型对输入图像进行判定，
            给出「真实」或「AI 生成」的结论及置信度，并通过下方的前端界面提供在线检测体验。
            关于模型架构与评估结果的更多信息，请参阅「模型介绍」与「性能评估」页面。
          </p>
        </div>
      </section>

      <section id="news" className="section">
        <h2>🌟 最新动态</h2>
        <div className="news-list">
          {news.map((item) => (
            <div key={item.date} className="news-item">
              <span className="news-date">
                [{item.date} {item.tag}]
              </span>
              <span className="news-content">{item.content}</span>
            </div>
          ))}
        </div>
      </section>

      <Detector />
    </>
  );
}
