<script setup>

defineProps({
  imageSrc:{
    type:String,
    required:true
  },
  name:{
    type:String,
    required:true
  }
})
</script>

<template>
  <div class="card">
    <img :src="imageSrc" :alt="name" class="card-image" referrerpolicy="no-referrer" onerror="this.src='https://images.wallpaperscraft.com/image/single/penguin_street_wall_1268495_240x320.jpg'"/>
    <div class="card-name">{{ name }}</div>
  </div>
</template>

<style scoped>
.card {
  width: 168px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s, box-shadow 0.3s;
  background-color: white;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 16px 24px rgba(0, 0, 0, 0.2);
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: fill;
}

.card-name {
  padding: 15px;
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
}
</style>