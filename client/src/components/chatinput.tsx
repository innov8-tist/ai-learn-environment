import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, Sparkles } from "lucide-react"
import type { Theme } from "../types/theme"
import { pyServer } from "@/axios/axios.config"

interface ChatInputProps {
    currentTheme: Theme
    addChat: (chat: { question: string; answer: string }) => void
}

export function ChatInput({ currentTheme, addChat }: ChatInputProps) {
    const [message, setMessage] = useState("")
    const [isDeepThinkEnabled, setIsDeepThinkEnabled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            let response
            if (isDeepThinkEnabled) {
                response = await pyServer.post('/youtubesummerization/', {
                    link: message
                })
            } else {
                response = await pyServer.post('/chatllm/', {
                    question: message
                })
            }
            if (response.status === 200) {
                const answer = response.data.result; 
                addChat({ question: message, answer });
                setMessage("")
            }
            console.log(response);
        } catch (error) {
            console.error("Error during API call:", error);
        } finally {
            setIsLoading(false);
        }
    }

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
                    disabled={isLoading}
                />
                <Button size="icon" variant="outline" className={currentTheme.border} disabled={isLoading}>
                    <Mic className="h-4 w-4" />
                </Button>
                <Button onClick={handleSubmit} size="icon" variant="outline" className={currentTheme.border} disabled={isLoading}>
                    {isLoading ? (
                        <span className="loader text-white">Thinking...</span>
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    )
}


