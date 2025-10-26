import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

// Function to render a slide's content into an image using Puppeteer
async function renderSlideToImage(slide: any, slideIndex: number): Promise<string> {
  // Launch a headless browser
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  // Set a standard slide viewport, e.g., 16:9 aspect ratio
  await page.setViewport({ width: 1280, height: 720 })

  // Determine slide layout and styling
  const isFirstSlide = slideIndex === 0
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  ]
  
  const gradient = gradients[slideIndex % gradients.length]

  // Enhanced HTML structure for the slide content with modern design
  const htmlContent = `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${gradient};
            height: 100vh;
            padding: 60px;
            position: relative;
            overflow: hidden;
          }
          body::before {
            content: '';
            position: absolute;
            width: 300px;
            height: 300px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            top: -100px;
            right: -100px;
          }
          body::after {
            content: '';
            position: absolute;
            width: 400px;
            height: 400px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 50%;
            bottom: -150px;
            left: -150px;
          }
          .slide-container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 24px;
            padding: ${isFirstSlide ? '80px 100px' : '60px 80px'};
            max-width: 1100px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            position: relative;
            z-index: 1;
          }
          .slide-number {
            position: absolute;
            top: 40px;
            right: 60px;
            font-size: 18px;
            font-weight: 600;
            color: rgba(0, 0, 0, 0.4);
          }
          h1 {
            font-size: ${isFirstSlide ? '72px' : '56px'};
            font-weight: 800;
            background: ${gradient};
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: ${isFirstSlide ? '30px' : '40px'};
            line-height: 1.2;
            letter-spacing: -0.02em;
          }
          ${isFirstSlide ? `
          .subtitle {
            font-size: 24px;
            color: #666;
            font-weight: 500;
            margin-top: 20px;
          }
          ` : ''}
          ul {
            list-style: none;
            padding: 0;
            display: grid;
            gap: 20px;
          }
          li {
            font-size: 22px;
            color: #333;
            line-height: 1.6;
            padding-left: 40px;
            position: relative;
            font-weight: 500;
          }
          li::before {
            content: '';
            position: absolute;
            left: 0;
            top: 8px;
            width: 24px;
            height: 24px;
            background: ${gradient};
            border-radius: 6px;
            opacity: 0.8;
          }
          .accent-bar {
            width: 80px;
            height: 6px;
            background: ${gradient};
            border-radius: 3px;
            margin-bottom: 30px;
          }
        </style>
      </head>
      <body>
        <div class="slide-container">
          <div class="slide-number">${String(slideIndex + 1).padStart(2, '0')}</div>
          ${!isFirstSlide ? '<div class="accent-bar"></div>' : ''}
          <h1>${slide.title}</h1>
          ${isFirstSlide && slide.content.length > 0 ? 
            `<div class="subtitle">${slide.content[0]}</div>` : 
            `<ul>
              ${slide.content.map((item: string) => `<li>${item}</li>`).join('')}
            </ul>`
          }
        </div>
      </body>
    </html>
  `

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

  // Take a screenshot and encode it as a Base64 string
  const imageBuffer = await page.screenshot({ encoding: 'base64' })

  await browser.close()

  return imageBuffer.toString()
}

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

    // Generate image previews for each slide
    const slidesWithPreviews = await Promise.all(
      parsedData.slides.map(async (slide: any, index: number) => {
        try {
          const previewImage = await renderSlideToImage(slide, index)
          return { ...slide, previewImage: `data:image/png;base64,${previewImage}` }
        } catch (renderError) {
          console.error('Slide Render Error:', renderError)
          // If rendering fails, return slide without a preview
          return { ...slide, previewImage: null }
        }
      })
    )

    return NextResponse.json({
      success: true,
      slides: slidesWithPreviews,
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