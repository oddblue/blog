<template>
    <el-container>
        <AddPostForm ref="addFormRef" />
        <el-header>
            <Navbar @openDialog="handleClick" />
        </el-header>
        <el-main>
            <div>
                <ShowContent  @openDialog="handleClick" />
            </div>
        </el-main>
        <el-footer>
            <LightBack />
        </el-footer>
    </el-container>
</template>
<script setup>
import { ref, provide } from 'vue';
import Navbar from '../components/navbar/Navbar.vue';
import LightBack from '../components/home/LightBack.vue';
import ShowContent from '../components/home/ShowContent.vue';
import AddPostForm from '../components/post/AddPostForm.vue';

const notification = ref(false);

// 切换状态以触发通知
provide('noteList', () => {
    notification.value = !notification.value;
});
// 提供状态给 目录列表 监听
provide('notification', notification);

const addFormRef = ref(null);
//打开笔记上传表单
const handleClick = () => {
    addFormRef.value.openDialog();
}
</script>
<style scoped>
.el-container {
    position: relative;
    height: 100vh;
    overflow: hidden;
}

.el-header {
    width: 100vw;
    z-index: 1000;
    background-color: white;
}

.el-main {
    display: flex;
    justify-content: center;
    flex-grow: 1;
    /* 让 main 占据剩余空间 */
    display: flex;
    align-items: flex-end;
    /* 内容垂直底部对齐 */
}

.el-footer {
    position: absolute;
    top: 0;
    width: 80vw;
    height: 80vh;
    z-index: -1;
}
</style>
