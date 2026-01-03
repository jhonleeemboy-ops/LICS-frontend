<template>
  <div class="flex flex-col h-full">
    <!-- Chat Header -->
    <div class="bg-gradient-to-r from-amber-800 to-amber-700 text-white px-4 py-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button @click="handleBack" class="p-2 hover:bg-amber-700 rounded-lg transition-colors">
            <font-awesome-icon icon="arrow-left" />
          </button>
          <div>
            <h3 class="font-bold">Legal Chat Assistant</h3>
            <p class="text-xs text-amber-200">Online • Ready to help</p>
          </div>
        </div>
        <button @click="toggleInfo" class="p-2 hover:bg-amber-700 rounded-lg transition-colors">
          <font-awesome-icon icon="circle-info" />
        </button>
      </div>
    </div>

    <!-- Chat Messages Area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 bg-amber-50/50 space-y-4">
      <!-- Messages -->
      <div v-for="(message, index) in messages" :key="message.id || index">
        <!-- User Message -->
        <div v-if="message.sender === 'user'" class="flex justify-end">
          <div class="max-w-[80%] bg-amber-600 text-white rounded-2xl rounded-tr-none p-4 shadow-sm">
            <p class="whitespace-pre-line">{{ message.text }}</p>
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
            
            <!-- Message text with markdown-like formatting -->
            <div class="text-gray-700 whitespace-pre-line message-content">
              <span v-html="formatMessageText(message.text)"></span>
            </div>

            <!-- Ordinance References -->
            <div v-if="message.ordinances && message.ordinances.length > 0" 
                 class="mt-3 pt-3 border-t border-amber-200">
              <p class="text-xs font-semibold text-amber-800 mb-2">
                <font-awesome-icon icon="book-open" class="mr-1" />
                Referenced Ordinances:
              </p>
              <div v-for="(ordinance, oIndex) in message.ordinances" 
                   :key="oIndex"
                   class="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg mb-1 hover:bg-amber-100 transition-colors">
                📚 {{ ordinance }}
              </div>
            </div>

            <!-- Quick Reply Suggestions -->
            <div v-if="message.suggestions && message.suggestions.length > 0" 
                 class="mt-3 space-y-2">
              <p class="text-xs font-semibold text-gray-600 mb-2">💡 Suggested questions:</p>
              <button 
                v-for="(suggestion, sIndex) in message.suggestions" 
                :key="sIndex"
                @click="sendQuickReply(suggestion)"
                class="block w-full text-left text-sm px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors"
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
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
              <font-awesome-icon icon="scale-balanced" class="text-white text-sm" />
            </div>
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
            <span class="text-sm text-amber-600">Analyzing your query...</span>
          </div>
        </div>
      </div>

      <!-- Scroll anchor -->
      <div ref="messagesEnd"></div>
    </div>

    <!-- Chat Input Area -->
    <div class="border-t border-amber-200 bg-white p-4">
      <div class="flex gap-2">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type your message..."
          @keyup.enter="sendMessage"
          :disabled="isTyping"
          class="flex-1 px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
          :disabled="isTyping"
          class="text-xs px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <font-awesome-icon :icon="action.icon" class="text-xs" />
          {{ action.text }}
        </button>
      </div>
    </div>

    <!-- Info Panel -->
    <div v-if="showInfo" class="absolute inset-0 bg-black/50 flex items-end justify-center z-50" @click="toggleInfo">
      <div class="bg-white rounded-t-2xl w-full max-w-md p-6 animate-slide-up" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-amber-900">About Legal Assistant</h3>
          <button @click="toggleInfo" class="p-2 hover:bg-amber-100 rounded-lg transition-colors">
            <font-awesome-icon icon="xmark" />
          </button>
        </div>
        <div class="space-y-3 text-sm text-gray-600">
          <div class="bg-amber-50 p-3 rounded-lg">
            <p class="font-semibold text-amber-900 mb-1">
              <font-awesome-icon icon="robot" class="mr-2" />
              AI-Powered Assistant
            </p>
            <p>This chatbot uses advanced AI to analyze your questions and provide accurate information about Butuan City ordinances.</p>
          </div>
          
          <div class="bg-blue-50 p-3 rounded-lg">
            <p class="font-semibold text-blue-900 mb-1">
              <font-awesome-icon icon="book-open" class="mr-2" />
              Legal Information
            </p>
            <p>Get instant answers about business permits, property regulations, traffic rules, environmental laws, and more.</p>
          </div>

          <div class="bg-red-50 p-3 rounded-lg">
            <p class="font-semibold text-red-900 mb-1">
              <font-awesome-icon icon="exclamation-triangle" class="mr-2" />
              Important Notice
            </p>
            <p>This chatbot provides general legal information only. For specific legal advice, please consult with a qualified attorney or visit the City Legal Office.</p>
          </div>

          <p class="text-center text-xs text-gray-500 mt-4">
            <font-awesome-icon icon="clock" class="mr-1" />
            Available 24/7 for your convenience
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useChatbot } from '@/composables/useChatbot'

