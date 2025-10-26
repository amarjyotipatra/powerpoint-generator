'use client'

import { SlideContent } from '@/types'

interface PresentationPreviewProps {
  slides: SlideContent[]
}

const PresentationPreview = ({ slides }: PresentationPreviewProps) => {
  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-400">
          <svg className="w-32 h-32 mx-auto mb-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xl font-semibold text-gray-500 mb-2">No presentation yet</p>
          <p className="text-sm text-gray-400">Your slides will appear here once generated</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {slides.map((slide, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {index + 1}
              </span>
              <span className="text-xs font-medium text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                {slide.layout}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            {slide.title && (
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                {slide.title}
              </h3>
            )}
            
            {slide.content && slide.content.length > 0 && (
              <ul className="space-y-3">
                {slide.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <span className="text-blue-500 mt-1.5 flex-shrink-0">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <p className="text-gray-700 leading-relaxed flex-1">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
      
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <p className="text-center text-sm font-semibold text-gray-700 mb-3">💡 You can also ask me to:</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="bg-white p-2 rounded-lg">• Add more slides</div>
          <div className="bg-white p-2 rounded-lg">• Edit specific content</div>
          <div className="bg-white p-2 rounded-lg">• Change slide order</div>
          <div className="bg-white p-2 rounded-lg">• Modify layout style</div>
        </div>
      </div>
    </div>
  )
}

export default PresentationPreview