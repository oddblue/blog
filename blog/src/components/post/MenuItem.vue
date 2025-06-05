<template>
    <el-sub-menu :index=props.submenu._id>
        <template #title index="/posts/overview">📁 {{ props.submenu.name }}</template>
        <div v-for="chil in props.submenu.children">
            <MenuItems v-if="(chil.children && chil.children.length > 0) || (chil.notes && chil.notes.length > 0)"
                :submenu="chil" />
            <el-menu-item
                :index="chil.notes.length > 0 ? `/post/note/${chil.notes[0].tag}/${chil.notes[0]._id}` : `/post/folder/${chil._id}`"
                v-else>
                📁 {{ chil.name }}
            </el-menu-item>
        </div>
        <div v-for="note in props.submenu.notes">
            <el-menu-item :index="`/post/note/${note.tag}/${note._id}`">
                📜 {{ note.title }}
            </el-menu-item>
        </div>
    </el-sub-menu>
</template>
<script setup>
import MenuItems from './MenuItem.vue';
const props = defineProps({
    submenu: {
        type: Object,
        required: true
    }
});
</script>