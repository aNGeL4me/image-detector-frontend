import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* GitHub Pages 是纯静态托管，不支持前端路由回退，
        使用 HashRouter 避免刷新子页面出现 404 */}
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
