<template>
    <AddUpdated ref="openAddUpdatedRef" />
    <el-dialog v-model="dialogVisible" align-center style="height: 500px; overflow: auto;">
        <el-text size="large">更新日志</el-text>
        <el-button @click="openAddUpdated" type="primary" v-if="isAdmin">添加日志</el-button>
        <div class="content">
            <el-timeline style="max-width: 600px">
                <el-timeline-item :timestamp=updated.createdAt placement="top" v-for="updated in updatedContent">
                    <el-card>
                        <p>{{ updated.description }}</p>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue'
import { getUpdate } from "../../api/index"
import AddUpdated from './AddUpdated.vue'
import { useAuth0 } from '@auth0/auth0-vue';
const { isAuthenticated,user, isLoading } = useAuth0();

const isLoggedIn = computed(() => !isLoading.value && isAuthenticated.value);
// 检查用户是否为管理员
const isAdmin = computed(() => {
    return isLoggedIn.value && user.value?.['https://blog-eosin-iota.vercel.app/role'] === 'admin';
});

const updatedContent = ref([])

const getupdatedContent = async () => {
    const response = await getUpdate();
    updatedContent.value =
        response.map(item => ({
            ...item,
            createdAt: item.createdAt ? item.createdAt.substring(0, 10) : '',
        }))
        ;
    //console.log(updatedContent.value)
}


//打开添加日志表单
const openAddUpdatedRef = ref(null)
const openAddUpdated = () => {
    openAddUpdatedRef.value.openDialog();
}


// 控制对话框显示
const dialogVisible = ref(false);
// 暴露打开对话框的方法
defineExpose({
    openDialog: () => {
        dialogVisible.value = true;
    },
});

onMounted(() => {
    getupdatedContent()
})
</script>
<style scoped>
.el-button {
    position: fixed;
    bottom: 25%;
    right: 28%;
}

.content {
    overflow: hidden;
}
</style>