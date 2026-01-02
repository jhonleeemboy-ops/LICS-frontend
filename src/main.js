import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/main.css'

// Import FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faLock, 
  faEye, 
  faEyeSlash,
  faUserTie,
  faScaleBalanced,
  faRightToBracket,
  faArrowRight,
  faCircleQuestion,
  faCircleNotch,
  // New icons for client dashboard
  faRightFromBracket,
  faCommentDots,
  faClockRotateLeft,
  faCalendarDays,
  faCalendarPlus,
  faMessage,
  faTriangleExclamation,
  faShieldHeart,
  faLandmark,
  faLeaf,
  faBriefcase,
  faCar,
  faUsers,
  faPaperPlane,
  faCalendarCheck,
  faQuestion,
  // Additional icons you might need
  faCircleExclamation,
  faUserShield,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons'

// Add icons to library
library.add(
  faUser, 
  faEnvelope, 
  faPhone, 
  faLock, 
  faEye, 
  faEyeSlash,
  faUserTie,
  faScaleBalanced,
  faRightToBracket,
  faArrowRight,
  faCircleQuestion,
  faCircleNotch,
  // New icons
  faRightFromBracket,
  faCommentDots,
  faClockRotateLeft,
  faCalendarDays,
  faCalendarPlus,
  faMessage,
  faTriangleExclamation,
  faShieldHeart,
  faLandmark,
  faLeaf,
  faBriefcase,
  faCar,
  faUsers,
  faPaperPlane,
  faCalendarCheck,
  faQuestion,
  // Additional icons
  faCircleExclamation,
  faUserShield,
  faCircleInfo
)

const app = createApp(App)
const pinia = createPinia()

// Register FontAwesome component globally
app.component('font-awesome-icon', FontAwesomeIcon)

// IMPORTANT: Install Pinia BEFORE Router
app.use(pinia)  // ← Pinia first!
app.use(router) // ← Router second!

app.mount('#app')