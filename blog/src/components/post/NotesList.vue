<template>
  <el-menu unique-opened router>
    <div v-for="children in tagtreecontent.children"
      v-if="tagtreecontent && tagtreecontent.children && tagtreecontent.children.length > 0">
      <MenuItems :submenu="children" />
    </div>
    <el-menu-item v-for="note in tagtreecontent.notes"
      v-if="tagtreecontent && tagtreecontent.notes && tagtreecontent.notes.length > 0"
      :index="`/post/note/${note.tag}/${note._id}`">
      📜{{ note.title }}
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { getAllTree } from '../../api';
import { ref, watch, inject } from 'vue';
import { ElMessage } from 'element-plus';
import MenuItems from './MenuItem.vue';


const notification = inject('notification');

watch(notification,
  (newValue) => {
    if (newValue) {
      tagTree();
    }
  });


const props = defineProps({
  topfolders: {
    type: Object,
  },
});


const localTopfolders = ref(props.topfolders);
//获取所有文件夹和笔记信息
const tagtreecontent = ref([]);

//获取文件夹和笔记树状结构
const tagTree = async () => {
  try {
    const response = await getAllTree();
    tagtreecontent.value = response.find(item => item._id === props.topfolders._id);
  } catch (err) {
    ElMessage.error('获取内容失败，请刷新重试');
  }
}

watch(
  () => props.topfolders,
  (newTopfolders) => {
    if (newTopfolders && newTopfolders._id) { // 仅在内容变化时更新
      localTopfolders.value = newTopfolders;
      tagTree();
    }
  }
)

</script>
