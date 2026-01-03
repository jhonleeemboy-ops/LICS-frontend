// src/stores/chat.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useChatStore = defineStore('chat', () => {
  // State
  const chats = ref([])
  const currentChat = ref(null)
  const isTyping = ref(false)
  const activeTab = ref('chat')
  const selectedTopic = ref('')

  // Legal Topics for Client Dashboard
  const legalTopics = ref([
    { 
      name: 'Public Health & Safety', 
      description: 'Butuan City health and safety ordinances', 
      icon: 'shield-heart' 
    },
    { 
      name: 'Land Use & Zoning', 
      description: 'Property, construction, and land development', 
      icon: 'landmark' 
    },
    { 
      name: 'Environment & Natural Resources', 
      description: 'Environmental protection and conservation', 
      icon: 'leaf' 
    },
    { 
      name: 'Business & Commerce', 
      description: 'Business permits, licenses, and regulations', 
      icon: 'briefcase' 
    },
    { 
      name: 'Traffic & Transportation', 
      description: 'Road rules, parking, and transport regulations', 
      icon: 'car' 
    },
    { 
      name: 'Community & Social Services', 
      description: 'Social welfare, education, and community programs', 
      icon: 'users' 
    }
  ])

  const quickSuggestions = ref([
    "How do I apply for a business permit?",
    "What are the traffic violations in Butuan?",
    "How to register a property?",
    "What are the requirements for building permit?",
    "How to report environmental concerns?"
  ])

  // Load chats from storage on initialization
  const loadChatsFromStorage = async () => {
    try {
      const keys = await window.storage.list('chat:', false)
      if (keys && keys.keys) {
        const loadedChats = []
        for (const key of keys.keys) {
          try {
            const result = await window.storage.get(key, false)
            if (result) {
              const chatData = JSON.parse(result.value)
              loadedChats.push(chatData)
            }
          } catch (err) {
            console.error('Error loading chat:', key, err)
          }
        }
        chats.value = loadedChats.sort((a, b) => 
          new Date(b.lastUpdated || b.date) - new Date(a.lastUpdated || a.date)
        )
        console.log('Loaded chats from storage:', chats.value.length)
      }
    } catch (error) {
      console.log('No chat history found or error loading:', error)
      chats.value = []
    }
  }

  // Save chat to storage
  const saveChatToStorage = async (chat) => {
    if (!chat || !chat.id) {
      console.warn('Cannot save chat: invalid chat object')
      return
    }
    
    try {
      const chatData = {
        id: chat.id,
        topic: chat.topic,
        question: chat.question,
        date: chat.date,
        messages: chat.messages,
        unreadCount: chat.unreadCount || 0,
        lastUpdated: new Date().toISOString()
      }
      
      await window.storage.set(`chat:${chat.id}`, JSON.stringify(chatData), false)
      console.log('Chat saved successfully:', chat.id)
      
      // Reload chat history to keep it in sync
      await loadChatsFromStorage()
    } catch (error) {
      console.error('Error saving chat:', error)
    }
  }

  // Getters
  const chatHistory = computed(() => {
    return chats.value.map(chat => ({
      id: chat.id,
      topic: chat.topic,
      question: chat.question,
      date: chat.date,
      lastMessage: chat.messages[chat.messages.length - 1]?.text || '',
      messageCount: chat.messages.length,
      unreadCount: chat.unreadCount || 0,
      lastUpdated: chat.lastUpdated
    }))
  })

  const unreadChatsCount = computed(() => {
    return chats.value.reduce((total, chat) => total + (chat.unreadCount || 0), 0)
  })

  const isChatOpen = computed(() => {
    return !!selectedTopic.value
  })

  // Actions
  const startNewChat = (topic, initialMessage = '') => {
    const newChat = {
      id: `chat_${Date.now()}`,
      topic: topic || 'General Inquiry',
      question: initialMessage.substring(0, 50) + (initialMessage.length > 50 ? '...' : ''),
      date: 'Just now',
      lastUpdated: new Date().toISOString(),
      messages: [
        {
          id: 1,
          sender: 'bot',
          text: `Hello! I'm your Butuan City Legal Assistant. I can help you with information about ${topic || 'legal matters'}. What would you like to know?`,
          timestamp: new Date(),
          category: 'Welcome',
          ordinances: []
        }
      ],
      unreadCount: 0
    }
    
    // Add initial user message if provided
    if (initialMessage) {
      newChat.messages.push({
        id: 2,
        sender: 'user',
        text: initialMessage,
        timestamp: new Date()
      })
    }
    
    chats.value.unshift(newChat)
    currentChat.value = newChat
    selectedTopic.value = topic
    
    // Save to storage
    saveChatToStorage(newChat)
    
    return newChat
  }

  const addMessage = (chatId, message) => {
    const chat = chats.value.find(c => c.id === chatId)
    if (!chat) {
      console.error('Chat not found:', chatId)
      return null
    }
    
    const newMessage = {
      id: chat.messages.length + 1,
      sender: message.sender,
      text: message.text,
      timestamp: new Date(),
      category: message.category || null,
      ordinances: message.ordinances || [],
      suggestions: message.suggestions || []
    }
    
    chat.messages.push(newMessage)
    chat.date = 'Just now'
    chat.lastUpdated = new Date().toISOString()
    
    // Update the question preview with latest message
    const latestText = message.text || ''
    chat.question = latestText.substring(0, 50) + (latestText.length > 50 ? '...' : '')
    
    // Mark as read if user sent the message
    if (message.sender === 'user') {
      chat.unreadCount = 0
    } else {
      chat.unreadCount = (chat.unreadCount || 0) + 1
    }
    
    // Save to storage
    saveChatToStorage(chat)
    
    return newMessage
  }

  const setCurrentChat = (chat) => {
    currentChat.value = chat
    // Mark all messages as read when opening chat
    if (chat) {
      chat.unreadCount = 0
      saveChatToStorage(chat)
    }
  }

  const deleteChat = async (chatId) => {
    const index = chats.value.findIndex(c => c.id === chatId)
    if (index !== -1) {
      // Delete from storage
      try {
        await window.storage.delete(`chat:${chatId}`, false)
        console.log('Chat deleted from storage:', chatId)
      } catch (error) {
        console.error('Error deleting chat from storage:', error)
      }
      
      // Remove from array
      chats.value.splice(index, 1)
      
      // Clear current chat if it's the one being deleted
      if (currentChat.value?.id === chatId) {
        currentChat.value = null
        selectedTopic.value = ''
      }
    }
  }

  const clearAllChats = async () => {
    // Delete all chats from storage
    try {
      const keys = await window.storage.list('chat:', false)
      if (keys && keys.keys) {
        for (const key of keys.keys) {
          await window.storage.delete(key, false)
        }
      }
      console.log('All chats cleared from storage')
    } catch (error) {
      console.error('Error clearing chats from storage:', error)
    }
    
    chats.value = []
    currentChat.value = null
    selectedTopic.value = ''
  }

  const setActiveTab = (tab) => {
    activeTab.value = tab
  }

  const setSelectedTopic = (topic) => {
    selectedTopic.value = topic
  }

  const closeChat = () => {
    // Save current chat before closing
    if (currentChat.value) {
      saveChatToStorage(currentChat.value)
    }
    selectedTopic.value = ''
    currentChat.value = null
  }

  const markAsTyping = (typing) => {
    isTyping.value = typing
  }

  // Generate bot response with AI analysis
  const generateBotResponse = async (userMessage, chatbotComposable) => {
    try {
      const response = await chatbotComposable.processMessage(userMessage)
      return {
        text: response.text,
        category: response.category,
        ordinances: response.ordinances,
        suggestions: response.suggestions || []
      }
    } catch (error) {
      console.error('Error generating response:', error)
      return {
        text: 'I apologize, but I encountered an error processing your request. Please try again or contact the City Legal Office for assistance.',
        category: 'Error',
        ordinances: [],
        suggestions: []
      }
    }
  }

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  return {
    // State
    chats,
    currentChat,
    isTyping,
    activeTab,
    selectedTopic,
    legalTopics,
    quickSuggestions,
    
    // Getters
    chatHistory,
    unreadChatsCount,
    isChatOpen,
    
    // Actions
    startNewChat,
    addMessage,
    setCurrentChat,
    deleteChat,
    clearAllChats,
    setActiveTab,
    setSelectedTopic,
    closeChat,
    markAsTyping,
    generateBotResponse,
    formatDate,
    loadChatsFromStorage,
    saveChatToStorage
  }
})