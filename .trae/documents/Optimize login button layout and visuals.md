I will optimize the login button in `pages/login.vue` to ensure the text is perfectly centered and improve its visual feedback.

**Plan:**

1.  **Modify `pages/login.vue`**:
    *   Update the `<button>` element's class list:
        *   Remove `py-3.5` (vertical padding) as it conflicts with the fixed height and Flexbox centering.
        *   Add `flex items-center justify-center` to enable Flexbox layout for perfect centering.
        *   Add `text-lg` to slightly increase the font size for better readability.
    *   Add `hover-class="opacity-90"` to the button to provide visual feedback when pressed.

**Code Change Preview:**
```html
<button @click="handleLogin" 
  class="w-full bg-police text-white flex items-center justify-center font-bold rounded-lg shadow-lg mt-2 transition text-lg"
  style="height: 90rpx;"
  hover-class="opacity-90">
  登 录
</button>
```