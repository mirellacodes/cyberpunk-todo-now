"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { TodoInput } from "@/components/todo-input"
import { TodoList } from "@/components/todo-list"
import { Toaster } from "react-hot-toast"
import { useTodos } from "@/hooks/use-todos"

export type Priority = "high" | "medium" | "low"

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  priority: Priority
}

export default function TodoApp() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isManuallyOrdered, setIsManuallyOrdered] = useState(false)
  
  const {
    todos,
    isLoaded,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    reorderTodos: reorderTodosHook,
    sortTodosByPriority,
  } = useTodos()

  const reorderTodos = (activeId: string, overId: string) => {
    console.log("[v0] Drag operation:", { activeId, overId, isManuallyOrdered })
    reorderTodosHook(activeId, overId, searchQuery, isManuallyOrdered)
    setIsManuallyOrdered(true)
  }

  const filteredTodos = todos.filter((todo) => todo.text.toLowerCase().includes(searchQuery.toLowerCase()))
  const displayTodos = isManuallyOrdered ? filteredTodos : sortTodosByPriority(filteredTodos)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 grid-bg relative">
      <div className="scan-line"></div>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <Header />
        {!isLoaded ? (
          <div className="text-center py-8">
            <div className="text-purple-400 font-mono">Loading your tasks...</div>
          </div>
        ) : (
          <>
            <TodoInput onAddTodo={addTodo} />
            {todos.length > 0 && (
              <div className="text-center mb-4">
                <div className="text-purple-400/70 text-sm font-mono">
                  {todos.filter(t => !t.completed).length} active • {todos.filter(t => t.completed).length} completed
                </div>
              </div>
            )}
          </>
        )}
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

        {isLoaded && (
          <TodoList
            todos={displayTodos}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
            onEditTodo={editTodo}
            onReorderTodos={reorderTodos}
          />
        )}
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
