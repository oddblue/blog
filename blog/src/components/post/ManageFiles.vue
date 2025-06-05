<template>
    <el-dialog title="管理文件夹" v-model="dialogVisible" width="30%" @close="resetForm" filterable>
        <el-form :model="form" :rules="currentRules" ref="formRef" label-width="auto">
            <el-form-item label="选择文件夹" prop="tagId">
                <el-cascader v-model="form.tagId" :options="options" :show-all-levels="false" :props="props" clearable
                    filterable placeholder="输入文字搜索文件夹" />
            </el-form-item>
            <el-form-item label="修改后文件夹名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入文件夹名称" />
            </el-form-item>

        </el-form>
        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="warning" @click="submitFormEdit('edit')">修改</el-button>
            <el-button type="danger" @click="submitFormDelete('delete')">删除</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref, reactive, onMounted, computed, inject, watch } from 'vue';
import { getTagTree, updateTag, deleteTag, getNoteById, getAllTree } from '../../api';
import { ElMessage } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

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
    } catch {
        ElMessage.error('获取文件夹信息失败，请刷新重试');
    }
}

//监听父组件，及时更新文件夹内容
const notification = inject('notification');
watch(notification,
    (newValue) => {
        if (newValue) {
            fetchData();
        }
    });

const props = {
    checkStrictly: true,//任意选择子节点
    emitPath: false, // 关键：只返回选中的子节点值
}

const emit = defineEmits(['editFile-success']);

// 提交表单
const submitFormEdit = async (type) => {
    try {
        actionType.value = type;
        const valid = await formRef.value.validate();
        if (valid) {
            const result = { name: form.name };
            await updateTag(form.parentId, result);
            ElMessage.success('修改文件夹成功！');
            dialogVisible.value = false;
            resetForm();
            // 派发事件通知父组件
            emit('editFile-success');
        }
    } catch {
        ElMessage.error('修改失败，请刷新重试');

    }
}

//删除文件夹
const submitFormDelete = async (type) => {
    try {
        actionType.value = type;
        const valid = await formRef.value.validate();
        if (valid) {
            try {
                await deleteTag(form.tagId);
                ElMessage.success('删除文件夹成功！');
            }
            catch {
                ElMessage.error('删除失败，请刷新重试');
            }
            await getNoteById(route.params.note);
            // 派发事件通知父组件
            emit('editFile-success');
            dialogVisible.value = false;
            resetForm();
        }
    } catch (err) {
        handleApiError(err);
    }
}



// 处理 API 错误响应
const handleApiError = async(err) => {
    if (err.response) {
        const { status, data } = err.response;
        switch (status) {
            case 400:
                ElMessage.error('删除失败，请刷新重试');
                break;
            case 404:
                try {
                    const response = await getAllTree();
                    console.log(response);
                    const { noteId, nowfolders } = findFirstNoteId(response);
                    console.log(noteId, nowfolders);
                    if (noteId) {
                        router.push(`/post/note/${nowfolders}/${noteId}`);
                    }
                    else {
                        router.push(`/post/folder/${props.notes._id}`);
                    }
                }
                catch {
                    router.push('/');
                    ElMessage.error('你还没有上传笔记，赶快上传笔记吧！');
                }
                break;
            case 500:
                ElMessage.error('服务器错误,请稍后重试');
                break;
            default:
                ElMessage.error('删除失败，请刷新重试');
        }
    } else {
        ElMessage.error(`网络错误: ${err.message}`);
    }
}



//寻找第一个笔记id
function findFirstNoteId(data) {
    function traverse(obj) {
        if (obj.notes && obj.notes.length > 0) {
            return { noteId: obj.notes[0]._id, nowfolders: obj._id };
        }
        // 递归检查子节点
        if (obj.children && obj.children.length > 0) {
            for (const child of obj.children) {
                const result = traverse(child);
                if (result) return result;
            }
        }
        return null;
    }
    for (const item of data) {
        const result = traverse(item);
        if (result) return result;
    }
    throw new Error("数据结构中未找到任何笔记");
}

// 控制对话框显示
const dialogVisible = ref(false);
defineExpose({
    openDialog: () => {
        dialogVisible.value = true;
    },
});

// 表单数据
const form = reactive({
    tagId: '',
    name: '',
});


const formRef = ref(null);

const editRules = {
    tagId: [{ required: true, message: '选择文件夹', trigger: 'blur' }],
    name: [{ required: true, message: '填写修改后文件夹名称', trigger: 'blur' }],
}

const deleteRules = {
    tagId: [{ required: true, message: '选择文件夹', trigger: 'blur' }],
    name: [{ required: false, message: '填写修改后文件夹名称', trigger: 'blur' }],
}

//判断提交按钮
const actionType = ref('');
const currentRules = computed(() => {
    return actionType.value === 'edit' ? editRules : deleteRules;
});

const resetForm = () => {
    form.tagId = '';
    form.name = '';
}



onMounted(() => {
    fetchData();
});
</script>