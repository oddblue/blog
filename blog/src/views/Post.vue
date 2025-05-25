<template>
  <el-container>
    <AddPostForm ref="addFormRef" />
    <el-header>
      <el-affix :offset="0">
        <Navbar />
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
          <el-button type="primary" @click="handleClick">上传笔记</el-button>
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

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import BlogContent from '../components/post/BlogContent.vue';
import NotesList from '../components/post/NotesList.vue';
import BlogList from '../components/post/BlogList.vue';
import Navbar from '../components/navbar/Navbar.vue';
import { getNoteById, getTopLevel } from '../api/index.js';
import AddPostForm from '../components/post/AddPostForm.vue';


const route = useRoute();
const showview = ref(null);
const newAnchors = ref()
const loading = ref(false)
const getnewanchors = (Anchors) => {
  newAnchors.value = Anchors
  loading.value = true
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


const note = ref([]);// 存储笔记数据
const topfolders = ref([]);//当前顶级文件夹id



// 根据路径动态参数获取笔记id
const getNoteByIdfetch = async (id) => {
  try {
    const response = await getNoteById(id);
    note.value = response;
  } catch (error) {
    console.error('Error fetching note:', error);
  }
};
// 根据路当前文件夹id获取所属顶级文件夹id
const getTopLevelfetch = async (id) => {
  try {
    const response = await getTopLevel(id);
    topfolders.value = response;
  } catch (error) {
    console.error('Error fetching topfolders:', error);
  }
};

// 监听路由变化并更新组件
watch(
  () => route.name,//监听的对象
  //对象变化的操作
  (newRouteName) => {
    showview.value = currentComponent.value;
    //console.log(showview.value)
    //当前路由为笔记内容时，获取路由当前文件夹id获取所属顶级文件夹id，传递参数给子组件
    const folders_id = route.params.nowfolders;
    getTopLevelfetch(folders_id);
    if (newRouteName === 'NoteView') {
      //当前路由为笔记内容时，获取路由中笔记id，并调用api获取笔记内容，传递参数给子组件
      const note_id = route.params.note;
      getNoteByIdfetch(note_id);
    }
  },
  { immediate: true } // 立即触发，确保挂载时也能执行
);

watch(
  () => route.params,
  () => {
    showview.value = currentComponent.value;
    const folders_id = route.params.nowfolders;
    getTopLevelfetch(folders_id);
    if (showview.value === 'NoteView') {
      //console.log(route.params.note)
      const note_id = route.params.note;
      getNoteByIdfetch(note_id);
    }
  },
  { immediate: true }
);

//控制添加笔记变量
const addFormRef = ref(null);
const handleClick = () => {
  addFormRef.value.openDialog();
}

onMounted(() => {
  showview.value = currentComponent.value;
});
</script>

<style scoped>
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
.el-main{
  margin-left: 1.5vw;
}
.content {
  width: 10%;

}
</style>