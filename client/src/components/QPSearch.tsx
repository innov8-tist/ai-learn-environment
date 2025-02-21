"use client"

import instance, { pyServer } from "@/axios/axios.config"
import { useState } from "react"

export default function QpSearch() {
  const [inputValue, setInputValue] = useState("")
  const [pdfUrl, setPdfUrl] = useState("")

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    let resp = await pyServer.post('/questionpaper/',{
      data:inputValue
    })
    console.log(resp)
    setPdfUrl(`https://example.com/generated-pdf-${Date.now()}.pdf`)
    setInputValue("")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] bg-black text-white">
      <header className="p-4 border-b border-white/20">
        <h1 className="text-2xl font-bold">Result</h1>
      </header>
      <div className="flex-1 overflow-auto p-4">
        {pdfUrl && (
          <div className="bg-gray-900 p-4 rounded-lg border border-white/20 mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">
              {pdfUrl}
            </a>
          </div>
        )}
      </div>
      <div className="bg-gray-900 p-4 border-t border-white/20">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-black text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-white"
          />
          <button type="submit" className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

