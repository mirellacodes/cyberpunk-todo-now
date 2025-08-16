"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import toast from "react-hot-toast"
import type { Priority } from "@/app/page"

interface TodoInputProps {
  onAddTodo: (text: string, priority: Priority) => void
}

export function TodoInput({ onAddTodo }: TodoInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onAddTodo(inputValue.trim(), priority)
      setInputValue("")
      setPriority("medium")
      toast.success("Task added to the matrix!", {
        icon: "⚡",
      })
    }
  }

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case "high":
        return "border-red-500/50 bg-red-500/10 text-red-300"
      case "medium":
        return "border-yellow-500/50 bg-yellow-500/10 text-yellow-300"
      case "low":
        return "border-green-500/50 bg-green-500/10 text-green-300"
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex gap-3 mb-3 items-stretch">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a new task..."
          className="flex-1 px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 font-mono"
        />
        <Button
          type="submit"
          variant="ghost"
          className="px-4 py-3 h-full text-purple-300 bg-purple-900/30 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 hover:text-purple-200 hover:border-purple-400 hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-400/30"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex gap-2">
        <span className="text-gray-400 text-sm font-mono flex items-center">Priority:</span>
        {(["high", "medium", "low"] as Priority[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriority(p)}
            className={`px-3 py-1 rounded-full text-xs font-mono border transition-all duration-300 ${
              priority === p
                ? getPriorityColor(p) + " shadow-lg"
                : "border-gray-600 bg-gray-800/50 text-gray-400 hover:border-gray-500"
            }`}
          >
            {p.toUpperCase()}
          </button>
        ))}
      </div>
    </form>
  )
}
