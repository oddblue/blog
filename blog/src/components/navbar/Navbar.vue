<template>
    <el-menu mode="horizontal" router :ellipsis="false">
        <el-menu-item class="logo" index="/">首页</el-menu-item>
        <AddPostForm ref="addFormRef" @post-success="refreshPost" />
        <div v-for="menu in tagtreecontent">
            <MenuItems v-if="menu.children.length > 0 || menu.notes.length > 0" :submenu="menu" />
            <el-menu-item :index="`/post/folder/${menu._id}`" v-else>
                📁 {{ menu.name }}
            </el-menu-item>
        </div>
        <el-menu-item index='/sitecards'>网址导航 </el-menu-item>
        <el-menu-item @click="navbarOpenDialog">笔记上传 </el-menu-item>
        <div class="icon-container" @mouseenter="showLogin = true" @mouseleave="showLogin = false">
            <el-menu-item @click="goGithub">
                <img src="../../assets/logo/github-fill.svg" class="github-icon" :class="{ 'move-left': showLogin }" />
            </el-menu-item>
            <el-menu-item @click="login" v-if="!isAuthenticated">
                <img src="../../assets/logo/login.svg" class="login-icon" :class="{ 'show': showLogin }" />
            </el-menu-item>
            <el-menu-item @click="logoutFn" v-else>
                <img src="../../assets/logo/logout.svg" class="login-icon" :class="{ 'show': showLogin }" />
            </el-menu-item>
        </div>
    </el-menu>
</template>

<script setup>
import { ref, onMounted, inject, watch } from 'vue';
import { getAllTree } from '../../api';
import { ElMessage } from 'element-plus';
import MenuItems from './MenuItem.vue';
import AddPostForm from '../post/AddPostForm.vue';
import { useRouter } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';

const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

const isLoggingIn = ref(false);
const login = () => {
    if (isLoggingIn.value) return;
    isLoggingIn.value = true;
    try {
        loginWithRedirect();
    } catch (err) {
        console.error('登录错误:', err);
    } finally {
        isLoggingIn.value = false;
    }
};
const logoutFn = () =>
    logout({ logoutParams: { returnTo: 'https://blog-nn1f8tvsf-oddblues-projects.vercel.app' } });



const router = useRouter();
const tagtreecontent = ref([]);



const showLogin = ref(false);

//通知：将获取文件夹内容提交home页面，用于跳转笔记页面
const emit = defineEmits(['openDialog']);

const navbarOpenDialog = () => {
    emit('openDialog');
}

//获取所有文件夹
const tagTree = async () => {
    try {
        const response = await getAllTree();
        tagtreecontent.value = response;
    } catch (err) {
        ElMessage.error('网络故障，请刷新重试');
    }
}

const notification = inject('notification');

watch(
    notification,
    (newValue) => {
        if (newValue) {
            tagTree();
        }
    }
);




const goGithub = () => {
    window.open("https://github.com/");
}

const refreshPost = (postResponse) => {
    router.push(`/post/note/${postResponse.tag}/${postResponse._id}`);
}

onMounted(() => {
    tagTree();
});
</script>


<style scoped>
.el-menu--horizontal>.el-menu-item:nth-child(1) {
    margin-right: auto;
}

.logo {
    font-size: 24px;
    font-weight: bold;
    margin-left: 10%;
    cursor: pointer;
}

.icon-container {
    display: flex;
    align-items: center;
    position: relative;
    height: 100%;
}

.github-icon {
    width: 24px;
    height: 24px;
    transition: transform 0.3s ease;
}

.login-icon {
    width: 24px;
    height: 24px;
    opacity: 0;
    transform: translateX(-5px);
    /* 初始位置稍微偏左 */
    transition: opacity 0.3s ease, transform 0.3s ease;
    /* 平滑显示和移动动画 */

}

.github-icon.move-left {
    transform: translateX(-5px);

}

.login-icon.show {
    opacity: 1;
    transform: translateX(0);

}
</style>