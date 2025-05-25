import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';


export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    proxy: {
      // 将以 /api 开头的请求代理到后端服务器
      '/api': {
        target: 'http://localhost:3000', // 后端 API 地址
        changeOrigin: true, // 修改请求头中的 Origin
        rewrite: (path) => path.replace(/^\/api/, '') // 去除请求路径中的 /api 前缀
      }
    }
  }
});