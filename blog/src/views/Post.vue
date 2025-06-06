<template>
  <el-container>
    <ManageFiles ref="manageFilesFormRef" @editFile-success="editFileRefresh" />
    <AddPostForm ref="addFormRef" @post-success="refreshPost" />
    <Tiptap :note="note" v-if="showview === 'NoteView' && note" ref="changeFormRef" />
    <div v-if="isAdmin">
      <el-button type="primary" :icon="Files" circle class="button" @click="managingFiles"
        :style="{ bottom: filesBottom + 'px' }" />
      <el-button type="danger" :icon="Delete" circle class="button" @click="clickToDelete"
        :style="{ bottom: deleteBottom + 'px' }" />
      <el-button type="primary" :icon="Edit" circle class="button" @click="handleClickTiptap"
        :style="{ bottom: editBottom + 'px' }" />
      <el-button type="primary" :icon="Plus" circle class="button" @click="handleClick"
        :style="{ bottom: plusBottom + 'px' }" />
    </div>
    <el-button type="primary" :icon="Download" circle class="button" @click="convertAndDownload"
      :style="{ bottom: downloadBottom + 'px' }" />
    <el-button type="primary" :icon="ArrowUp" class="button-group" @click="openBottons" v-if="showBottoms" />
    <el-button type="primary" :icon="ArrowDown" class="button-group" @click="closeBottons" v-if="!showBottoms" />
    <el-header>
      <el-affix :offset="0">
        <Navbar @openDialog="handleClick" />
      </el-affix>
    </el-header>
    <el-container>
      <el-aside width="13vw" class="NotesList">
        <el-affix :offset="80">
          <NotesList :topfolders="topfolders" />
        </el-affix>
      </el-aside>
      <el-main>
        <BlogContent :note="note" v-if="showview === 'NoteView'" @Blog-list="getnewanchors" />
        <el-empty :image-size="200" description="当前文件夹下没有笔记" v-if="showview === 'FolderView'">
          <el-button type="primary" @click="handleClick" v-if="isAdmin">上传笔记</el-button>
        </el-empty>
      </el-main>
      <el-aside>
        <el-affix :offset="80">
          <BlogList :anchors="newAnchors" v-if="loading" />
        </el-affix>
      </el-aside>
    </el-container>
  </el-container>
</template>


<script>
// 加载 turndown 库，创建下载链接
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.js';
script.async = true;
document.head.appendChild(script);
</script>


<script setup>
import { ref, onMounted, computed, watch, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BlogContent from '../components/post/BlogContent.vue';
import NotesList from '../components/post/NotesList.vue';
import BlogList from '../components/post/BlogList.vue';
import Navbar from '../components/navbar/Navbar.vue';
import Tiptap from '../components/post/Tiptap.vue';
import ManageFiles from '../components/post/ManageFiles.vue';
import { getNoteById, getTopLevel, deleteNote, getTagById } from '../api/index.js';
import AddPostForm from '../components/post/AddPostForm.vue';
import { ArrowUp, Plus, Delete, Edit, ArrowDown, Download, Files } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuth0 } from '@auth0/auth0-vue';

const { isAuthenticated, isLoading,user } = useAuth0();

const isLoggedIn = computed(() => !isLoading.value && isAuthenticated.value);
// 检查用户是否为管理员
const isAdmin = computed(() => {
    return isLoggedIn.value && user.value?.['https://blog-eosin-iota.vercel.app/role'] === 'admin';
});

const router = useRouter();
const route = useRoute();

const newAnchors = ref();
const loading = ref(false);

//接收来自BlogContent组件的目录内容
const getnewanchors = (Anchors) => {
  newAnchors.value = Anchors;
  loading.value = true;
}

// 定义功能按钮初始位置
const editBottom = ref(30);
const deleteBottom = ref(30);
const plusBottom = ref(30);
const downloadBottom = ref(30);
const filesBottom = ref(30);
const showBottoms = ref(true);

//关闭展开按钮组
const closeBottons = () => {
  plusBottom.value -= 255;
  editBottom.value -= 135;
  filesBottom.value -= 195;
  downloadBottom.value -= 75;
  deleteBottom.value -= 315;
  showBottoms.value = true;
}

//展开按钮组
const openBottons = () => {
  plusBottom.value += 255;
  editBottom.value += 135;
  filesBottom.value += 195;
  downloadBottom.value += 75;
  deleteBottom.value += 315;
  showBottoms.value = false;
}

// 动态计算当前子组件
const currentComponent = computed(() => {
  if (route.name === 'FolderView') {
    return "FolderView";
  } else if (route.name === 'NoteView') {
    return "NoteView";
  }
  return null; // 默认值
});

