"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Edit2, Save, GripVertical, AlertTriangle, Minus, ArrowDown } from "lucide-react"
import toast from "react-hot-toast"
import type { Todo, Priority } from "@/app/page"

interface SwipeableTodoItemProps {
  todo: Todo
  onToggle: () => void
  onDelete: () => void
  onEdit: (newText: string) => void
}

export function SwipeableTodoItem({ todo, onToggle, onDelete, onEdit }: SwipeableTodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const touchStartOffset = useRef<number>(0)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  }

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />
      case "medium":
        return <Minus className="w-4 h-4" />
      case "low":
        return <ArrowDown className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/30"
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
      case "low":
        return "text-green-400 bg-green-500/10 border-green-500/30"
    }
  }

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(editText.trim())
      toast.success("Task updated!", { icon: "✨" })
    }
    setIsEditing(false)
  }

  const handleToggle = () => {
    onToggle()
    toast.success(todo.completed ? "Task reactivated!" : "Task completed!", {
      icon: todo.completed ? "🔄" : "✅",
    })
  }

  const handleDelete = () => {
    onDelete()
    toast.success("Task deleted from system!", { icon: "🗑️" })
    // Reset swipe position after delete
    setSwipeOffset(0)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartOffset.current = swipeOffset
    setIsSwiping(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return
    
    const currentX = e.touches[0].clientX
    const diff = touchStartX.current - currentX
    const newOffset = Math.max(0, Math.min(120, touchStartOffset.current + diff))
    
    setSwipeOffset(newOffset)
  }

  const handleTouchEnd = () => {
    setIsSwiping(false)
    
    // Snap to either open or closed position
    if (swipeOffset > 60) {
      setSwipeOffset(120)
    } else {
      setSwipeOffset(0)
    }
  }

  const handleActionClick = (action: 'edit' | 'delete') => {
    if (action === 'edit') {
      setIsEditing(true)
    } else if (action === 'delete') {
      handleDelete()
    }
    // Close swipe after action
    setSwipeOffset(0)
  }

  // Reset swipe when editing starts
  useEffect(() => {
    if (isEditing) {
      setSwipeOffset(0)
    }
  }, [isEditing])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative overflow-hidden group p-4 rounded-lg border transition-all duration-300 hover:shadow-lg cyber-card ${
        isDragging
          ? "opacity-30 border-purple-400/50"
          : todo.completed
            ? "bg-slate-800/30 border-green-500/30 hover:border-green-400/50 hover:shadow-green-500/10"
            : "bg-slate-800/50 border-purple-500/30 hover:border-purple-400/50 hover:shadow-purple-500/10"
      }`}
    >
      {/* Swipeable Content */}
      <div
        ref={containerRef}
        className="relative flex items-center gap-3 swipe-transition"
        style={{ transform: `translateX(-${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-gray-500 hover:text-purple-400 transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-110 hover:bg-purple-500/10 rounded"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono border ${getPriorityColor(todo.priority)}`}
        >
          {getPriorityIcon(todo.priority)}
          <span>{todo.priority.toUpperCase()}</span>
        </div>

        <Button
          onClick={handleToggle}
          variant="ghost"
          size="sm"
          className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
            todo.completed
              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 shadow-lg shadow-green-500/20"
              : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 shadow-lg shadow-purple-500/20"
          }`}
        >
          <Check className="w-4 h-4" />
        </Button>

        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleEdit()}
              className="w-full px-2 py-1 bg-slate-700 border border-purple-400/50 rounded text-white font-mono focus:outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/20"
              autoFocus
            />
          ) : (
            <span className={`font-mono ${todo.completed ? "text-gray-400 line-through" : "text-white"}`}>
              {todo.text}
            </span>
          )}
        </div>

        {/* Desktop Action Buttons (hidden on mobile) */}
        <div className="hidden md:flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
          {isEditing ? (
            <Button
              onClick={handleEdit}
              variant="ghost"
              size="sm"
              className="p-2 text-green-400 hover:bg-green-500/20 hover:scale-110 transition-all duration-200 shadow-lg shadow-green-500/10"
            >
              <Save className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="sm"
              className="p-2 text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition-all duration-200 shadow-lg shadow-blue-500/10"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}

          <Button
            onClick={handleDelete}
            variant="ghost"
            size="sm"
            className="p-2 text-red-400 hover:bg-red-500/20 hover:scale-110 transition-all duration-200 shadow-lg shadow-red-500/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Action Buttons (revealed by swipe) */}
      <div className="absolute right-0 top-0 h-full flex items-center gap-2 pr-4">
        <Button
          onClick={() => handleActionClick('edit')}
          variant="ghost"
          size="sm"
          className="p-3 text-blue-400 bg-blue-500/20 hover:bg-blue-500/30 rounded-full shadow-lg shadow-blue-500/20"
        >
          <Edit2 className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => handleActionClick('delete')}
          variant="ghost"
          size="sm"
          className="p-3 text-red-400 bg-red-500/20 hover:bg-red-500/30 rounded-full shadow-lg shadow-red-500/20"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-2 right-2 opacity-20">
        <div
          className={`w-2 h-2 rounded-full ${todo.completed ? "bg-green-400" : "bg-purple-400"} animate-pulse`}
        ></div>
      </div>

              {/* Swipe Hint (only visible on mobile when not swiped) */}
        {swipeOffset === 0 && (
          <div className="absolute inset-0 flex items-center justify-end pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none md:hidden">
            <div className="text-purple-400/50 text-xs font-mono swipe-hint">
              ← Swipe for actions
            </div>
          </div>
        )}
    </div>
  )
}
