'use client'

import { useState } from 'react'

interface MessageInputProps {
  onSend: (message: string) => void
  disabled: boolean
}

const MessageInput = ({ onSend, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Describe your presentation... (e.g., 'Create a 5-slide presentation about renewable energy')"
        className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm sm:text-base"
        rows={2}
        disabled={disabled}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <p className="text-xs text-gray-500 order-2 sm:order-1">
          Press Enter to send, Shift+Enter for new line
        </p>
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="w-full sm:w-auto order-1 sm:order-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {disabled ? (
            <>
              <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default MessageInput