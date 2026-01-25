import request from '@/utils/request'

// 获取理发师列表
export function listBarbers(query) {
  return request({
    url: '/haircut/barber/list',
    method: 'get',
    params: query
  })
}

// 获取排班/可用时段
export function getBarberSchedule(barberId, date) {
  return request({
    url: '/haircut/schedule/info',
    method: 'get',
    params: { barberId, date }
  })
}

// 提交预约
export function submitAppointment(data) {
  return request({
    url: '/haircut/appointment',
    method: 'post',
    data: data
  })
}

// 获取我的预约列表
export function listMyAppointments(query) {
  return request({
    url: '/haircut/appointment/myList',
    method: 'get',
    params: query
  })
}

// 取消预约
export function cancelAppointment(id) {
  return request({
    url: '/haircut/appointment/cancel/' + id,
    method: 'put'
  })
}

// 提交评价
export function submitRate(data) {
  return request({
    url: '/haircut/appointment/rate',
    method: 'post',
    data: data
  })
}