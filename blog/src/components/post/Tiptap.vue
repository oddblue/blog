<template>
    <el-dialog title="在线编辑" v-model="dialogVisible" width="60%" destroy-on-close>
        <div class="editor-wrapper">
            <el-tooltip content="提交保存" placement="top" effect="customized">
                <el-button circle size="large" type="primary" style="padding: 25px; font-size: 25px;" class="saveBotton"
                    @click="saveContent()">
                    <el-icon>
                        <Finished />
                    </el-icon>
                </el-button>
            </el-tooltip>
            <bubble-menu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor">
                <div class="bubble-menu">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                            <img :src="activeIcon" alt="Current format" class="format-icon" />
                            <el-icon class="el-icon--right">
                                <arrow-down />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <span>列表</span>
                                <el-dropdown-item v-for="item in dropdownItems.lists" :key="item.name"
                                    @click="item.click(editor)"
                                    :class="{ 'is-active': editor.isActive(item.isActive) }">
                                    <img :src="item.path" />
                                    {{ item.name }}
                                </el-dropdown-item>
                                <span>段落</span>
                                <el-dropdown-item v-for="item in dropdownItems.headings" :key="item.name"
                                    @click="item.click(editor)"
                                    :class="{ 'is-active': editor.isActive(item.isActive) }">
                                    <img :src="item.path" />
                                    {{ item.name }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <el-tooltip v-for="item in toolbarItems" :key="item.name" :content="item.name" placement="top"
                        effect="customized">
                        <el-button text size="small" @click="item.click(editor)"
                            :class="{ 'is-active': editor.isActive(item.isActive) }">
                            <img :src="item.path" />
                        </el-button>
                    </el-tooltip>
                </div>
            </bubble-menu>
            <!-- Tiptap 编辑器 -->
            <editor-content :editor="editor" class="editor-content" />
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { BubbleMenu, Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit';
import DOMPurify from 'dompurify';
import { updateNote } from '../../api/index.js'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';
import { dropdownItems, toolbarItems } from './DropDown.js';
import { ArrowDown, Finished } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
import Image from '@tiptap/extension-image'
import { ElMessage } from 'element-plus';

const route = useRoute();

const lowlight = createLowlight(all)

const props = defineProps({
    note: {
        type: Object,
        required: true,
        default: () => ({ content: '' }),
    },
});


// 计算当前活跃的图标
const activeIcon = computed(() => {
    if (!editor.value) return dropdownItems.value.headings[0].path; // 默认段落图标
    // 检查列表
    for (const item of dropdownItems.value.lists) {
        if (editor.value.isActive(item.isActive)) {
            return item.path;
        }
    }
    // 检查段落和标题
    for (const item of dropdownItems.value.headings) {
        if (editor.value.isActive(item.isActive)) {
            return item.path;
        }
    }
    return dropdownItems.value.headings[0].path; // 回退到默认段落图标
});

// 获取的父组件参数
const initialHtml = ref(props.note.content);

// 编辑器实例和状态
const editor = ref(null);
const htmlContent = ref('');


// 控制对话框显示
const dialogVisible = ref(false);

// 暴露打开对话框的方法
defineExpose({
    openDialog: () => {
        dialogVisible.value = true;
    }
});

// 保存内容到 API
const saveContent = async () => {
    try {
        const updatedHtml = editor.value.getHTML();
        const result = {
            title: props.note.title,
            content: updatedHtml,
            tag: props.note.tag,
        };
        // 发送到 API
        await updateNote(props.note._id, result);
        alert('内容已保存！');
    } catch (error) {
        console.error('保存内容失败:', error);
        alert('保存失败，请重试');
    }
}


// 初始化编辑器函数
const initEditor = (content) => {
    const cleanHtml = DOMPurify.sanitize(content || '<p>默认内容</p>', {
        ALLOWED_TAGS: ['p', 'strong', 'em', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'code', 'pre', 'img'],
        ALLOWED_ATTR: ['class', 'style', 'src', 'alt', 'width', 'height'],
    });
    editor.value = new Editor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4, 5, 6] },
                dropcursor: { color: '#ff0000' },
            }),
            CodeBlockLowlight.configure({ lowlight }),
            Image.configure({
                inline: true,
                allowBase64: true,
            })
        ],
        content: cleanHtml,
        onUpdate: ({ editor }) => {
            htmlContent.value = DOMPurify.sanitize(editor.getHTML(), {
                ALLOWED_TAGS: ['p', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'code', 'pre', 'img'],
                ALLOWED_ATTR: ['class', 'style', 'src', 'alt', 'width', 'height'],
            });
        },
    });
    htmlContent.value = cleanHtml;
};

// 销毁编辑器函数
const destroyEditor = () => {
    //console.log('Destroying editor');
    if (editor.value) {
        try {
            editor.value.destroy();
        } catch {
            ElMessage.error('清空编辑器失败，请刷新重试');
        } finally {
            editor.value = null;
        }
    }
};

watch(
    () => props.note,
    () => {
        // 当 note 参数变化时，销毁并重新初始化编辑器
        destroyEditor();
        // 假设 props.note 会在路由变化后更新
        initEditor(props.note.content);
    },
    { deep: true }
);


// 初始化 Tiptap 编辑器
onMounted(() => {
    initEditor(props.note.content);
});

// 清理编辑器
onBeforeUnmount(() => {
    destroyEditor();
});
</script>

<style scoped>
.saveBotton {
    position: fixed;
    bottom: 5vw;
    right: 15vw;
}

.bubble-menu {
    display: flex;
    border: 1.5px solid #ddd;
    border-radius: 25px;
    background-color: white;
    padding: 5px;
}

.el-dropdown-menu img {
    margin-right: 5px;
}

.el-dropdown-menu span {
    margin-left: 15px;
}

.el-dropdown {
    align-items: center;
}

.el-button {
    margin: 0 !important;
}

.el-popper.is-customized {
    padding: 6px 12px;
    background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
    background: linear-gradient(45deg, #b2e68d, #bce689);
    right: 0;
}

img {
    width: 16px;
    /* 调整下拉菜单中的 SVG 大小 */
    height: 16px;
}

.editor-content .ProseMirror:focus {
    outline: none;
    /* 移除默认的焦点轮廓 */
}

.editor-wrapper {
    max-width: 50vw;
    margin: 0 auto;
    padding: 20px;

}

.loading {
    text-align: center;
    padding: 20px;
}

.toolbar {
    margin-bottom: 10px;
    display: flex;
    gap: 5px;
}

.toolbar button {
    padding: 8px 12px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    cursor: pointer;
    border-radius: 4px;
}

.toolbar button.active {
    background-color: #007bff;
    color: white;
}

.editor-content {
    border: 1px solid #ddd;
    padding: 15px;
    min-height: 200px;
    border-radius: 4px;
    overflow-y: auto;
}

.preview {
    margin-top: 20px;
}

.preview-content {
    border: 1px solid #ddd;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 4px;
}

.preview-content img {
    max-width: 100%;
    height: auto;
}

:deep(.tiptap pre) {
    padding: 15px;
    border-radius: 25px;
    background-color: #e6e7e8;
}

:deep(.tiptap img) {
    width: 100%;
}
</style>