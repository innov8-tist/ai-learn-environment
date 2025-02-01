"use client"

import { useEffect, useState } from "react"
import TodoList from "./TodoList"
import AddTodoButton from "./AddTodoButton"
import AddTodoPopup from "./AddTodoPopup"
import { SendTodo } from "@/types/Todo"
import instance from "@/axios/axios.config"
import { useToast } from "@/hooks/use-toast"
import useAuth from "@/hooks/useAuth"
import {type Todo} from "../types/Todo"

export default function TodoPage() {
  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const toast = useToast();


  const fetchTodo = async(userId:string)=>{
    let response = await instance.get(`/todo/author/${userId}`)
    setTodos(response.data)
    return response
  }
  useEffect(()=>{
    if(user.id == null || user.id == undefined) return
    fetchTodo(user.id)
  },[user.id])
  const addTodo = async(title: string, description: string) => {
    const newTodo: SendTodo = {
      title,
      description,
    }
    let response = await instance.post('/todo',newTodo)
    if(response.status == 201){
      setTodos([...todos,response.data as Todo])
    }else{
      toast.toast({
        title:"Failed to add todo",
        description:""
      })
    }
  }

  const toggleTodoStatus = async(id: number) => {
    let resp = await instance.patch(`/todo/${id}/toggle`)
    console.log(resp)
    if(resp.status == 200){
        console.log("Patch success")
        await fetchTodo(user.id)
    }else{
      toast.toast({
        title:"Failed to update todo",
        description:""
      })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Todo List</h1>
      <TodoList todos={todos} toggleTodoStatus={toggleTodoStatus} />
      <AddTodoButton onClick={() => setIsPopupOpen(true)} />
      {isPopupOpen && (
        <AddTodoPopup
          onClose={() => setIsPopupOpen(false)}
          onAdd={(title, description) => {
            addTodo(title, description)
            setIsPopupOpen(false)
          }}
        />
      )}
    </div>
  )
}



