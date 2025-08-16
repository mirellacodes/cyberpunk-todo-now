"use client"

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { SwipeableTodoItem } from "./swipeable-todo-item"
import { TodoItem } from "./todo-item"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Todo } from "@/app/page"
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { useState } from "react"

interface TodoListProps {
  todos: Todo[]
  onToggleTodo: (id: string) => void
  onDeleteTodo: (id: string) => void
  onEditTodo: (id: string, newText: string) => void
  onReorderTodos: (activeId: string, overId: string) => void
}

export function TodoList({ todos, onToggleTodo, onDeleteTodo, onEditTodo, onReorderTodos }: TodoListProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      onReorderTodos(active.id as string, over.id as string)
    }

    setActiveId(null)
  }

  const activeTodo = activeId ? todos.find((todo) => todo.id === activeId) : null

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🤖</div>
        <p className="text-gray-400 text-lg font-mono">No tasks in the system</p>
        <p className="text-gray-500 text-sm mt-2">Add a task to get started</p>
      </div>
    )
  }

  return (
    <>
      {/* Mode indicator */}
      <div className="text-center mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono ${
          isMobile 
            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
            : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
        }`}>
          {isMobile ? (
            <>
              <span>📱</span>
              <span>Mobile Mode - Swipe for actions</span>
            </>
          ) : (
            <>
              <span>💻</span>
              <span>Desktop Mode - Hover for actions</span>
            </>
          )}
        </div>
      </div>

      <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext items={todos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {todos.map((todo) => (
            isMobile ? (
              <SwipeableTodoItem
                key={todo.id}
                todo={todo}
                onToggle={() => onToggleTodo(todo.id)}
                onDelete={() => onDeleteTodo(todo.id)}
                onEdit={(newText: string) => onEditTodo(todo.id, newText)}
              />
            ) : (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={() => onToggleTodo(todo.id)}
                onDelete={() => onDeleteTodo(todo.id)}
                onEdit={(newText: string) => onEditTodo(todo.id, newText)}
              />
            )
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeTodo ? (
          <div className="p-4 rounded-lg border bg-slate-700/90 border-purple-400 shadow-2xl shadow-purple-500/50 backdrop-blur-sm transform rotate-3 scale-105">
            <div className="flex items-center gap-3">
              <div className="p-1 text-purple-400">
                <div className="w-4 h-4 bg-purple-400 rounded opacity-50" />
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono border ${
                  activeTodo.priority === "high"
                    ? "text-red-400 bg-red-500/20 border-red-500/50"
                    : activeTodo.priority === "medium"
                      ? "text-yellow-400 bg-yellow-500/20 border-yellow-500/50"
                      : "text-green-400 bg-green-500/20 border-green-500/50"
                }`}
              >
                <span>{activeTodo.priority.toUpperCase()}</span>
              </div>
              <span className="font-mono text-white flex-1">{activeTodo.text}</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
    </>
  )
}
