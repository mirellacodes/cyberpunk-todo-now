"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { TodoInput } from "@/components/todo-input"
import { TodoList } from "@/components/todo-list"
import { Toaster } from "react-hot-toast"
import { generateId } from "@/lib/utils"

export type Priority = "high" | "medium" | "low"

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  priority: Priority
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isManuallyOrdered, setIsManuallyOrdered] = useState(false)

  const addTodo = (text: string, priority: Priority) => {
    const newTodo: Todo = {
      id: generateId(),
      text,
      completed: false,
      createdAt: new Date(),
      priority,
    }
    setTodos((prev) => [newTodo, ...prev])
  }

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const editTodo = (id: string, newText: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo)))
  }

  const reorderTodos = (activeId: string, overId: string) => {
    console.log("[v0] Drag operation:", { activeId, overId, isManuallyOrdered })

    setTodos((prev) => {
      const currentDisplayTodos = isManuallyOrdered
        ? prev.filter((todo) => todo.text.toLowerCase().includes(searchQuery.toLowerCase()))
        : sortTodosByPriority(prev.filter((todo) => todo.text.toLowerCase().includes(searchQuery.toLowerCase())))

      const oldIndex = currentDisplayTodos.findIndex((todo) => todo.id === activeId)
      const newIndex = currentDisplayTodos.findIndex((todo) => todo.id === overId)

      console.log("[v0] Indices:", { oldIndex, newIndex })

      if (oldIndex === -1 || newIndex === -1) return prev

      // Create new array based on current display order
      const newTodos = [...currentDisplayTodos]
      const [movedTodo] = newTodos.splice(oldIndex, 1)
      newTodos.splice(newIndex, 0, movedTodo)

      // Add back any todos that were filtered out
      const filteredIds = new Set(currentDisplayTodos.map((t) => t.id))
      const remainingTodos = prev.filter((todo) => !filteredIds.has(todo.id))

      console.log("[v0] Final result:", newTodos.concat(remainingTodos))
      return newTodos.concat(remainingTodos)
    })

    setIsManuallyOrdered(true)
  }

  const sortTodosByPriority = (todos: Todo[]) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return [...todos].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  const filteredTodos = todos.filter((todo) => todo.text.toLowerCase().includes(searchQuery.toLowerCase()))
  const displayTodos = isManuallyOrdered ? filteredTodos : sortTodosByPriority(filteredTodos)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 grid-bg relative">
      <div className="scan-line"></div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <Header />
        <TodoInput onAddTodo={addTodo} />
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 glow-border font-mono"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          {isManuallyOrdered && (
            <button
              onClick={() => setIsManuallyOrdered(false)}
              className="mt-2 text-purple-400/70 text-sm font-mono hover:text-purple-300 transition-colors"
            >
              ↺ Reset to priority order
            </button>
          )}
        </div>

        <TodoList
          todos={displayTodos}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
          onEditTodo={editTodo}
          onReorderTodos={reorderTodos}
        />
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e1b4b',
            color: '#e0e7ff',
            border: '1px solid #8b5cf6',
          },
        }}
      />
    </div>
  )
}
