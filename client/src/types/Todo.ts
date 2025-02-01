export interface SendTodo {
    title: string
    description?: string
}

export type Todo = {
    id: number
    title: string
    description: string
    status: "pending" | "completed"
    completed: boolean
    createdAt?: Date
}