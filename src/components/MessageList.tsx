'use client'

import { Message } from '@/types'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
}

const MessageList = ({ messages, isLoading }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 mt-8 px-4">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Start Creating Your Presentation</h3>
          <p className="text-gray-600 mb-6">Describe what kind of presentation you need, and I&apos;ll create it for you!</p>
          
          <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
            <div className="bg-blue-50 p-4 rounded-lg text-left border border-blue-100">
              <p className="text-sm text-blue-900 font-medium mb-1">💡 Example 1:</p>
              <p className="text-sm text-blue-700">&quot;Create a presentation about artificial intelligence with 5 slides&quot;</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-left border border-purple-100">
              <p className="text-sm text-purple-900 font-medium mb-1">🚀 Example 2:</p>
              <p className="text-sm text-purple-700">&quot;Make a business plan presentation for a startup&quot;</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-left border border-green-100">
              <p className="text-sm text-green-900 font-medium mb-1">📊 Example 3:</p>
              <p className="text-sm text-green-700">&quot;Create a marketing strategy presentation with 7 slides&quot;</p>
            </div>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))
      )}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-pulse flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm">AI is thinking...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageList