import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Theme } from "../types/theme"

interface SidebarProps {
  currentTheme: Theme
}

export function Sidebar({ currentTheme }: SidebarProps) {
  return (
    <div className={`${currentTheme.border} border-r p-4`}>
      <Button variant="outline" className={`mb-4 w-full ${currentTheme.border} ${currentTheme.text} hover:bg-white/10`}>
        New Chat
      </Button>
      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="space-y-2 pr-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="cursor-pointer rounded-lg p-2 text-sm hover:bg-white/10">
              Chat history {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}


