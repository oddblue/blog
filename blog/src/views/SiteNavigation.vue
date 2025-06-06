<template>
    <el-container>
        <AddPostForm ref="addFormRef" />
        <el-header>
            <el-affix :offset="0">
                <Navbar  @openDialog="handleClick"/>
            </el-affix>
        </el-header>
        <AddForm ref="addWebFormRef" @submit-success="handleFormSubmit" />
        <UpdateForm ref="updateFormRef" @submit-success="handleFormSubmit" :website="website" />
        <el-main class="navigation-container" v-if="loading">
            <el-button type="primary" :icon="Plus" class="floating-button" @click="handleWebClick" v-if="isAdmin"/>
            <el-row :gutter="40" justify="center">
                <el-col :span="16">
                    <div v-for="category in categories" :key="category" :id="category">
                        <el-row>
                            <h2>{{ category }}</h2>
                        </el-row>
                        <el-row :gutter="25">
                            <el-col :span="8" v-for="site in getSitesByCategory(category)" :key="site.id">
                                <SiteCard :site="site" @submit-success="handleFormSubmit"
                                    @update-success="updateWebsitesform" />
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :span="2">
                    <el-affix :offset="90">
                        <WebSiteList :categories="categories" />
                    </el-affix>
                </el-col>
            </el-row>
        </el-main>
        <el-empty :image-size="200" v-else>
            <el-button type="primary" @click="handleWebClick" v-if="isAdmin">添加网站信息</el-button>
        </el-empty>
    </el-container>
</template>

<script setup>
import { ref, onMounted, nextTick,provide,computed } from 'vue';
import SiteCard from '../components/website/SiteCard.vue';
import Navbar from '../components/navbar/Navbar.vue'
import AddForm from '../components/website/AddForm.vue';
import UpdateForm from '../components/website/UpdateForm.vue';
import WebSiteList from '../components/website/WebSiteList.vue';
import { Plus } from '@element-plus/icons-vue';
import { getWebsites } from '../api';
import AddPostForm from '../components/post/AddPostForm.vue';
import { useAuth0 } from '@auth0/auth0-vue';

const { isAuthenticated, isLoading,user } = useAuth0();

const isLoggedIn = computed(() => !isLoading.value && isAuthenticated.value);
// 检查用户是否为管理员
const isAdmin = computed(() => {
    return isLoggedIn.value && user.value?.['https://blog-eosin-iota.vercel.app/role'] === 'admin';
});


const sites = ref([]);// 存储网站数据
const categories = ref([]);// 存储唯一类别
const loading = ref(false);
const error = ref('');


// 获取网站数据
const getWebsitesfetch = async () => {
    error.value = '';
    try {
        sites.value = await getWebsites();
        if (sites.value.length > 0) {
            loading.value = true;
        }
        // 提取唯一类别
        categories.value = [...new Set(sites.value.map((site) => site.metadata.classify))];
    } catch (err) {
        error.value = err.message;
        ElMessage.error(err.message);
    }
}

// 根据分类获取对应网址
const getSitesByCategory = (category) => {
    return sites.value.filter(site => site.metadata.classify === category);
};

// 表单组件引用
const addWebFormRef = ref(null);
const updateFormRef = ref(null);

const emit = defineEmits(['click']);
const handleWebClick = () => {
    addWebFormRef.value.openDialog();
}

//存储待更新网站信息，并传递给更新表单组件
const website = ref([]);
const updateWebsitesform = async (site) => {
    website.value = site;
    await nextTick(); // 确保DOM更新完成
    updateFormRef.value.openUpdateDialog();
}
//处理表单提交成功事件
const handleFormSubmit = () => {
    getWebsitesfetch(); // 重新获取数据
};

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

onMounted(() => {
    getWebsitesfetch();
});

</script>

<style scoped>
h2 {
    font-size: 1.5em;
    color: #333;
    margin-bottom: 15px;
}

.floating-button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    background-color: #409eff;
    color: #fff;
    border: none;
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    z-index: 1000;
    border-radius: 25%;
}

.floating-button:hover {
    background-color: #66b1ff;
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.floating-button:active {
    transform: scale(0.95);
}
</style>