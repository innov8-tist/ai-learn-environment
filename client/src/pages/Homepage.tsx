"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Theme, themes } from "../types/theme"
import { Chat } from "../components/chat"
import {  CloudPage } from "../components/cloud"
import { Sidebar } from "../components/sidebar"
import { Navbar } from "../components/Navbar"
import { ChatInput } from "../components/chatinput"
import TodoPage from "@/components/todo"
import Board from "@/components/board"

export default function StudyPlayground() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0])
  const [activeTab, setActiveTab] = useState("chat")

  const [chats, setChats] = useState<{ question: string; answer: string }[]>([])

  const addChat = (newChat: { question: string; answer: string }) => {
    setChats((prevChats) => [...prevChats, newChat])
  }


  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""} ${currentTheme.background} ${currentTheme.text}`}>
      <div className="flex flex-col h-screen">
        <Navbar 
          currentTheme={currentTheme} 
          setCurrentTheme={setCurrentTheme}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
        <div className="flex-grow overflow-hidden">
          <div className={`h-full ${activeTab === "chat" ? "grid grid-cols-[240px_1fr]" : "grid grid-cols-[1fr]"}`}>
            {/* Sidebar - only visible when chat is active */}
            {activeTab === "chat" && <Sidebar currentTheme={currentTheme} />}

            {/* Main Content */}
            <div className="flex flex-col overflow-hidden">
              <Tabs 
                defaultValue="chat" 
                className="flex-1 overflow-hidden flex flex-col"
                onValueChange={(value) => setActiveTab(value)}
              >
                <TabsList className={`${currentTheme.border} border-b bg-transparent p-0`}>
                  <TabsTrigger
                    value="chat"
                    className={`rounded-none border-b-2 border-transparent px-4 py-2 ${currentTheme.text} data-[state=active]:border-current`}
                  >
                    Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="cloud"
                    className={`rounded-none border-b-2 border-transparent px-4 py-2 ${currentTheme.text} data-[state=active]:border-current`}
                  >
                    Cloud
                  </TabsTrigger>
                  <TabsTrigger
                    value="board"
                    className={`rounded-none border-b-2 border-transparent px-4 py-2 ${currentTheme.text} data-[state=active]:border-current`}
                  >
                    Board
                  </TabsTrigger>
                  <TabsTrigger
                    value="todo"
                    className={`rounded-none border-b-2 border-transparent px-4 py-2 ${currentTheme.text} data-[state=active]:border-current`}
                  >
                    Todo
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="chat" className="flex-1 overflow-auto">
                  <Chat chats={chats} currentTheme={currentTheme} />
                </TabsContent>
                <TabsContent value="cloud" className="flex-1 overflow-auto">
                  <CloudPage currentTheme={currentTheme} />
                </TabsContent>
                <TabsContent value="board" className="flex-1 overflow-auto">
                  <Board/>
                </TabsContent>
                <TabsContent value="todo" className="flex-1 overflow-auto">
                  <TodoPage />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        {activeTab === "chat" && <ChatInput addChat={addChat} currentTheme={currentTheme} />}
      </div>
    </div>
  )
}

