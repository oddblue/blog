<template>
    <el-dialog title="添加日志" v-model="dialogVisible" align-center>
        <!-- form 用户表单 -->
        <el-form :model="form" :rules="rules" ref="formRef" label-width="auto" style="height: 350px;">
            <!-- 文件夹名称-->
            <el-form-item label="日志内容" prop="description">
                <el-input v-model="form.description" :autosize="{ minRows: 12 }" type="textarea"
                    placeholder="请输入日志内容" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm">提交</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { createUpdate } from "../../api/index"
import { ElMessage } from 'element-plus';

// 表单数据
const form = reactive({
    description: '',
});

// 表单引用
const formRef = ref(null);

const rules = {
    description: [{ required: true, message: '请输入日志内容', trigger: 'blur' }],
};

// 提交表单
const submitForm = async () => {
    try {
        // 验证表单formRef.value.validate根据rules规则验证表单
        const valid = await formRef.value.validate();
        if (valid) {
            const result = {
                description: form.description,
            };
            await createUpdate(result);
            ElMessage.success('提交成功！');
            dialogVisible.value = false;
            resetForm();
        }
    } catch {
        ElMessage.error('提交失败，请刷新重试！');
    }
}

// 重置表单
const resetForm = () => {
    form.description = '';
}


// 控制对话框显示
const dialogVisible = ref(false);
// 暴露打开对话框的方法
defineExpose({
    openDialog: () => {
        dialogVisible.value = true;
    },
});
</script>
