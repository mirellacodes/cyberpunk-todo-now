"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Edit2, Save } from "lucide-react"
import toast from "react-hot-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Todo } from "@/app/page"

interface TodoItemProps {
  todo: Todo
  onToggle: () => void
  onDelete: () => void
  onEdit: (newText: string) => void
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const isMobile = useIsMobile()

  // Use CSS media query approach to avoid hydration issues
  const [isMobileDevice, setIsMobileDevice] = useState(false)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        const mobile = window.innerWidth < 768
        setIsMobileDevice(mobile)
      }
      
      // Set initial value after a small delay to ensure hydration is complete
      const timer = setTimeout(checkMobile, 0)
      window.addEventListener('resize', checkMobile)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('resize', checkMobile)
      }
    }
  }, [])

  // Debug logging (only on client)
  if (typeof window !== 'undefined') {
    console.log('TodoItem render - isMobile:', isMobile, 'isMobileDevice:', isMobileDevice, 'swipeOffset:', swipeOffset)
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
    if (typeof window !== 'undefined') {
      console.log('Touch start - isMobileDevice:', isMobileDevice)
    }
    if (!isMobileDevice) return
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    setIsDragging(true)
    if (typeof window !== 'undefined') {
      console.log('Touch start - coords:', touchStartX.current, touchStartY.current)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined') {
      console.log('Mouse down - isMobileDevice:', isMobileDevice)
    }
    if (!isMobileDevice) return
    touchStartX.current = e.clientX
    touchStartY.current = e.clientY
    setIsDragging(true)
    if (typeof window !== 'undefined') {
      console.log('Mouse down - coords:', touchStartX.current, touchStartY.current)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobileDevice || !isDragging) return
    
    const touchX = e.touches[0].clientX
    const touchY = e.touches[0].clientY
    const deltaX = touchX - touchStartX.current
    const deltaY = Math.abs(touchY - touchStartY.current)
    
    if (typeof window !== 'undefined') {
      console.log('Touch move - deltaX:', deltaX, 'deltaY:', deltaY)
    }
    
    // Only allow horizontal swiping if vertical movement is minimal
    if (deltaY < 50) {
      const newOffset = Math.max(-120, Math.min(0, deltaX))
      setSwipeOffset(newOffset)
      if (typeof window !== 'undefined') {
        console.log('Setting swipe offset:', newOffset)
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMobileDevice || !isDragging) return
    
    const mouseX = e.clientX
    const mouseY = e.clientY
    const deltaX = mouseX - touchStartX.current
    const deltaY = Math.abs(mouseY - touchStartY.current)
    
    if (typeof window !== 'undefined') {
      console.log('Mouse move - deltaX:', deltaX, 'deltaY:', deltaY)
    }
    
    // Only allow horizontal swiping if vertical movement is minimal
    if (deltaY < 50) {
      const newOffset = Math.max(-120, Math.min(0, deltaX))
      setSwipeOffset(newOffset)
      if (typeof window !== 'undefined') {
        console.log('Setting swipe offset:', newOffset)
      }
    }
  }

  const handleTouchEnd = () => {
    if (typeof window !== 'undefined') {
      console.log('Touch end - swipeOffset:', swipeOffset)
    }
    if (!isMobileDevice) return
    
    setIsDragging(false)
    if (swipeOffset < -60) {
      setSwipeOffset(-120)
      if (typeof window !== 'undefined') {
        console.log('Snapping to open')
      }
    } else {
      setSwipeOffset(0)
      if (typeof window !== 'undefined') {
        console.log('Snapping to closed')
      }
    }
  }

  const handleMouseUp = () => {
    if (typeof window !== 'undefined') {
      console.log('Mouse up - swipeOffset:', swipeOffset)
    }
    if (!isMobileDevice) return
    
    setIsDragging(false)
    if (swipeOffset < -60) {
      setSwipeOffset(-120)
      if (typeof window !== 'undefined') {
        console.log('Snapping to open')
      }
    } else {
      setSwipeOffset(0)
      if (typeof window !== 'undefined') {
        console.log('Snapping to closed')
      }
    }
  }

  const resetSwipe = () => {
    setSwipeOffset(0)
  }

  const handleEditClick = () => {
    resetSwipe()
    setIsEditing(true)
  }

  const handleDeleteClick = () => {
    resetSwipe()
    handleDelete()
  }

  // Reset swipe when editing
  useEffect(() => {
    if (isEditing) {
      setSwipeOffset(0)
    }
  }, [isEditing])

  const todoContent = (
    <div
      className={`group p-4 rounded-lg border transition-all duration-300 hover:shadow-lg ${
        todo.completed
          ? "bg-slate-800/30 border-green-500/30 hover:border-green-400/50 hover:shadow-green-500/10"
          : "bg-slate-800/50 border-purple-500/30 hover:border-purple-400/50 hover:shadow-purple-500/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <Button
          onClick={handleToggle}
          variant="ghost"
          size="sm"
          className={`p-2 rounded-full transition-all duration-300 ${
            todo.completed
              ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
              : "bg-purple-500/20 text-purple-400 hover:bg-purple-400/30"
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
              className="w-full px-2 py-1 bg-slate-700 border border-purple-400/50 rounded text-white font-mono focus:outline-none focus:border-purple-400"
              autoFocus
            />
          ) : (
            <span className={`font-mono ${todo.completed ? "text-gray-400 line-through" : "text-white"}`}>
              {todo.text}
            </span>
          )}
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isEditing ? (
            <Button onClick={handleEdit} variant="ghost" size="sm" className="p-2 text-green-400 hover:bg-green-500/20">
              <Save className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleEditClick}
              variant="ghost"
              size="sm"
              className="p-2 text-blue-400 hover:bg-blue-500/20"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}

          <Button onClick={handleDeleteClick} variant="ghost" size="sm" className="p-2 text-red-400 hover:bg-red-500/20">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  if (!isMobileDevice) {
    return todoContent
  }

  return (
    <div className="relative overflow-hidden" suppressHydrationWarning>
      {/* Swipe actions background */}
      <div className="absolute inset-0 flex items-center justify-end pr-4 bg-gradient-to-l from-blue-500/20 to-purple-500/20 rounded-lg">
        <div className="flex gap-2">
          <Button
            onClick={handleEditClick}
            variant="ghost"
            size="sm"
            className="p-2 text-blue-400 hover:bg-blue-500/20"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleDeleteClick}
            variant="ghost"
            size="sm"
            className="p-2 text-red-400 hover:bg-red-500/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Swipeable content */}
      <div
        className="relative transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {todoContent}
      </div>
      
      {/* Swipe hint indicator */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 opacity-50">
        ← swipe
      </div>
    </div>
  )
}
