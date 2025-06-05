<template>
    <AddTagForm ref="addFormRef" @tag-created="fetchData" />
    <el-dialog title="提交笔记" v-model="dialogVisible" width="30%" @close="resetForm">
        <el-form :model="form" label-width="auto" :rules="rules" ref="formRef">
            <el-form-item label="笔记名称" prop="title">
                <el-input v-model="form.title" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="笔记内容" prop="svg">
                <el-upload ref="uploadRef" :http-request="customUpload" :limit="1" :on-exceed="handleExceed"
                    accept=".md">
                    <el-button type="primary">上传 Markdown 文件</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="创建归属文件夹" prop="tag">
                <el-button @click="handleClick" class="createtag">创建文件夹</el-button>
            </el-form-item>
            <el-form-item label="选择归属文件夹" prop="tag">
                <el-cascader v-model="form.tag" :options="options" :show-all-levels="false" :props="props" clearable />
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
import { createNote, getTagTree } from '../../api';
import { ElMessage } from 'element-plus';
import { convertMarkdownToHtml } from '../../utils/markdown';
import AddTagForm from './AddTagForm.vue';

const uploadRef=ref();

//获取标签树并转换为级联选择器所需格式
const options = ref([]);
// 数据转换函数
const transformMenuData = (menuData) => {
    return menuData.map((item) => ({
        value: item._id,
        label: item.name,
        children: item.children?.length ? transformMenuData(item.children) : [],
    }));
}

// 获取并转换数据
const fetchData = async () => {
    try {
        const menuData = await getTagTree(); // 调用 API
        options.value = transformMenuData(menuData); // 转换数据
    } catch (error) {
        ElMessage.error('获取文件失败，请刷新重试')
    }
}

const props = {
    checkStrictly: true,//任意选择子节点
    emitPath: false, // 关键：只返回选中的子节点值
}

// 控制对话框显示
const dialogVisible = ref(false);

// 表单数据
const form = reactive({
    title: '',
    content: '',
    tag: '',
});

// 表单引用
const formRef = ref(null);

// 表单验证规则，required表示必填，message表示提示信息，trigger表示触发时机，blur表示失去焦点时触发，change表示改变时触发
const rules = {
    title: [{ required: true, message: '为文件编写标题', trigger: 'blur' }],
    content: [{ required: true, message: '选择要提交md文件', trigger: 'change' }],
    tag: [{ required: true, message: '选择或创建文件归属标签', trigger: 'blur' }],
}

//限制文件上传并自动替换上一个文件
const handleExceed = (files) => {
    upload.value.clearFiles();
    const file = files[0];
    file.uid = genFileId();
    upload.value.handleStart(file);
}

// 自定义上传方法
const customUpload = async (options) => {
    try {
        // 获取上传的文件
        const file = options.file;
        // 读取文件内容为字符串并存储到表单
        const fileText = await readFileAsText(file);
        form.content = convertMarkdownToHtml(fileText);
    } catch (error) {
        ElMessage.error('上传文件错误，请刷新重试')
    }
}

// 读取文件内容的辅助函数
const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}

const emit = defineEmits(['click', 'post-success'])

// 提交表单
const submitForm = async () => {
    try {
        // 验证表单formRef.value.validate根据rules规则验证表单
        const valid = await formRef.value.validate();
        if (valid) {
            const result = {
                title: form.title,
                content: form.content,
                tag: form.tag,
            };
            const postResponse = await createNote(result);
            //通知： 通知父组件跳转到提交成功的笔记页面
            emit('post-success', postResponse);
            ElMessage.success('提交成功！');
            dialogVisible.value = false;
            resetForm();

        }
    } catch (error) {
        ElMessage.error('提交失败，请刷新重试');
    }
}

// 重置表单
const resetForm = () => {
    form.title = '';
    form.content = '';
    form.tag = '';
    uploadRef.value.clearFiles();
}

// 暴露打开对话框的方法
defineExpose({
    openDialog: () => {
        dialogVisible.value = true;
    },
});

//打开创建文件夹对话框
const addFormRef = ref(null);
const handleClick = () => {
    addFormRef.value.openDialog();
}

onMounted(() => {
    fetchData(); // 获取数据
});
</script>
<style scoped></style>