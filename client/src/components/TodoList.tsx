import type { Todo } from "../types/Todo"
import TodoItem from "./TodoItem"

type TodoListProps = {
  todos: Todo[]
  toggleTodoStatus: (id: number) => void
}

export default function TodoList({ todos, toggleTodoStatus }: TodoListProps) {
  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} toggleStatus={() => toggleTodoStatus(todo.id)} />
      ))}
    </div>
  )
}


