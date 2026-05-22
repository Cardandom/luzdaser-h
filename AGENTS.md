<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Prefer built-in Tailwind utilities and existing design-system classes over arbitrary values in square brackets. If a standard class like `rounded-3xl`, `shadow-xl`, or `text-xs` works, use it instead of `rounded-[24px]` or similar. Keep structural state variants like `data-[...]` or `has-data-[...]` only when there is no clean built-in alternative.
<!-- END:nextjs-agent-rules -->
