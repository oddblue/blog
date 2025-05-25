<template>
    <el-menu mode="horizontal" router>
        <el-menu-item class="logo" index="/">首页</el-menu-item>
        <AddPostForm ref="addFormRef" />
        <div v-for="menu in tagtreecontent">
            <MenuItems v-if="menu.children.length > 0 || menu.notes.length > 0" :submenu="menu" />
            <el-menu-item :index="`/post/folder/${menu._id}`" v-else>
                📁 {{ menu.name }}
            </el-menu-item>
        </div>
        <el-menu-item index='/sitecards'>网址导航 </el-menu-item>
        <el-menu-item @click="handleClick">笔记上传 </el-menu-item>
        <!--<el-menu-item>深色模式</el-menu-item>-->
        <!--<el-menu-item>git</el-menu-item>-->
    </el-menu>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllTree } from '../../api';
import { ElMessage } from 'element-plus';
import MenuItems from './MenuItem.vue';
import AddPostForm from '../post/AddPostForm.vue';

const tagtreecontent = ref([]);

const emit=defineEmits(['get-allnotes']);



const tagTree = async () => {
    try {
        const response = await getAllTree();
        tagtreecontent.value = response
        emit('get-allnotes',tagtreecontent.value);
        //console.log(tagtreecontent)
        //console.log(tagtreecontent.value.find(item => item._id === "6812b82d6abf820a39f12c22"))
    } catch (err) {
        //console.error('Failed to fetch menu data:', err);
        ElMessage.error('Failed to fetch menu data:')
    }
};

const addFormRef = ref(null);

const handleClick = () => {
    addFormRef.value.openDialog();
}


onMounted(() => {
    tagTree();
});
</script>


<style scoped>
.logo {
    font-size: 24px;
    font-weight: bold;
    margin-left: 10%;
    cursor: pointer;
}
</style>