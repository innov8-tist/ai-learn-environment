import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { type Theme, themes } from "../types/theme"
import { Palette } from "lucide-react"

interface NavbarProps {
  currentTheme: Theme
  setCurrentTheme: (theme: Theme) => void
}

export function Navbar({ currentTheme, setCurrentTheme }: NavbarProps) {
  return (
    <nav className={`${currentTheme.border} border-b px-4 py-2 flex justify-between items-center`}>
      <div className="text-lg font-semibold">Study Playground</div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={`${currentTheme.background} ${currentTheme.text} ${currentTheme.border}`}
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className={currentTheme.border} />
          <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <Palette className="mr-2 h-4 w-4" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              className={`${currentTheme.background} ${currentTheme.text} ${currentTheme.border}`}
            >
              {themes.map((theme) => (
                <DropdownMenuItem key={theme.value} className="cursor-pointer" onClick={() => setCurrentTheme(theme)}>
                  <div className={`mr-2 h-4 w-4 rounded-full ${theme.background} border ${theme.border}`} />
                  {theme.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
          <DropdownMenuSeparator className={currentTheme.border} />
          <DropdownMenuItem className="cursor-pointer">Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}


