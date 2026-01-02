import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useChatStore = defineStore('chat', () => {
  // State
  const chats = ref([
    {
      id: 1,
      topic: 'Business Registration',
      question: 'Requirements for new business registration in Butuan City...',
      date: 'Today',
      messages: [
        { id: 1, sender: 'user', text: 'What documents do I need for business registration?', timestamp: new Date(Date.now() - 3600000) },
        { id: 2, sender: 'bot', text: 'You need: 1) Business Permit Application Form, 2) Mayor\'s Permit, 3) DTI/SEC Registration...', timestamp: new Date(Date.now() - 3540000) }
      ],
      unreadCount: 0
    },
    {
      id: 2,
      topic: 'Property Tax',
      question: 'How to compute property tax for residential properties...',
      date: 'Yesterday',
      messages: [
        { id: 1, sender: 'user', text: 'How is property tax calculated?', timestamp: new Date(Date.now() - 86400000) },
        { id: 2, sender: 'bot', text: 'Property tax is based on assessed value: Residential properties are taxed at 1%...', timestamp: new Date(Date.now() - 86300000) }
      ],
      unreadCount: 0
    }
  ])

  const currentChat = ref(null)
  const isTyping = ref(false)

  // Getters
  const chatHistory = computed(() => {
    return chats.value.map(chat => ({
      id: chat.id,
      topic: chat.topic,
      question: chat.question,
      date: chat.date,
      lastMessage: chat.messages[chat.messages.length - 1]?.text || '',
      messageCount: chat.messages.length,
      unreadCount: chat.unreadCount
    }))
  })

  const unreadChatsCount = computed(() => {
    return chats.value.reduce((total, chat) => total + chat.unreadCount, 0)
  })

  // Actions
  const startNewChat = (topic, initialMessage = '') => {
    const newChat = {
      id: Date.now(),
      topic: topic || 'General Inquiry',
      question: initialMessage.substring(0, 50) + (initialMessage.length > 50 ? '...' : ''),
      date: 'Just now',
      messages: initialMessage ? [
        { id: 1, sender: 'user', text: initialMessage, timestamp: new Date() }
      ] : [],
      unreadCount: 0
    }
    
    chats.value.unshift(newChat)
    currentChat.value = newChat
    return newChat
  }

  const addMessage = (chatId, message) => {
    const chat = chats.value.find(c => c.id === chatId)
    if (chat) {
      const newMessage = {
        id: chat.messages.length + 1,
        sender: message.sender,
        text: message.text,
        timestamp: new Date()
      }
      
      chat.messages.push(newMessage)
      chat.date = 'Just now'
      chat.question = message.text.substring(0, 50) + (message.text.length > 50 ? '...' : '')
      
      // Mark as read if user sent the message
      if (message.sender === 'user') {
        chat.unreadCount = 0
      } else {
        chat.unreadCount += 1
      }
      
      return newMessage
    }
    return null
  }

  const setCurrentChat = (chat) => {
    currentChat.value = chat
    // Mark all messages as read when opening chat
    if (chat) {
      chat.unreadCount = 0
    }
  }

  const deleteChat = (chatId) => {
    const index = chats.value.findIndex(c => c.id === chatId)
    if (index !== -1) {
      chats.value.splice(index, 1)
      if (currentChat.value?.id === chatId) {
        currentChat.value = null
      }
    }
  }

  const clearAllChats = () => {
    chats.value = []
    currentChat.value = null
  }

  const markAsTyping = (typing) => {
    isTyping.value = typing
  }

  return {
    // State
    chats,
    currentChat,
    isTyping,
    
    // Getters
    chatHistory,
    unreadChatsCount,
    
    // Actions
    startNewChat,
    addMessage,
    setCurrentChat,
    deleteChat,
    clearAllChats,
    markAsTyping
  }
})