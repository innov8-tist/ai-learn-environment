import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { themes, type Theme } from "../types/theme"
import useAuth from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { logoutUser } from "@/apis/auth"
import { Palette, User, Settings, LogOut } from "lucide-react"

interface NavbarProps {
  currentTheme: Theme
  setCurrentTheme: (theme: Theme) => void
}

export function Navbar({ currentTheme, setCurrentTheme }: NavbarProps) {
  const { user, isLoading, isError, error, invalidate } = useAuth()
  const defaultPfpUrl = "https://t3.ftcdn.net/jpg/05/11/52/90/360_F_511529094_PISGWTmlfmBu1g4nocqdVKaHBnzMDWrN.jpg"
  const { toast } = useToast()

  if (isLoading) return <div className="p-4">Loading...</div>
  if (isError) {
    console.error(error?.message)
    return <div className="p-4 text-red-500">Error occurred: {error?.message}</div>
  }

  function handleLogout() {
    logoutUser()
      .then(() => {
        invalidate()
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        })
      })
      .catch((error) => {
        console.error("Logout failed:", error)
        toast({
          title: "Logout failed",
          description: "An error occurred while logging out. Please try again.",
          variant: "destructive",
        })
      })
  }

  return (
    <nav className={`${currentTheme.border} border-b px-4 py-2 flex justify-between items-center`}>
      <Link to="/" className="text-lg font-semibold">
        Study Playground
      </Link>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.pfp ?? defaultPfpUrl} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Open user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={`${currentTheme.background} ${currentTheme.text} ${currentTheme.border}`}
          >
            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator className={currentTheme.border} />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex w-full items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <Palette className="mr-2 h-4 w-4" />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                className={`${currentTheme.background} ${currentTheme.text} ${currentTheme.border}`}
              >
                {themes.map((theme) => (
                  <DropdownMenuItem key={theme.value} onClick={() => setCurrentTheme(theme)}>
                    <div className={`mr-2 h-4 w-4 rounded-full ${theme.background} border ${theme.border}`} />
                    {theme.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex w-full items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className={currentTheme.border} />
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      )}
    </nav>
  )
}


