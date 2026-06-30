import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 800
  },
  // 如果部署到 GitHub Pages 项目页面（如 https://用户名.github.io/仓库名/）
  // 请取消下面注释并替换为仓库名称：
  // base: '/psychology/',
})
