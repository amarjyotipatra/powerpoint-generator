export interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
}

export interface SlideContent {
  title: string
  content: string[]
  layout: 'title-content' | 'title-only' | 'content-only' | 'two-column'
  previewImage?: string | null
}

export interface PresentationData {
  slides: SlideContent[]
  title?: string
  theme?: string
}