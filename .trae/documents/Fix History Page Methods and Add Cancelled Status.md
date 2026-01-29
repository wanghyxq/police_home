I will fix the missing methods in `pages/barber/history.vue` and add support for displaying cancelled appointments.

### Steps:
1.  **Add Missing Methods**: Insert `getDictsData` and `getStatusText` into the `methods` object of `pages/barber/history.vue`.
2.  **Handle Cancelled Status**: Update the list item template in `pages/barber/history.vue` to display a "Cancelled" tag when `item.status == '9'`, using a gray color style.

### Code Changes:

**`pages/barber/history.vue`**
- Add `getDictsData` and `getStatusText` methods.
- Update template:
  ```html
  <text v-else-if="item.status == '9'" class="text-gray-400">
    {{ getStatusText(item.status) || '已取消' }}
  </text>
  ```
