import { useState, useEffect } from 'react'
import { generateId } from '@/lib/utils'
import type { Todo, Priority } from '@/app/page'

const STORAGE_KEY = 'cyberpunk-todo-tasks'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load todos from localStorage on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsedTodos = JSON.parse(stored)
        // Convert string dates back to Date objects
        const todosWithDates = parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }))
        setTodos(todosWithDates)
      }
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
      } catch (error) {
        console.error('Failed to save todos to localStorage:', error)
      }
    }
  }, [todos, isLoaded])

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
    setTodos((prev) => prev.map((todo) => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const editTodo = (id: string, newText: string) => {
    setTodos((prev) => prev.map((todo) => 
      todo.id === id ? { ...todo, text: newText } : todo
    ))
  }

  const reorderTodos = (activeId: string, overId: string, searchQuery: string, isManuallyOrdered: boolean) => {
    setTodos((prev) => {
      const currentDisplayTodos = isManuallyOrdered
        ? prev.filter((todo) => todo.text.toLowerCase().includes(searchQuery.toLowerCase()))
        : sortTodosByPriority(prev.filter((todo) => todo.text.toLowerCase().includes(searchQuery.toLowerCase())))

      const oldIndex = currentDisplayTodos.findIndex((todo) => todo.id === activeId)
      const newIndex = currentDisplayTodos.findIndex((todo) => todo.id === overId)

      if (oldIndex === -1 || newIndex === -1) return prev

      // Create new array based on current display order
      const newTodos = [...currentDisplayTodos]
      const [movedTodo] = newTodos.splice(oldIndex, 1)
      newTodos.splice(newIndex, 0, movedTodo)

      // Add back any todos that were filtered out
      const filteredIds = new Set(currentDisplayTodos.map((t) => t.id))
      const remainingTodos = prev.filter((todo) => !filteredIds.has(todo.id))

      return newTodos.concat(remainingTodos)
    })
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

  const clearCompletedTodos = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }

  const clearAllTodos = () => {
    setTodos([])
  }

  return {
    todos,
    isLoaded,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    reorderTodos,
    sortTodosByPriority,
    clearCompletedTodos,
    clearAllTodos,
  }
}
