import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <NavLink to="/" className="logo">
          AI Detector
        </NavLink>
        <nav>
          <NavLink to="/" end>
            首页
          </NavLink>
          <NavLink to="/model">模型介绍</NavLink>
          <NavLink to="/performance">性能评估</NavLink>
          <NavLink to="/team">团队</NavLink>
          <NavLink to="/docs">文档</NavLink>
        </nav>
      </div>
    </header>
  );
}
