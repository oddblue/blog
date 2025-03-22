import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Post from '../views/Post.vue'

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
        name: 'Post',
        component: Post,
        props: (route) => ({
            path: `/posts/${route.params.pathMatch.join('/')}`,
        }),
        beforeEnter: (to, from, next) => {
            //检查请求的路径是否直接对应一个 Markdown 文件（通过 mdPaths 数组判断）。
            //如果不是 .md 文件，而是文件夹路径，则查找该文件夹下的第一个 .md 文件并重定向。
            //例如，访问 /posts/blog 时，如果 /posts/blog/post1.md 存在，则重定向到 /posts/blog/post1.md。
            const fullPath = `/posts/${to.params.pathMatch.join('/')}`;
            const isMdFile = mdPaths.some((mdPath) => mdPath === fullPath);

            if (!isMdFile) {
                // 如果是文件夹，找到该文件夹下的第一个 .md 文件
                const folderPrefix = fullPath + '/';
                const subFiles = mdPaths.filter((mdPath) => mdPath.startsWith(folderPrefix));

                if (subFiles.length > 0) {
                    // 按路径排序（可选），取第一个
                    subFiles.sort(); // 确保顺序一致
                    const firstMdPath = subFiles[0];
                    next(`/posts/${firstMdPath}`);
                } else {
                    next(); // 无 .md 文件，保持原路径
                }
            } else {
                next(); // 是 .md 文件，直接进入
            }
        },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
