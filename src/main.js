import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import './assets/main.css'

// ✅ ADD THIS LINE
import { initCsrf } from '@/services/api'

// FontAwesome
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
  faCircleExclamation,
  faUserShield,
  faCircleInfo,

  // ADMIN
  faGaugeHigh,
  faFileLines,
  faClock,
  faTags,
  faMagnifyingGlass,
  faCheck,
  faTimes,
  faBan,
  faTrash,
  faPenToSquare,
  faChartLine,
  faChartSimple,
  faFileCirclePlus,
  faFolderPlus,
  faFileCircleQuestion,
  faInbox,
  faPlus,
  faCheckCircle,
  faFileContract,

  // CLIENT
  faBook,
  faSearch,
  faXmark,
  faBookOpen,
  faRobot,
  faArrowLeft,
  faHouse,
  faBuilding,
  faVideo,
  faCalendar,      // ✅ For calendar icon
  faHourglassHalf, // ✅ For pending/waiting icon
  faCheckDouble,   // ✅ For accepted/confirmed
  faTimesCircle,   // ✅ For rejected
  faSpinner,       // ✅ For loading states
  faSync,  
  faListCheck,
  faChartBar,
  faArrowRotateRight,
  faCalendarXmark        // ✅ For refresh button
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faChartBar,
  faListCheck,
  faArrowRotateRight,
  faCalendarXmark,
  faCheckDouble,   // ✅ For accepted/confirmed
  faTimesCircle,   // ✅ For rejected
  faSpinner,       // ✅ For loading states
  faSync,    
  faHourglassHalf,
  faCalendar,
  faBuilding,
  faVideo,
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
  faCircleExclamation,
  faUserShield,
  faCircleInfo,
  faGaugeHigh,
  faFileLines,
  faClock,
  faTags,
  faMagnifyingGlass,
  faCheck,
  faTimes,
  faBan,
  faTrash,
  faPenToSquare,
  faChartLine,
  faChartSimple,
  faFileCirclePlus,
  faFolderPlus,
  faFileCircleQuestion,
  faInbox,
  faPlus,
  faCheckCircle,
  faFileContract,
  faBook,
  faSearch,
  faXmark,
  faBookOpen,
  faRobot,
  faArrowLeft,
  faHouse
)

const app = createApp(App)
const pinia = createPinia()

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(pinia)
app.use(router)

// ✅ INITIALIZE CSRF ON APP START
initCsrf()

app.mount('#app')
