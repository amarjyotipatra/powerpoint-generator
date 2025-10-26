'use client'

import { useState, useRef, useEffect } from 'react'
import PptxGenJS from 'pptxgenjs'
import { Message, SlideContent } from '@/types'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import PresentationPreview from './PresentationPreview'

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPresentation, setCurrentPresentation] = useState<SlideContent[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const generatePresentation = async (slides: SlideContent[]) => {
    const pres = new PptxGenJS()
    
    // Set presentation properties
    pres.author = 'AI PowerPoint Generator'
    pres.company = 'AI Assistant'
    pres.subject = 'AI Generated Presentation'
    pres.title = slides[0]?.title || 'Presentation'
    
    slides.forEach((slide) => {
      const slideObj = pres.addSlide()
      
      // Add background color
      slideObj.background = { color: 'FFFFFF' }
      
      // Add title
      if (slide.title) {
        slideObj.addText(slide.title, {
          x: 0.5,
          y: 0.5,
          w: 9,
          h: 1,
          fontSize: 32,
          bold: true,
          color: '2C3E50',
          align: 'left',
          fontFace: 'Arial'
        })
      }
      
      // Add content as bullet points
      if (slide.content && slide.content.length > 0) {
        slideObj.addText(
          slide.content.map(item => ({ text: item, options: { bullet: true, indentLevel: 0 } })),
          {
            x: 0.5,
            y: 2,
            w: 9,
            h: 5,
            fontSize: 18,
            color: '34495E',
            valign: 'top',
            fontFace: 'Arial',
            lineSpacing: 28
          }
        )
      }
    })
    
    return pres
  }

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          existingSlides: currentPresentation.length > 0 ? currentPresentation : null
        })
      })

      const data = await response.json()

      console.log('Received data from API:', data)

      if (!data.success) {
        throw new Error(data.error || 'Failed to get AI response')
      }

      // Get slides directly from response
      const slides = data.slides || []
      
      console.log('Slides received:', slides.length, slides)
      
      if (slides.length > 0) {
        setCurrentPresentation(slides)
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `I've ${currentPresentation.length > 0 ? 'updated' : 'created'} your presentation with ${slides.length} slides. You can preview them on the right and download when ready!`,
          sender: 'ai',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('No slides generated')
      }

    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error generating the presentation. Please try again with a different prompt.',
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPresentation = async () => {
    if (currentPresentation.length === 0) {
      alert('No presentation to download. Please create a presentation first.')
      return
    }

    try {
      const pres = await generatePresentation(currentPresentation)
      const fileName = `AI_Presentation_${new Date().getTime()}.pptx`
      await pres.writeFile({ fileName })
      
      // Add success message
      const successMessage: Message = {
        id: Date.now().toString(),
        content: `✅ Presentation downloaded successfully as "${fileName}"!`,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, successMessage])
    } catch (error) {
      console.error('Error downloading presentation:', error)
      alert('Failed to download presentation. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8 px-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
            AI PowerPoint Generator
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Create stunning presentations with AI - Just describe what you need!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 h-[calc(100vh-8rem)] sm:h-[calc(100vh-12rem)]">
          {/* Presentation Preview Section - Shows first on mobile */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg flex flex-col overflow-hidden border border-gray-100 order-2 lg:order-2">
            <div className="p-3 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-green-500 to-teal-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  Presentation Preview
                </h2>
                <p className="text-green-100 text-xs sm:text-sm">
                  {currentPresentation.length} {currentPresentation.length === 1 ? 'slide' : 'slides'} generated
                </p>
              </div>
              {currentPresentation.length > 0 && (
                <button
                  onClick={handleDownloadPresentation}
                  className="bg-white text-green-600 px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-gray-100 transition-all font-semibold shadow-md flex items-center gap-1 sm:gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PPTX
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gray-50">
              <PresentationPreview slides={currentPresentation} />
            </div>
          </div>

          {/* Chat Section - Shows second on mobile */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg flex flex-col overflow-hidden border border-gray-100 order-1 lg:order-1">
            <div className="p-3 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-500">
              <h2 className="text-lg sm:text-xl font-bold text-white">Chat with AI</h2>
              <p className="text-blue-100 text-xs sm:text-sm">
                Describe your presentation and I&apos;ll create it for you
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <MessageList messages={messages} isLoading={isLoading} />
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-3 sm:p-6 border-t border-gray-200 bg-gray-50">
              <MessageInput onSend={handleSendMessage} disabled={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface