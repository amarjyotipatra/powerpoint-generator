import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, existingSlides } = await request.json()

    // Use server-side API key from environment variable
    const apiKey = process.env.GOOGLE_AI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured on server' },
        { status: 500 }
      )
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const prompt = existingSlides && existingSlides.length > 0 
      ? `You are a PowerPoint presentation expert. Based on the user's request: "${message}"

Current presentation has ${existingSlides.length} slides:
${existingSlides.map((slide: any, index: number) => `
Slide ${index + 1}:
Title: ${slide.title}
Content: ${slide.content.join(', ')}
`).join('\n')}

Modify the presentation according to the user's request. Return ONLY a valid JSON object in this exact format:
{
  "slides": [
    {
      "title": "Slide Title",
      "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "layout": "title-content"
    }
  ]
}

Rules:
- Return ONLY the JSON object, no markdown code blocks, no extra text
- Each slide must have title, content (array of strings), and layout
- Layout can be: "title-content", "title-only", "content-only", "two-column"
- Include 3-5 bullet points per slide
- Make content clear, concise, and professional`
      : `You are a PowerPoint presentation expert. Create a professional presentation about: "${message}"

Return ONLY a valid JSON object in this exact format:
{
  "slides": [
    {
      "title": "Slide Title",
      "content": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
      "layout": "title-content"
    }
  ]
}

Rules:
- Return ONLY the JSON object, no markdown code blocks, no extra text
- Create 5-8 slides for a complete presentation
- First slide should be a title slide with main topic
- Each slide must have title, content (array of strings), and layout
- Layout can be: "title-content", "title-only", "content-only", "two-column"
- Include 3-5 bullet points per slide
- Make content clear, concise, and professional
- Last slide should be a conclusion or summary`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    console.log('Raw AI Response:', text.substring(0, 200)) // Log first 200 chars for debugging

    // Clean up the response - remove markdown code blocks if present
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
    
    // Remove any extra text before the first { or after the last }
    const firstBrace = text.indexOf('{')
    const lastBrace = text.lastIndexOf('}')
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1)
    }

    // Try to parse to validate JSON
    let parsedData
    try {
      parsedData = JSON.parse(text)
      
      // Validate the structure
      if (!parsedData.slides || !Array.isArray(parsedData.slides)) {
        throw new Error('Invalid slides structure')
      }
      
      // Ensure all slides have required fields
      parsedData.slides = parsedData.slides.map((slide: any) => ({
        title: slide.title || 'Untitled Slide',
        content: Array.isArray(slide.content) ? slide.content : [String(slide.content)],
        layout: slide.layout || 'title-content'
      }))
      
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError)
      console.error('Text that failed to parse:', text)
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to parse AI response. The AI did not return valid JSON. Please try rephrasing your request.' 
        },
        { status: 500 }
      )
    }

    console.log('Successfully parsed slides:', parsedData.slides.length, 'slides')

    return NextResponse.json({ 
      success: true,
      slides: parsedData.slides  // Send slides directly, not as string
    })

  } catch (error: any) {
    console.error('API Error Details:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to generate content. Please try again.' 
      },
      { status: 500 }
    )
  }
}