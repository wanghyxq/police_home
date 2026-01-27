I will perform a comprehensive UI/UX overhaul of the `rate.vue` page to meet professional standards.

**Plan:**

1. **Layout & Structure**:

   * Change the background to a soft gray (`bg-gray-50`) for better contrast with white cards.

   * Wrap the content in a card-like container (`bg-white rounded-xl shadow-sm`) to group elements logically.

   * Add a header bar (if not present globally) or ensure the top padding is appropriate.

2. **Visual Elements**:

   * **Typography**: Use bolder fonts for headings and softer colors for subtitles (`text-gray-500`).

   * **Stars**: Increase star size and interaction area. Add animation for selection.

   * **Textarea**: Improve the border style (`border-gray-200 focus:border-police`) and add a character counter.

   * **Upload Area**: Make it more prominent and visually appealing (e.g., larger icon, better spacing).

   * **Buttons**:

     * Primary (Submit): specific gradient or solid police blue, with shadow and hover effects.

     * Secondary (Cancel): Subtle text button or outlined button.

3. **Code Refactoring**:

   * Use proper semantic HTML tags.

   * Extract static styles to `static/css/haircut.css` if reusable, or keep scoped if specific to this page.

   * Ensure all class names follow the project's utility-first approach (Tailwind-like).

**Implementation Steps:**

1. Read `static/css/haircut.css` again to confirm available utility classes.
2. Rewrite `pages/haircut/rate.vue` with the new design structure.
3. Add necessary animations or transitions for a polished feel.

