I will optimize the colors for "Cancelled" and "Completed" statuses as requested, ensuring all styles are centralized in `static/css/haircut.css`.

**Plan:**

1.  **Update `static/css/haircut.css`**:
    *   Add missing utility classes: `.bg-blue-500` (for Completed dot) and `.bg-gray-400` (for Cancelled dot).
    *   Ensure existing classes (`.bg-blue-50`, `.text-blue-600`, `.bg-gray-100`, `.text-gray-500`) are available (based on previous analysis, most are, but I will double-check and add if needed).

2.  **Update `pages/haircut/appointments.vue`**:
    *   Modify the `getStatusColor` method to explicitly handle:
        *   **Completed (2)**: Use Blue theme (`bg-blue-500` for dot, `bg-blue-50 text-blue-600` for badge). This indicates a successful, positive state.
        *   **Cancelled (9)**: Use Gray theme (`bg-gray-400` for dot, `bg-gray-100 text-gray-500` for badge). This indicates an inactive, neutral state.

**Visual Scheme:**
*   **Completed**: Blue (Professional, Finished)
*   **Cancelled**: Gray (Disabled, Inactive)
*   **Booked**: Green (Active, Upcoming) - *Existing*
*   **Pending Eval**: Yellow (Action Required) - *Existing*