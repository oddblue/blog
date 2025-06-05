<template>
    <el-dialog title="添加新条目" v-model="dialogVisible" width="30%" @close="resetForm">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="网站LOGO" prop="logo">
                <el-upload :action="''" :before-upload="beforeUpload" :http-request="handleUpload"
                    accept="image/png,image/svg+xml,image/x-icon,image/jpeg,image/webp" :show-file-list="false">
                    <el-button type="primary">上传LOGO</el-button>
                </el-upload>
                <el-input v-model="form.logo" placeholder="或输入logo Base64" style="margin-top: 10px" />
            </el-form-item>
            <el-form-item label="网站名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="网站描述" prop="description">
                <el-input v-model="form.description" type="textarea" placeholder="请输入描述" />
            </el-form-item>
            <el-form-item label="网站URL" prop="url">
                <el-input v-model="form.url" placeholder="请输入URL" />
            </el-form-item>
            <el-form-item label="网站分类" prop="classify">
                <el-input v-model="form.classify" placeholder="请输入分类或选择已有分类" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm">提交</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { createWebsite } from '../../api';

// 控制对话框显示
const dialogVisible = ref(false);

// 表单数据
const form = reactive({
    logo: '',
    name: '',
    description: '',
    url: '',
    classify: '',
});

// 表单引用
const formRef = ref(null);

// 表单验证规则，required表示必填，message表示提示信息，trigger表示触发时机，blur表示失去焦点时触发，change表示改变时触发
const rules = {
    logo: [{ required: true, message: '请输入或上传logo', trigger: 'change' }],
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
    url: [
        { required: true, message: '请输入URL', trigger: 'blur' },
        { type: 'url', message: '请输入有效的URL', trigger: 'blur' },
    ],
    classify: [{ required: true, message: '请输入分类', trigger: 'blur' }],
}

// 上传前验证文件类型
const beforeUpload = (file) => {
    const isSvgOrPng = ['image/png', 'image/svg+xml', 'image/x-icon', 'image/jpeg', 'image/webp'].includes(file.type);
    if (!isSvgOrPng) {
        ElMessage.error('仅支持上传 SVG、PNG、JPEG、WEBP 格式的图片！');
        return false;
    }
    return true;
}

// 自定义上传处理，将文件转换为 Base64
const handleUpload = (option) => {
    const file = option.file;
    const reader = new FileReader();
    reader.onload = (e) => {
        const base64String = e.target.result;
        // 验证 Base64 格式（带前缀的 SVG 或 PNG）
        const base64Regex = /^(data:image\/(svg\+xml|png|x-icon|jpeg|webp);base64,)([A-Za-z0-9+/=]+)$/;
        if (base64Regex.test(base64String)) {
            form.logo = base64String; // 赋值给 form.logo
            ElMessage.success('图片上传并转换为 Base64 成功！');
        } else {
            ElMessage.error('无效的 Base64 字符串！');
        }
    };
    reader.onerror = () => {
        ElMessage.error('文件读取失败！');
    };
    reader.readAsDataURL(file); // 读取文件为 Base64
};

// 定义 emit 事件
const emit = defineEmits(['submit-success']);

// 提交表单
const submitForm = async () => {
    try {
        // 验证表单formRef.value.validate根据rules规则验证表单
        const valid = await formRef.value.validate();
        if (valid) {
            const result = {
                logo: form.logo,
                name: form.name,
                description: form.description,
                url: form.url,
                metadata: {
                    classify: form.classify,
                },
            };
            // 调用 createWebsite API
            await createWebsite(result);
            ElMessage.success('提交成功！');
            emit('submit-success');
            dialogVisible.value = false;
            resetForm();
        }
    } catch (error) {
        ElMessage.error('提交失败，请刷新重试');
    }
};

// 重置表单
const resetForm = () => {
    form.logo = '';
    form.name = '';
    form.description = '';
    form.url = '';
    form.classify = '';
    formRef.value?.resetFields();
};

// 暴露打开对话框的方法
defineExpose({
    openDialog: () => {
        dialogVisible.value = true;
    },
});
</script>