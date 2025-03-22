<template>
    <div class='content-container'>
        <div class="catalog">主目录</div>
        <div class="content">
            <div class="main-content">
                内容
            </div>
            <div class="content-catalog">
                子目录
            </div>
        </div>
    </div>
</template>
<script setup>

</script>
<style scoped>
.content-container{
    width: 100%;
    height: 100%;
    max-height: 92%;
    display: flex;
    flex-direction: row;
}
.catalog{
    font-size: 24px;
    font-weight: bold;
    margin-left:20px; 
    cursor: pointer;
    width: 17%;
    background-color: rgb(199, 184, 184);
}
.content{
    display: flex;
    flex-direction: row;
    width: 83%;
}
.main-content{
    width: 83%;
    height: 100%;
    background-color: rgb(255, 255, 255);
}
.content-catalog{
    width: 17%;
    height: 100%;
    background-color: rgb(255, 255, 255);
}
</style>