// 存储笔记数据
const note = ref();
//当前顶级文件夹id
const topfolders = ref([]);

const refreshPost = (postResponse) => {
  router.push(`/post/note/${postResponse.tag}/${postResponse._id}`);
};

// 根据路径动态参数获取笔记id
const getNoteByIdfetch = async (id) => {
  try {
    const response = await getNoteById(id);
    note.value = response;
  } catch {
    ElMessage.error('获取笔记数据失败，请刷新重试！');
  }
};

// 根据路当前文件夹id获取所属顶级文件夹id
const getTopLevelfetch = async (id) => {
  try {
    const response = await getTopLevel(id);
    topfolders.value = response;
  } catch {
    ElMessage.error('获取数据失败，请刷新重试！');
  }
};

const notification = ref(false);
// 切换状态以触发通知
provide('noteList', () => {
  notification.value = !notification.value;
});
// 提供状态给 目录列表 监听
provide('notification', notification);

const showview = ref(null);


//监听路由
watch(
  () => route.params,
  () => {
    showview.value = currentComponent.value;
    //获取当前文件夹id获取所属顶级文件夹id，传递文件夹目录给子组件
    const folders_id = route.params.nowfolders;
    getTopLevelfetch(folders_id);
    if (showview.value === 'NoteView') {
      //当前路由为笔记内容时，获取路由中笔记id，并调用api获取笔记内容，传递参数给子组件
      const note_id = route.params.note;
      getNoteByIdfetch(note_id);
    }
  },
  { immediate: true }
);

//添加按钮：打开添加笔记表单
const addFormRef = ref(null);
const handleClick = () => {
  addFormRef.value.openDialog();
}

//编辑按钮：编辑笔记插件
const changeFormRef = ref(null);
const handleClickTiptap = () => {
  if (route.name === 'FolderView') {
    ElMessageBox.alert('没有笔记内容可以编辑！', '警告', {
      confirmButtonText: '确认'
    })
  } else {
    changeFormRef.value.openDialog();
  }
}

// 下载按钮：转换并下载函数
const convertAndDownload = () => {
  if (route.name === 'FolderView') {
    ElMessageBox.alert('没有笔记内容可以下载！', '警告', {
      confirmButtonText: '确认'
    })
  } else {
    try {
      if (!note.value.content) {
        ElMessage.error('当前笔记内容为空！请刷新重试');
        return;
      }
      // 使用全局的 TurndownService
      const turndownService = new window.TurndownService({
        headingStyle: 'atx', // 使用 # 风格的标题
        codeBlockStyle: 'fenced', // 使用 ``` 包裹代码块
      });
      // 转换为 Markdown
      const markdownContent = turndownService.turndown(note.value.content);
      // 创建 Blob 对象
      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      // 创建下载链接
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = note.value.title + '.md';
      ElMessage.success('下载成功');
      document.body.appendChild(link);
      link.click();
      // 清理
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    catch {
      ElMessage.error('下载失败，请刷新重试');
    }
  }
}


//删除按钮
const clickToDelete = () => {
  if (route.name === 'FolderView') {
    ElMessageBox.alert('没有笔记内容可以删除！', '警告', {
      confirmButtonText: '确认'
    })
  }
  else {
    ElMessageBox.confirm(
      '确定要删除这篇笔记吗？',
      '警告',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(async () => {
        try {
          deleteNote(route.params.note);
          const otherNotes = await getTagById(route.params.nowfolders);
          if (otherNotes.notes.length > 0) {
            router.push(`/post/note/${route.params.nowfolders}/${otherNotes.notes[0]._id}`);
          } else {
            loading.value = false;
            router.push(`/post/folder/${route.params.nowfolders}`);
          }
        } catch {
          ElMessage.error('删除笔记失败，请刷新重试');
        }
        ElMessage({
          type: 'success',
          message: '笔记已成功删除',
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })
  }
}

//管理文件夹按钮
const manageFilesFormRef = ref(null);
const managingFiles = () => {
  manageFilesFormRef.value.openDialog();
}


const editFileRefresh = () => {
  notification.value = !notification.value;
}


onMounted(() => {
  showview.value = currentComponent.value;
});
</script>

<style scoped>
.el-button {
  z-index: 1000;
  padding: 25px !important;
  font-size: 20px;
}

.post-container {
  min-width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.NotesList {
  padding-left: 1.5vw;
}

.el-main {
  margin-left: 1.5vw;
}

.content {
  width: 10%;

}

.button {
  position: fixed;
  right: 35px;
}

.button-group {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  font-size: 30px;
  display: flex;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  border-radius: 25%;
}

.button-group:hover {
  background-color: #66b1ff;
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.button-group:active {
  transform: scale(0.95);
}
</style>