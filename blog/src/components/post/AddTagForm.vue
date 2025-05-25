<template>
    <!-- dialog 用户对话提示框 -->
    <el-dialog title="提交笔记" v-model="dialogVisible" width="30%" @close="resetForm">
        <!-- form 用户表单 -->
        <el-form :model="form" :rules="rules" ref="formRef" label-width="auto">
            <!-- 文件夹名称-->
            <el-form-item label="文件夹名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入文件夹名称" />
            </el-form-item>
            <!-- 归属文件夹-->
            <el-form-item label="选择所属文件夹" prop="parentId">
                <el-cascader v-model="form.parentId" :options="options" :show-all-levels="false" :props="props"
                    clearable />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm">提交</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue';
import { createTag, getTagTree } from '../../api';
import { ElMessage } from 'element-plus';

//获取标签树并转换为级联选择器所需格式
const options = ref([]);
// 数据转换函数
const transformMenuData = (menuData) => {
    return menuData.map((item) => ({
        value: item._id,
        label: item.name,
        children: item.children?.length ? transformMenuData(item.children) : [],
    }));
};

// 获取并转换数据
const fetchData = async () => {
    try {
        const menuData = await getTagTree(); // 调用 API
        options.value = transformMenuData(menuData); // 转换数据
    } catch (error) {
        console.error(error);
    }
};

const props = {
    checkStrictly: true,//任意选择子节点
    emitPath: false, // 关键：只返回选中的子节点值
}


// 提交表单
const submitForm = async () => {
    try {
        // 验证表单formRef.value.validate根据rules规则验证表单
        const valid = await formRef.value.validate();
        if (valid) {
            const result = { name: form.name };
            if (form.parentId) {
                console.log('选择的父级ID:');
                result.parentId = form.parentId;
            }
            await createTag(form)
            ElMessage.success('创建文件夹成功！');
            dialogVisible.value = false;
            resetForm();
            fetchData()
            // 派发事件通知父组件
            emit('tag-created');
        }
    } catch (error) {
        ElMessage.error('提交失败：' + (error.message || '服务器错误'));
        console.error('提交错误:', error);
    }
};
// 定义派发的事件
const emit = defineEmits(['tag-created']);

// 控制对话框显示
const dialogVisible = ref(false);

// 表单数据
const form = reactive({
    name: '',
    parentId: '',
});

// 表单引用
const formRef = ref(null);

// 表单验证规则，required表示必填，message表示提示信息，trigger表示触发时机，blur表示失去焦点时触发，change表示改变时触发
const rules = {
    name: [{ required: true, message: '创建文件夹名称', trigger: 'change' }],
    parentId: [{ required: false, message: '选择所属文件夹', trigger: 'blur' }],
};

// 重置表单
const resetForm = () => {
    form.name = '';
    form.parentId = '';
};

// 暴露打开对话框的方法
defineExpose({
    openDialog: () => {
        dialogVisible.value = true;
    },
});
onMounted(() => {
    fetchData(); // 获取数据
});
</script>