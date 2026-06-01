import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/chat/resume')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { handleChatResume } = await import('@/lib/server/domains/chat/resume-handler')
        return handleChatResume(request)
      },
    },
  },
})
