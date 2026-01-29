I will implement the image gallery feature for appointment reviews in the barber detail page.

### Implementation Plan

1.  **Update Data Model**:
    *   Modify `loadDetail` method in `pages/barber/detail.vue` to map the `imageList` field from the API response to `this.appointment.images`.
    *   Ensure `imageList` defaults to an empty array if null.

2.  **Update Template**:
    *   Add an image grid section below the comment text in the review area.
    *   Use `v-if="appointment.images && appointment.images.length"` to conditionally render the gallery.
    *   Use `v-for` to render images.
    *   Implement a 3-column grid layout using Flexbox or Grid.

3.  **Implement Interactions**:
    *   Add `@click="previewImage(index)"` to each image.
    *   Implement `previewImage` method using `uni.previewImage` API for native image viewing capabilities (zoom, swipe).

4.  **Styling**:
    *   Add CSS for the image grid (`flex`, `flex-wrap`, `gap`).
    *   Style individual image items (`width`, `height`, `border-radius`, `object-fit`).
    *   Add styles directly to `pages/barber/detail.vue` as requested.

### Code Changes

**`pages/barber/detail.vue`**

*   **Script**:
    *   Update `loadDetail`: `images: data.imageList || []`
    *   Add `previewImage(current)` method.
*   **Template**:
    ```html
    <view v-if="appointment.images && appointment.images.length > 0" class="mt-3 flex flex-wrap -mx-1">
      <view v-for="(img, idx) in appointment.images" :key="idx" class="w-1/3 px-1 mb-2" @click="previewImage(idx)">
        <image :src="img" mode="aspectFill" class="w-full h-24 rounded bg-gray-100"></image>
      </view>
    </view>
    ```
*   **Style**:
    *   Add utility classes if missing (e.g., `w-1/3`, `h-24`, `aspect-fill` equivalent). Since we have Tailwind-like classes, we'll try to use existing ones or define specific ones for the grid.

### Verification
*   Check if images load correctly.
*   Verify `uni.previewImage` works.
*   Ensure layout looks good on mobile.
