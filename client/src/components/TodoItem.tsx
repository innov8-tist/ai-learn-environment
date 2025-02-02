import type { Todo } from "../types/Todo"

type TodoItemProps = {
  todo: Todo
  toggleStatus: () => void
}

export default function TodoItem({ todo, toggleStatus }: TodoItemProps) {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className={`text-xl font-semibold ${todo.completed === true ? "line-through text-gray-500" : ""}`}>
          {todo.title}
        </h3>
        <button
          onClick={toggleStatus}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            todo.completed === false ? "bg-white text-black" : "bg-gray-700 text-white"
          }`}
        >
          {todo.completed === false ? "Pending" : "Completed"}
        </button>
      </div>
      <p className="mt-2 text-gray-400">{todo.description}</p>
    </div>
  )
}


