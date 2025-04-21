import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Post from '../views/Post.vue'
import SiteNavigation from '../views/SiteNavigation.vue';
// 预加载所有 .md 文件
const modules = import.meta.glob('../posts/**/*.md', { query: '?raw', import: 'default', eager: true });

// 将所有 .md 文件路径规范化并存储
const mdPaths = Object.keys(modules).map((path) =>
    path.split('/').filter(Boolean).slice(1).join('/').replace('.md', '')
);


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/posts/:pathMatch(.*)*',
        //:pathMatch 是一个命名参数，表示匹配 /posts/ 后的路径段。pathMatch = ['笔记', 'CSS', 'css-animation.md']
        //(.*)* 是一个通配符模式，允许匹配任意数量的路径段（包括零个）。
        name: 'Post',
        component: Post,
        props: (route) => ({
            path: `/posts/${route.params.pathMatch.join('/')}`,
            //route.params.pathMatch 是一个数组，包含 :pathMatch 捕获的路径段。
            //join('/') 将数组用 / 连接成字符串，并添加 /posts/ 前缀。
        })
    },
    {
        path: '/sitecards',
        name: SiteNavigation,
        component: SiteNavigation
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return {
            el: '.mdcontent', // 替换为你的 Markdown 容器选择器
            top: 0,
        };
    },
});

export default router;
