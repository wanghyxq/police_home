import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 用户数据
  const users = ref([
    {
      id: "u1",
      phone: "13812345678",
      password: "123",
      name: "王建国",
      role: "user",
      avatar: "https://ui-avatars.com/api/?name=Wang&background=1890ff&color=fff",
    },
    {
      id: "u2",
      phone: "13987654321",
      password: "123",
      name: "李强",
      role: "user",
      avatar: "https://ui-avatars.com/api/?name=Li&background=52c41a&color=fff",
    },
    {
      id: "b1",
      phone: "18800000001",
      password: "123",
      name: "1号理发师",
      role: "barber",
      realName: "张师傅",
      avatar: "https://ui-avatars.com/api/?name=B1&background=faad14&color=fff",
    },
    {
      id: "b2",
      phone: "18800000002",
      password: "123",
      name: "2号理发师",
      role: "barber",
      realName: "李师傅",
      avatar: "https://ui-avatars.com/api/?name=B2&background=faad14&color=fff",
    },
  ])

  // 预约数据
  const appointments = ref([
    {
      id: "A_PENDING_EVAL",
      userId: "u1",
      barberId: "b1",
      date: getTodayDate(),
      time: "10:00",
      status: "pending_eval",
      rating: null,
      comment: "",
    },
    {
      id: "A_BOOKED_TODAY",
      userId: "u1",
      barberId: "b2",
      date: getTodayDate(),
      time: "14:00",
      status: "booked",
      rating: null,
      comment: "",
    },
    {
      id: "A_TOMORROW",
      userId: "u1",
      barberId: "b2",
      date: getTomorrowDate(),
      time: "09:20",
      status: "booked",
      rating: null,
      comment: "",
    }
  ])

  const currentUser = ref(null)
  const toastMessage = ref('')
  const showToast = ref(false)

  // 计算属性
  const barbers = computed(() => users.value.filter(u => u.role === 'barber'))
  
  const myAppointments = computed(() => 
    appointments.value
      .filter(a => a.userId === currentUser.value?.id)
      .sort((a, b) => b.date.localeCompare(a.date))
  )

  // 方法
  const login = (phone, password) => {
    const user = users.value.find(u => u.phone === phone && u.password === password)
    if (user) {
      currentUser.value = user
      return true
    }
    return false
  }

  const logout = () => {
    currentUser.value = null
  }

  const getUserById = (id) => {
    return users.value.find(u => u.id === id)
  }

  const createAppointment = (appointment) => {
    const newAppointment = {
      id: "A" + Date.now().toString().slice(-6),
      ...appointment,
      status: "booked",
      rating: null,
      comment: "",
    }
    appointments.value.push(newAppointment)
    return newAppointment
  }

  const updateAppointmentStatus = (appointmentId, status) => {
    const appointment = appointments.value.find(a => a.id === appointmentId)
    if (appointment) {
      appointment.status = status
    }
  }

  const submitRating = (appointmentId, rating, comment) => {
    const appointment = appointments.value.find(a => a.id === appointmentId)
    if (appointment) {
      appointment.status = 'completed'
      appointment.rating = rating
      appointment.comment = comment || '用户未填写文字评价'
    }
  }

  const showToastMessage = (message) => {
    toastMessage.value = message
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 2500)
  }

  // 工具函数
  const maskPhone = (phone) => {
    return phone ? phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : ""
  }

  const getWorkDays = () => {
    const days = []
    let c = new Date()
    let count = 0
    while (count < 5) {
      if ([1, 3, 5].includes(c.getDay())) {
        days.push(new Date(c))
        count++
      }
      c.setDate(c.getDate() + 1)
    }
    return days
  }

  const formatDate = (d) => {
    return d.toISOString().split("T")[0]
  }

  const isLocked = (dateStr, timeStr) => {
    const apptTime = new Date(`${dateStr}T${timeStr}:00`)
    const now = new Date()
    return (apptTime - now) / 60000 < 30
  }

  return {
    users,
    appointments,
    currentUser,
    toastMessage,
    showToast,
    barbers,
    myAppointments,
    login,
    logout,
    getUserById,
    createAppointment,
    updateAppointmentStatus,
    submitRating,
    showToastMessage,
    maskPhone,
    getWorkDays,
    formatDate,
    isLocked,
  }
})

// 辅助函数
function getTodayDate() {
  return new Date().toISOString().split("T")[0]
}

function getTomorrowDate() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split("T")[0]
}