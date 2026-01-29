import request from '@/utils/request'

// 获取我的预约列表
export function listMyAppointments(query) {
  return request({
    url: '/api/haircut/appointment/my-list',
    method: 'get',
    params: query
  })
}

// 取消预约
export function cancelAppointment(id) {
  return request({
    url: `/api/haircut/appointment/${id}/cancel`,
    method: 'post'
  })
}

// 提交评价
export function submitRate(data, appointmentId) {
  return request({
    url: '/api/haircut/appointment/rate',
    method: 'post',
    data: {
      ...data,
      appointmentId
    }
  })
}

// 获取理发师列表
export function listBarbers(query) {
  return request({
    url: '/api/haircut/barber/barber-list',
    method: 'get',
    params: query
  })
}

// 获取理发师可预约日期日历
export function getBarberCalendar(barberId) {
  return request({
    url: '/api/haircut/barber/calendar',
    method: 'get',
    params: { barberId }
  })
}

// 获取指定日期的号源
export function getAppointmentSlots(barberId, date) {
  return request({
    url: '/api/haircut/barber/slots',
    method: 'get',
    params: { barberId, date }
  })
}

// 提交预约
export function submitAppointment(data) {
  return request({
    url: '/api/haircut/appointment/submit',
    method: 'post',
    data: data
  })
}

// 扫码核销
export function verifyAppointment(data) {
  return request({
    url: '/api/haircut/appointment/verify',
    method: 'post',
    data: data
  })
}

// 获取理发师今日看板统计
export function getBarberDashboardStats() {
  return request({
    url: '/api/haircut/barber/dashboard/stats',
    method: 'get'
  })
}

// 获取理发师工作台任务列表
export function getBarberDashboardList(query) {
  return request({
    url: '/api/haircut/barber/dashboard/list',
    method: 'get',
    params: query
  })
}

// 获取理发师历史预约列表
export function getBarberHistoryList(query) {
  return request({
    url: '/api/haircut/barber/history/list',
    method: 'get',
    params: query
  })
}

// 获取预约详情
export function getAppointmentDetail(id) {
  return request({
    url: `/api/haircut/appointment/${id}/detail`,
    method: 'get'
  })
}

// 完成预约
export function completeAppointment(id) {
  return request({
    url: `/api/haircut/appointment/${id}/complete`,
    method: 'post'
  })
}