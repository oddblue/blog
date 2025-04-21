<!-- components/SiteCard.vue -->
<template>
    <div class="site-card" @click="goToSite" :title="site.url">
        <div>
            <!-- component 是 Vue 内置的一个特殊组件（称为动态组件） -->
            <component :is="site.logo" class="logo-icon" />
        </div>
        <div class="content">
            <h3>{{ site.name }}</h3>
            <p>{{ site.description }}</p>
            
        </div>
    </div> 
</template>

<script setup>


const props =defineProps({
    site: {
        type: Object,
        required: true
    }
});

const goToSite = () => {
    window.open(props.site.url, '_blank');
};
</script>

<style scoped> 
.site-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;
    display: flex;
    flex-direction: row;
    width: 20vw;
    height: 7vh;
    align-items: center;
}
.logo-icon{
    width: 45px;
    height: 45px;
}
.site-card:hover {
    transform: scale(1.05);
}
.content{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 1vw;
}

h3 {
    font-size: 1.2em;
    margin: 0;
}

p {
    color: #666;
    font-size: 0.9em;
    margin: 0;
}

a {
    color: #007bff;
    text-decoration: none;
    font-size: 0.85em;
    word-break: break-all;
}

a:hover {
    text-decoration: underline;
}
</style>