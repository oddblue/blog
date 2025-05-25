<template>
    <UpdateContent ref="updateContentRef" />
    <AddPostForm ref="addFormRef" />
    <el-row :gutter="20" class="first-content">
        <el-col :span="6">
            <div class="nav-item" @click="handleFirstNote">
                <span>📔文档</span>
                <span>➡️</span>
            </div>
        </el-col>
        <el-col :span="6">
            <router-link to="/sitecards" class="nav-item">
                <span>🔗 网址导航</span>
                <span>➡️</span>
            </router-link>
        </el-col>
        <el-col :span="6">
            <div class="nav-item" @click="handleClick">
                <span>📂 笔记上传</span>
                <span>➡️</span>
            </div>
        </el-col>
        <el-col :span="6">
            <el-popover placement="top-start" title="该功能暂未开放" :width="200" trigger="hover">
                <template #reference>
                    <div class="nav-item">
                        <span>📬 留言板</span>
                        <span>➡️</span>
                    </div>
                </template>
            </el-popover>
        </el-col>
    </el-row>
    <el-row :gutter="20" class="second-content">
        <el-col :span="8">
            <el-popover placement="top-start" title="该功能暂未开放" :width="200" trigger="hover">
                <template #reference>
                    <div class="nav-item">
                        <span>
                            <img src="https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico"
                                style="width: 25px; height: 25px;" />
                            微信小程序
                        </span>
                        <span>➡️</span>
                    </div>
                </template>
            </el-popover>
        </el-col>
        <el-col :span="8">
            <div class="nav-item" @click="openUpdated">
                <span>🗑️更新日志</span>
                <span>➡️</span>
            </div>
        </el-col>
        <el-col :span="8">
            <div class="nav-item" @click="goToSite"> 
                    <span>🔓 git</span>
                    <span>➡️</span>
            </div>
        </el-col>
    </el-row>
</template>
<script setup>
import { ref } from 'vue'
import UpdateContent from './UpdateContent.vue';
import AddPostForm from '../post/AddPostForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
    notes: {
        type: Object,
        required: true
    }
});

//跳转开源项目网址
const goToSite = () => {
    window.open(props.site.url, '_blank');
};

function findFirstNoteId(data) {
    function traverse(obj) {

        // 检查当前层的笔记
        if (obj.notes && obj.notes.length > 0) {
            return { noteId: obj.notes[0]._id, nowfolders: obj._id }; // 返回第一个笔记的 _id
        }

        // 递归检查子节点
        if (obj.children && obj.children.length > 0) {
            for (const child of obj.children) {
                const result = traverse(child);
                if (result) return result; // 返回子节点中找到的第一个 _id
            }
        }

        return null; // 当前对象没有笔记
    }

    // 遍历所有顶级对象
    for (const item of data) {
        const result = traverse(item);
        if (result) return result; // 返回第一个找到的 _id
    }

    // 如果没有找到笔记，抛出错误
    throw new Error("数据结构中未找到任何笔记");
}



const handleFirstNote = () => {

    const { noteId, nowfolders } = findFirstNoteId(props.notes);

    console.log(findFirstNoteId(props.notes))

    if (noteId) {
        router.push(`/post/note/${nowfolders}/${noteId}`);
    }
    else {
        router.push(`/post/folder/${props.notes._id}`);
    }

}


//打开提交更新日志弹出框
const updateContentRef = ref(null)
const openUpdated = () => {
    updateContentRef.value.openDialog();
}


//打开更新日志弹出框
const addFormRef = ref(null);
const handleClick = () => {
    addFormRef.value.openDialog();
}

</script>
<style scoped>
.first-content,
.second-content {
    width: 80vw;
    margin-bottom: 20px;
}

.nav-item {
    color: white;
    height: 18vh;
    max-height: 170px;
    transition: all 0.1s;
    cursor: pointer;
    border-radius: 8px;
    min-width: 150px;
    font-size: 24px;
    padding: 10px;
        display: flex;
    justify-content: space-between;
}

a {

    text-decoration: none;
    /* 去除下划线 */
    color: white;
}

/* 自定义背景色，模仿图片效果 */
.first-content .el-col:nth-child(1) .nav-item {
    background: #5A5A7B;
}

.first-content .el-col:nth-child(2) .nav-item {
    background: #C5A47E;
}

.first-content .el-col:nth-child(3) .nav-item {
    background: #8A3C3C;
}

.first-content .el-col:nth-child(4) .nav-item {
    background: #2E7D7A;
}

.second-content .el-col:nth-child(1) .nav-item {
    background: #1A4A4E;
}

.second-content .el-col:nth-child(2) .nav-item {
    background: #F28C38;
}

.second-content .el-col:nth-child(3) .nav-item {
    background: #D47A8A;
}
</style>