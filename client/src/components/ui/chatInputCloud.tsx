import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send, Sparkles } from "lucide-react"
import type { Theme } from "../../types/theme"
import instance, { pyServer } from "@/axios/axios.config"
import { useToast } from "@/hooks/use-toast"
interface ChatInputProps {
    currentTheme: Theme
}

export async function uploadFileToCloud(body: any) {
    const data = await instance.post('/cloud/new', body);
    return data;
}


export function ChatInputCloud({ currentTheme }: ChatInputProps) {
    let toast = useToast();
    const [message, setMessage] = useState("")
    const [isDeepThinkEnabled, setIsDeepThinkEnabled] = useState(false)

    const handleSubmit = async () => {
        if (isDeepThinkEnabled) {
            let response = await pyServer.post('/extractionyoutube', {
                question: message
            })
            console.log(response)
            let st = await uploadFileToCloud({
                title: response.data.title,
                path: response.data.title,
                section: "Youtube",
                filetype: "mp4",
                fileSize: 2000
            })
            if (st.status == 201) {
                toast
                    .toast({
                        title: "Youtube Segment Download Success"
                    })
            }
        } else {
            let response = await pyServer.post('/emailautomation/', {
                question: message
            })
            if(response.status === 200){
                toast.toast({
                    title:"Email sent successfully"
                })
            }
            console.log(response)
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
                />
                <Button size="icon" variant="outline" className={currentTheme.border}>
                    <Mic className="h-4 w-4" />
                </Button>
                <Button onClick={handleSubmit} size="icon" variant="outline" className={currentTheme.border}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}


