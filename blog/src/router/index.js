import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Post from '../views/Post.vue'
import SiteNavigation from '../views/SiteNavigation.vue';
import CallBack from '../components/home/CallBack.vue';
import Dashboard from '../components/home/Dashboard.vue';

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
    {
        path: '/sitecards',
        name: SiteNavigation,
        component: SiteNavigation
    },
    {
        path: '/callback',
        name: CallBack,
        component: CallBack
    },
        {
        path: '/dashboard',
        name: Dashboard,
        component: Dashboard
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
