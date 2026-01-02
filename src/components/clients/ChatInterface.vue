<template>
  <div class="flex flex-col h-full">
    <!-- Chat Header -->
    <div class="bg-gradient-to-r from-amber-800 to-amber-700 text-white px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button @click="$emit('back')" class="p-2 hover:bg-amber-700 rounded-lg">
            <font-awesome-icon icon="arrow-left" />
          </button>
          <div>
            <h3 class="font-bold">Legal Chat Assistant</h3>
            <p class="text-xs text-amber-200">Online • Ready to help</p>
          </div>
        </div>
        <button @click="toggleInfo" class="p-2 hover:bg-amber-700 rounded-lg">
          <font-awesome-icon icon="circle-info" />
        </button>
      </div>
    </div>

    <!-- Chat Messages Area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 bg-amber-50/50 space-y-4">
      <!-- Welcome Message -->
      <div class="flex justify-start">
        <div class="max-w-[80%] bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
              <font-awesome-icon icon="scale-balanced" class="text-white text-sm" />
            </div>
            <span class="font-bold text-amber-900">Legal Assistant</span>
            <span class="text-xs text-amber-500">• Just now</span>
          </div>
          <p class="text-gray-700">Hello! I'm your Butuan City Legal Assistant. How can I help you today?</p>
        </div>
      </div>

      <!-- User Messages -->
      <div v-for="(message, index) in messages" :key="index">
        <!-- User Message -->
        <div v-if="message.sender === 'user'" class="flex justify-end">
          <div class="max-w-[80%] bg-amber-600 text-white rounded-2xl rounded-tr-none p-4 shadow-sm">
            <p>{{ message.text }}</p>
            <p class="text-xs text-amber-200 mt-1 text-right">{{ formatTime(message.timestamp) }}</p>
          </div>
        </div>
        
        <!-- Bot Message -->
        <div v-else class="flex justify-start">
          <div class="max-w-[80%] bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                <font-awesome-icon icon="scale-balanced" class="text-white text-sm" />
              </div>
              <span class="font-bold text-amber-900">Legal Assistant</span>
              <span class="text-xs text-amber-500">• {{ formatTime(message.timestamp) }}</span>
            </div>
            <p class="text-gray-700">{{ message.text }}</p>
            <div v-if="message.suggestions" class="mt-3 space-y-2">
              <button 
                v-for="(suggestion, sIndex) in message.suggestions" 
                :key="sIndex"
                @click="sendQuickReply(suggestion)"
                class="text-sm px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex justify-start">
        <div class="max-w-[80%] bg-white rounded-2xl rounded-tl-none p-4 shadow-sm">
          <div class="flex items-center gap-2">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-75"></div>
              <div class="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-150"></div>
            </div>
            <span class="text-sm text-amber-600">Legal Assistant is typing...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Input Area -->
    <div class="border-t border-amber-200 bg-white p-4">
      <div class="flex gap-2">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type your message..."
          @keyup.enter="sendMessage"
          class="flex-1 px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
        <button 
          @click="sendMessage"
          :disabled="!newMessage.trim() || isTyping"
          class="px-5 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <font-awesome-icon icon="paper-plane" />
        </button>
      </div>
      
      <!-- Quick Actions -->
      <div class="mt-3 flex flex-wrap gap-2">
        <button 
          v-for="action in quickActions" 
          :key="action.text"
          @click="sendQuickReply(action.text)"
          class="text-xs px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors flex items-center gap-1"
        >
          <font-awesome-icon :icon="action.icon" class="text-xs" />
          {{ action.text }}
        </button>
      </div>
    </div>

    <!-- Info Panel -->
    <div v-if="showInfo" class="absolute inset-0 bg-black/50 flex items-end justify-center z-50">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 animate-slide-up">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-amber-900">About Legal Assistant</h3>
          <button @click="toggleInfo" class="p-2 hover:bg-amber-100 rounded-lg">
            <font-awesome-icon icon="xmark" />
          </button>
        </div>
        <div class="space-y-3 text-sm text-gray-600">
          <p>This chatbot provides general legal information about Butuan City ordinances and regulations.</p>
          <p>For specific legal advice, please consult with a qualified attorney.</p>
          <p>Operating Hours: 8:00 AM - 5:00 PM, Monday to Friday</p>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- In your ChatInterface.vue -->
<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'

const props = defineProps(['topic'])
const emit = defineEmits(['back'])

const chatStore = useChatStore()
const newMessage = ref('')
const showInfo = ref(false)
const messagesContainer = ref(null)

// Initialize with current chat from store
const currentChat = chatStore.currentChat

const sendMessage = () => {
  if (!newMessage.value.trim() || !currentChat) return

  // Add user message
  chatStore.addMessage(currentChat.id, {
    sender: 'user',
    text: newMessage.value
  })
  
  newMessage.value = ''
  scrollToBottom()

  // Simulate bot response
  chatStore.markAsTyping(true)
  setTimeout(() => {
    const responses = [
      'I understand your question. Let me check the regulations for you.',
      'Based on Butuan City Ordinance No. 2023-05, the answer is...',
      'Could you provide more details about your situation?',
      'I recommend consulting with a lawyer for specific legal advice on this matter.',
      'For that concern, you need to visit the City Legal Office with the following documents...'
    ]
    
    chatStore.addMessage(currentChat.id, {
      sender: 'bot',
      text: responses[Math.floor(Math.random() * responses.length)]
    })
    
    chatStore.markAsTyping(false)
    scrollToBottom()
  }, 1500)
}
// ... rest of the component remains similar
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>