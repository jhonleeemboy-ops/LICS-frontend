<template>
  <div
    class="bg-white rounded-xl border border-amber-200 p-4 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
  >
    <div class="flex items-start gap-3">
      <div class="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-200 transition-colors">
        <font-awesome-icon
          :icon="icon"
          class="text-amber-600 text-xl"
        />
      </div>

      <div>
        <h4 class="font-bold text-gray-800 mb-1">
          {{ title }}
        </h4>
        <p class="text-gray-600 text-sm">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'book-law'
  }
});
</script>
