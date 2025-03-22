import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { plugin as markdown } from 'vite-plugin-markdown'; // 使用命名导入

export default defineConfig({
  plugins: [
    vue(),
    markdown({
      mode: ['html', 'toc'],
      markdownIt: {
        html: true,
      },
      markdownItSetup(md) {
        md.use(require('markdown-it-anchor'));
      },
      // 更新 glob 选项
      glob: {
        query: '?raw',
        import: 'default'
      }
    })
  ]
});