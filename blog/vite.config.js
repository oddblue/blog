import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { plugin as markdown } from 'vite-plugin-markdown';
import MarkdownIt from 'markdown-it';

import svgLoader from 'vite-svg-loader'; // 导入 vite-svg-loader


const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export default defineConfig({
  plugins: [
    vue(),
    markdown({
      markdownIt: md,
    }),
    svgLoader() // 添加 vite-svg-loader
  ],
});