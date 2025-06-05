<!-- components/SiteCard.vue -->
<template>
    <el-card shadow="hover" class="site-card" @click="goToSite" :title="site.url" @mouseenter="isHovered = true"
        @mouseleave="isHovered = false">
        <el-button-group v-show="isHovered" class="buttongroup">
            <el-button type="primary" size="small" :icon="Edit" aria-label="修改网站信息" @click.stop="updateWebsitesform" />
            <el-button type="danger" size="small" :icon="Delete" @click.stop="deleteWebsitesfetch(site._id)"
                aria-label="删除网站信息" />
        </el-button-group>
        <el-row justify="center">
            <el-col :span="4">
                <el-image style="width: 40px; height: 40px" :src="site.logo" fit="fill" />
            </el-col>
            <el-col :span="20">
                <el-text type="primary" size="large" class="block-text"> {{ site.name }}</el-text>
                <el-text size="default" class="block-text multi-line-clamp">{{ site.description || '暂无描述' }}</el-text>
            </el-col>
        </el-row>
    </el-card>
</template>

<script setup>
import { defineProps, ref } from 'vue';
import { Delete, Edit } from '@element-plus/icons-vue'
import { deleteWebsite } from '../../api';
import { ElMessageBox, ElMessage } from 'element-plus';


const isHovered = ref(false);

const props = defineProps({
    site: {
        type: Object,
        required: true
    }
});


const goToSite = () => {
    window.open(props.site.url, '_blank');
};

// 定义 emit 事件
const emit = defineEmits(['submit-success', "update-success"]);

// 删除网站信息的函数
const deleteWebsitesfetch = async (id) => {
    try {
        await ElMessageBox.confirm('确定要删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        });
        await deleteWebsite(id);
        ElMessage.success('删除成功');
        emit('submit-success');
    } catch (error) {
        ElMessage.error('删除失败');
    }
}

//打开修改网站信息的对话框,并给出默认值
const updateWebsitesform = () => {
    emit('update-success', props.site);
}
</script>
<style scoped>
.site-card {
    width: 100%;
    max-width: 400px;
    margin: 10px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    /* 确保删除按钮相对于卡片定位 */
    cursor: pointer;
}

/* 删除按钮样式 */
.buttongroup {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
    /* 确保按钮在卡片内容上方 */
}

.el-row {
    align-items: center;
}

.block-text {
    display: block;
}

.multi-line-clamp {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    min-width: 15vw;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    /* 限制两行 */
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    /* 长单词换行 */
}
</style>