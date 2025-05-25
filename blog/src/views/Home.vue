<template>
    <el-container>
        <el-header>
            <Navbar @get-allnotes="handlefirstnote" />
        </el-header>
        <el-main>
            <div>
                <ShowContent :notes="notes"  v-if="notes"/>
            </div>
        </el-main>
        <el-footer>
            <LightBack />
        </el-footer>
    </el-container>
</template>
<script setup>
import { ref} from 'vue';
import Navbar from '../components/navbar/Navbar.vue';
import LightBack from '../components/home/LightBack.vue';
import ShowContent from '../components/home/ShowContent.vue';

const notes = ref(null);

const handlefirstnote = (data) => {
    notes.value = data;
}



</script>
<style scoped>
.el-container {
    position: relative;
    height: 100vh;
    overflow: hidden;
}

.el-header {
    width: 100vw;
    z-index: 1000;
    background-color: white;
}

.el-main {
    display: flex;
    justify-content: center;
    flex-grow: 1;
    /* 让 main 占据剩余空间 */
    display: flex;
    align-items: flex-end;
    /* 内容垂直底部对齐 */
}

.el-footer {
    position: absolute;
    top: 0;
    width: 80vw;
    height: 80vh;
    z-index: -1;
}
</style>
