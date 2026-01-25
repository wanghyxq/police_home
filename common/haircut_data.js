const DB = {
  users: [
    { id: "u1", phone: "13812345678", password: "123", name: "王建国", role: "user", avatar: "[https://ui-avatars.com/api/?name=Wang&background=1890ff&color=fff](https://ui-avatars.com/api/?name=Wang&background=1890ff&color=fff)" },
    { id: "u2", phone: "13987654321", password: "123", name: "李强", role: "user", avatar: "[https://ui-avatars.com/api/?name=Li&background=52c41a&color=fff](https://ui-avatars.com/api/?name=Li&background=52c41a&color=fff)" },
    { id: "b1", phone: "18800000001", password: "123", name: "1号理发师", role: "barber", realName: "张师傅", avatar: "[https://ui-avatars.com/api/?name=B1&background=faad14&color=fff](https://ui-avatars.com/api/?name=B1&background=faad14&color=fff)" },
    { id: "b2", phone: "18800000002", password: "123", name: "2号理发师", role: "barber", realName: "李师傅", avatar: "[https://ui-avatars.com/api/?name=B2&background=faad14&color=fff](https://ui-avatars.com/api/?name=B2&background=faad14&color=fff)" },
  ],
  appointments: [
    { id: "A_PENDING_EVAL", userId: "u1", barberId: "b1", date: new Date().toISOString().split("T")[0], time: "10:00", status: "pending_eval", rating: null, comment: "" },
    { id: "A_BOOKED_TODAY", userId: "u1", barberId: "b2", date: new Date().toISOString().split("T")[0], time: "14:00", status: "booked", rating: null, comment: "" },
    { id: "A_TODAY_1", userId: "u2", barberId: "b1", date: new Date().toISOString().split("T")[0], time: "09:00", status: "completed", rating: 5, comment: "手艺很棒！" },
    { id: "A_YESTERDAY", userId: "u1", barberId: "b1", date: new Date(Date.now() - 86400000).toISOString().split("T")[0], time: "15:00", status: "completed", rating: 4, comment: "还不错" },
    { id: "A_LAST_MONTH", userId: "u1", barberId: "b1", date: "2023-09-15", time: "10:00", status: "completed", rating: 5, comment: "老顾客了" },
    { id: "A_TOMORROW", userId: "u1", barberId: "b2", date: new Date(Date.now() + 86400000).toISOString().split("T")[0], time: "09:20", status: "booked", rating: null, comment: "" }
  ],
  currentUser: { id: "u1", phone: "13812345678", password: "123", name: "王建国", role: "user", avatar: "[https://ui-avatars.com/api/?name=Wang&background=1890ff&color=fff](https://ui-avatars.com/api/?name=Wang&background=1890ff&color=fff)" },

  login(phone, password) {
    const user = this.users.find(u => u.phone === phone && u.password === password);
    if (user) {
      this.currentUser = user;
      uni.setStorageSync('haircut_user', user); // 持久化
      return user;
    }
    return null;
  },

  // 应用启动时加载用户
  init() {
      const u = uni.getStorageSync('haircut_user');
      if(u) this.currentUser = u;
  },

  getUserById(id) { return this.users.find(u => u.id === id); },
  getBarbers() { return this.users.filter(u => u.role === "barber"); },
  addAppt(data) { this.appointments.push(data); },
  updateAppt(id, update) {
      const idx = this.appointments.findIndex(a => a.id === id);
      if(idx !== -1) {
          this.appointments[idx] = { ...this.appointments[idx], ...update };
      }
  }
};
DB.init();
export default DB;