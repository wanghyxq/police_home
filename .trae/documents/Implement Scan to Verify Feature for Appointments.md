I will implement the "Scan to Verify" feature in the appointment list as requested.

**Plan:**

1. **Backend Integration (`api/haircut/haircut.js`)**:

   * Add a new API function `verifyAppointment(data)` to handle the verification request after scanning.

2. **Frontend Update (`pages/haircut/appointments.vue`)**:

   * **UI**: Add a "扫码核销" (Scan to Verify) button next to the "取消预约" (Cancel Appointment) button for appointments with status '0' (Pending).

     * Style it consistently with the existing buttons but distinguish it visually (e.g., using a primary color outline or icon).

   * **Logic**: Implement `handleScan(item)` method.

     * Call `uni.scanCode` to open the camera.

     * On success, validate the scanned result (expecting appointment/barber ID or verification code).

     * Call the verification API.

     * On success, update the appointment status locally to '2' (Completed) and refresh the list/show a success toast.

**Code Change Preview:**

* **API**:

  ```javascript
  export function verifyAppointment(data) {
    return request({
      url: '/haircut/appointment/verify',
      method: 'post',
      data: data
    })
  }
  ```

* **Template**:

  ```html
  <button @click="handleScan(item)" class="btn text-xs border border-police text-police px-3 py-1 rounded bg-white mr-2">
      <i class="fa-solid fa-qrcode mr-1"></i>扫码核销
  </button>
  ```

* **Script**:

  ```javascript
  handleScan(item) {
      uni.scanCode({
          success: (res) => {
              // Assuming res.result contains necessary verification data
              verifyAppointment({ id: item.id, code: res.result }).then(() => {
                  uni.showToast({ title: '核销成功' });
                  this.getList(); // Refresh list
              });
          }
      });
  }
  ```

