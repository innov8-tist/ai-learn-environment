import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, Sparkles } from "lucide-react"
import type { Theme } from "../types/theme"

interface ChatInputProps {
  currentTheme: Theme
}

export function ChatInput({ currentTheme }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isDeepThinkEnabled, setIsDeepThinkEnabled] = useState(false)

  return (
    <div className={`${currentTheme.border} border-t p-4 sticky bottom-0 bg-inherit`}>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant={isDeepThinkEnabled ? "default" : "outline"}
          className={`${currentTheme.border} absolute left-6 z-10`}
          onClick={() => setIsDeepThinkEnabled(!isDeepThinkEnabled)}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className={`${currentTheme.border} bg-transparent placeholder:opacity-60 pl-14`}
        />
        <Button size="icon" variant="outline" className={currentTheme.border}>
          <Mic className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" className={currentTheme.border}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}


