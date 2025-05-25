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
//import MenuItems from '../navbar/MenuItem.vue';
import { getAllTree } from '../../api';
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import MenuItems from './MenuItem.vue';

// 定义 props
const props = defineProps({
  topfolders: {
    type: Object,
  },
});

// 本地状态
const localTopfolders = ref(props.topfolders);
//获取所有文件夹和笔记信息
const tagtreecontent = ref([]);
const tagTree = async () => {
  try {
    const response = await getAllTree();
    tagtreecontent.value = response.find(item => item._id === props.topfolders._id)
    //console.log(tagtreecontent)
    //console.log(tagtreecontent.value)
  } catch (err) {
    console.error('Failed to fetch menu data:', err);
    ElMessage.error('Failed to fetch menu data:')
  }
};

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