const props = defineProps(['topic'])
const emit = defineEmits(['back'])

const chatStore = useChatStore()
const chatbot = useChatbot()

const newMessage = ref('')
const showInfo = ref(false)
const messagesContainer = ref(null)
const messagesEnd = ref(null)

// Get current chat and messages
const currentChat = computed(() => chatStore.currentChat)
const messages = computed(() => currentChat.value?.messages || [])
const isTyping = computed(() => chatStore.isTyping)

const quickActions = [
  { icon: 'briefcase', text: 'Business Permit' },
  { icon: 'home', text: 'Property Tax' },
  { icon: 'car', text: 'Traffic Rules' },
  { icon: 'leaf', text: 'Waste Management' }
]

// Auto-scroll to bottom when new messages arrive
watch(messages, async () => {
  await nextTick()
  scrollToBottom()
}, { deep: true })

onMounted(async () => {
  await nextTick()
  scrollToBottom()
})

const scrollToBottom = () => {
  if (messagesEnd.value) {
    messagesEnd.value.scrollIntoView({ behavior: 'smooth' })
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatMessageText = (text) => {
  if (!text) return ''
  
  // Convert markdown-like formatting to HTML
  let formatted = text
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    // Emoji bullets for lists
    .replace(/^- (.*?)$/gm, '<div class="ml-4 mb-1">• $1</div>')
    .replace(/^\d+\. (.*?)$/gm, '<div class="ml-4 mb-1">$1</div>')
  
  return formatted
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || isTyping.value) return

  const messageText = newMessage.value.trim()
  newMessage.value = ''

  // Add user message
  chatStore.addMessage(currentChat.value.id, {
    sender: 'user',
    text: messageText
  })

  // Mark as typing
  chatStore.markAsTyping(true)

  // Get bot response
  try {
    const response = await chatbot.processMessage(messageText)
    
    // Add bot message
    chatStore.addMessage(currentChat.value.id, {
      sender: 'bot',
      text: response.text,
      category: response.category,
      ordinances: response.ordinances,
      suggestions: response.suggestions
    })
  } catch (error) {
    console.error('Error processing message:', error)
    chatStore.addMessage(currentChat.value.id, {
      sender: 'bot',
      text: 'I apologize, but I encountered an error. Please try again or contact the City Legal Office for assistance.\n\n📞 Contact: (085) 225-XXXX\n📍 Location: Butuan City Hall',
      category: 'Error',
      ordinances: [],
      suggestions: ['Try asking another question']
    })
  } finally {
    chatStore.markAsTyping(false)
  }
}

const sendQuickReply = (text) => {
  newMessage.value = text
  sendMessage()
}

const toggleInfo = () => {
  showInfo.value = !showInfo.value
}

const handleBack = () => {
  chatStore.closeChat()
  emit('back')
}
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

/* Smooth scrolling */
.overflow-y-auto {
  scroll-behavior: smooth;
}

/* Message text formatting */
.message-content :deep(strong) {
  font-weight: 600;
  color: #78350f;
}

.message-content :deep(div) {
  margin-bottom: 0.25rem;
}

/* Bouncing animation for typing indicator */
@keyframes bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>