"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Edit2, Save } from "lucide-react"
import toast from "react-hot-toast"
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

  return (
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
              : "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
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
    </div>
  )
}
