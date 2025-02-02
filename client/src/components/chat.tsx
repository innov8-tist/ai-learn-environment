import type { Theme } from "../types/theme"

interface ChatProps {
  currentTheme: Theme
  chats: { question: string; answer: string }[]
}

export function Chat({ currentTheme, chats }: ChatProps) {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 p-4">
        {chats.map((chat, index) => (
          <div key={index} className={`mb-4 rounded-lg border ${currentTheme.border} p-4`}>
            <div className="mb-2 text-sm opacity-60">User&apos;s Question:</div>
            <div>{chat.question}</div>
            <div className="mb-2 text-sm opacity-60">Answer:</div>
            <div>{chat.answer}</div>
          </div>
        ))}
      </div>
    </div>
  )
}


