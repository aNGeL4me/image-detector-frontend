import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署在子路径下：https://<用户名>.github.io/image-detector-frontend/
  // 如果你的仓库名不同，把这里改成 '/<你的仓库名>/'
  base: '/image-detector-frontend/',
})
