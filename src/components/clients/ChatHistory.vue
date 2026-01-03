<template>
  <div class="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4">
    <!-- Header -->
    <div class="bg-gradient-to-r from-amber-800 to-amber-700 text-white px-4 py-3 rounded-t-2xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button @click="$emit('back')" class="p-2 hover:bg-amber-700 rounded-lg">
            <font-awesome-icon icon="arrow-left" />
          </button>
          <div>
            <h3 class="font-bold text-lg">Chat History</h3>
            <p class="text-xs text-amber-200">Previous conversations</p>
          </div>
        </div>
        <button @click="clearHistory" class="text-sm px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded-lg">
          Clear All
        </button>
      </div>
    </div>

    <!-- History List -->
    <div class="bg-white p-4 rounded-b-2xl shadow-sm">
      <div v-if="conversations.length === 0" class="text-center py-8 text-gray-500">
        <font-awesome-icon icon="clock-rotate-left" class="text-4xl text-amber-400 mb-3" />
        <p>No conversation history yet</p>
      </div>

      <div v-else class="space-y-3">
        <div 
          v-for="conversation in conversations" 
          :key="conversation.id"
          @click="openConversation(conversation)"
          class="p-4 border border-amber-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 cursor-pointer transition-colors"
        >
          <div class="flex justify-between items-start mb-2">
            <h4 class="font-bold text-amber-900">{{ conversation.topic || 'Legal Inquiry' }}</h4>
            <span class="text-xs text-amber-600">{{ formatDate(conversation.date) }}</span>
          </div>
          <p class="text-sm text-gray-600 truncate">{{ conversation.lastMessage }}</p>
          <div class="flex items-center justify-between mt-2">
            <span class="text-xs text-amber-700">{{ conversation.messageCount }} messages</span>
            <button class="text-amber-700 hover:text-amber-800 text-sm font-medium">
              Continue →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['back', 'open-chat'])

const conversations = ref([
  {
    id: 1,
    topic: 'Business Registration',
    lastMessage: 'Requirements for new business registration in Butuan...',
    date: new Date(Date.now() - 86400000), // Yesterday
    messageCount: 12
  },
  {
    id: 2,
    topic: 'Property Tax',
    lastMessage: 'How to compute property tax for residential...',
    date: new Date(Date.now() - 172800000), // 2 days ago
    messageCount: 8
  },
  {
    id: 3,
    topic: 'Traffic Violation',
    lastMessage: 'Penalties for illegal parking in downtown...',
    date: new Date(Date.now() - 259200000), // 3 days ago
    messageCount: 5
  }
])

const formatDate = (date) => {
  const now = new Date()
  const diff = now - date
  
  if (diff < 86400000) { // Less than 1 day
    return 'Today'
  } else if (diff < 172800000) { // Less than 2 days
    return 'Yesterday'
  } else {
    return `${Math.floor(diff / 86400000)} days ago`
  }
}

const openConversation = (conversation) => {
  emit('open-chat', conversation)
}

const clearHistory = () => {
  if (confirm('Are you sure you want to clear all chat history?')) {
    conversations.value = []
  }
}
</script>