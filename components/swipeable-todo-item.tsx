"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Edit2, Save, AlertTriangle, Minus, ArrowDown, GripVertical } from "lucide-react"
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
  const [isRevealed, setIsRevealed] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isDndDragging } = useSortable({ id: todo.id })

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
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    // Only handle swipe if not starting from the drag handle
    const target = e.target as HTMLElement
    if (target.closest('button[data-drag-handle]')) {
      return // Let drag handle handle its own touch events
    }
    
    // Don't start swipe if already dragging for reorder
    if (isDndDragging) return
    
    // Don't start swipe if starting from an input field
    if (target.tagName === 'INPUT') return
    
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    // Don't handle swipe if dragging for reorder
    if (isDndDragging) return
    
    const currentTouchX = e.touches[0].clientX
    const diff = startX - currentTouchX
    
    // Only allow swiping left (revealing actions) with smooth resistance
    if (diff > 0) {
      // Add smooth resistance for better feel
      const resistance = 0.7
      const swipeDistance = Math.min(diff * resistance, 120)
      setCurrentX(-swipeDistance)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    // If swiped more than 50px, reveal actions (lowered threshold for better UX)
    if (currentX < -50) {
      setIsRevealed(true)
      setCurrentX(-120)
    } else {
      setIsRevealed(false)
      setCurrentX(0)
    }
  }

  const resetPosition = () => {
    setIsRevealed(false)
    setCurrentX(0)
  }

  // Reset position when editing starts
  useEffect(() => {
    if (isEditing) {
      resetPosition()
    }
  }, [isEditing])

  // Auto-close swipe after a delay when actions are revealed
  useEffect(() => {
    if (isRevealed) {
      const timer = setTimeout(() => {
        if (!isEditing) {
          resetPosition()
        }
      }, 4000) // Auto-close after 4 seconds for better UX
      
      return () => clearTimeout(timer)
    }
  }, [isRevealed, isEditing])

  return (
    <div className="relative overflow-hidden">
      {/* Action buttons container - completely hidden behind the main item */}
      <div 
        className={`absolute right-0 top-0 h-full flex items-center bg-slate-700/95 backdrop-blur-sm swipe-actions z-10 transition-opacity duration-200 ${
          currentX < -20 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: `translateX(${Math.max(0, -currentX)}px)`,
        }}
      >
        <div className="flex gap-2 p-4">
          {isEditing ? (
            <Button onClick={handleEdit} variant="ghost" size="sm" className="p-2 text-green-400 hover:bg-green-500/20">
              <Save className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="sm"
              className="p-2 text-blue-400 hover:bg-blue-500/20"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}
          <Button onClick={handleDelete} variant="ghost" size="sm" className="p-2 text-red-400 hover:bg-red-500/20">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main todo item - slides over the actions with solid background */}
      <div
        ref={setNodeRef}
        className={`swipeable-todo group p-4 rounded-lg border transition-all duration-300 hover:shadow-lg cyber-card relative z-20 ${
          isDndDragging
            ? "opacity-30 border-purple-400/50"
            : todo.completed
              ? "bg-slate-800/50 border-green-500/30 hover:border-green-400/50 hover:shadow-green-500/10"
              : "bg-slate-800/70 border-purple-500/30 hover:border-purple-400/50 hover:shadow-purple-500/10"
        } ${isDragging ? "shadow-lg shadow-purple-500/20" : ""}`}
        style={{
          transform: `${style.transform} translateX(${currentX}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={resetPosition}
        data-swipeable
      >
        <div className="flex items-center gap-3">
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            data-drag-handle
            className="p-1 text-gray-500 hover:text-purple-400 transition-all duration-200 cursor-grab active:cursor-grabbing hover:scale-110 hover:bg-purple-500/10 rounded touch-none"
          >
            <GripVertical className="w-4 h-4" />
          </button>

          {/* Priority tag */}
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

          {/* Swipe hint for mobile - only visible when not swiped */}
          <div className={`text-xs transition-opacity duration-200 ${
            currentX < -10 ? "opacity-0" : "opacity-60 text-gray-500"
          }`}>
            ← Swipe
          </div>
        </div>

        {/* Status indicator dot */}
        <div className="absolute top-2 right-2 opacity-20">
          <div
            className={`w-2 h-2 rounded-full ${todo.completed ? "bg-green-400" : "bg-purple-400"} animate-pulse`}
          ></div>
        </div>
      </div>
    </div>
  )
}
