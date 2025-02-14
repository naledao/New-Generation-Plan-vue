<script setup>
defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="pagination">
    <span>{{ currentPage }}</span>/<span>{{ totalPages }}</span>
  </div>
</template>

<style scoped>
.pagination {
  font-size: 16px;
}
</style>