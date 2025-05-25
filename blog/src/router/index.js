import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Post from '../views/Post.vue'
import SiteNavigation from '../views/SiteNavigation.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {//用户点击空文件夹触发
        path: '/post/folder/:nowfolders',
        name: 'FolderView',
        component: Post,
    },
    {//用户点击文件夹或笔记触发
        path: '/post/note/:nowfolders/:note',
        name: 'NoteView',
        component: Post,
    },
    //{//用户点击顶级文件夹或点击概览触发
    //       path: '/post/overview/:topfolders',
    //      name: 'Overview',
    //      component: Post,
    //   },
    {
        path: '/sitecards',
        name: SiteNavigation,
        component: SiteNavigation
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
