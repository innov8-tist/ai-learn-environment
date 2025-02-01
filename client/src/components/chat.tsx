import type { Theme } from "../types/theme"

interface ChatProps {
  currentTheme: Theme
}

export function Chat({ currentTheme }: ChatProps) {

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 p-4">
        <div className={`mb-4 rounded-lg border ${currentTheme.border} p-4`}>
          <div className="mb-2 text-sm opacity-60">User&apos;s Question:</div>
          <div>How can I improve my study habits?</div>
        </div>
        <div className={`rounded-lg border ${currentTheme.border} p-4`}>
          <div className="mb-2 text-sm opacity-60">Answer:</div>
          <div>Here are some effective study techniques...</div>
        </div>
      </div>

    </div>
  )
}


