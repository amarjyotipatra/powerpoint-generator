# AI-Powered PowerPoint Generator Chat Application

A Next.js application with TypeScript that provides an AI-powered chat interface for generating and editing PowerPoint presentations using Gemini AI and pptxgenjs.

## 🚀 Features

- **Chat Interface**: Interactive chat UI similar to MagicSlides AI-Slide for seamless user experience
- **AI-Powered Content Generation**: Uses Gemini 2.0 Flash Exp model for intelligent slide content creation
- **PowerPoint Generation**: Creates PPTX files using pptxgenjs library
- **Dynamic Editing**: Edit and update slides through natural language prompts
- **Real-time Preview**: Live preview of generated presentation slides
- **Download Support**: Export presentations as PPTX files
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini AI (gemini-2.0-flash-exp)
- **PPT Generation**: pptxgenjs
- **State Management**: React Hooks
- **API Routes**: Next.js API routes for backend functionality

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Google AI Studio API key (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

## 🚀 Getting Started

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd Powerpoint_Application

# Install dependencies
npm install
```

### 2. Configure API Key

Create a `.env.local` file in the root directory:


### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Using the Application

1. **Start Immediately**: The app uses the server-side API key - no need to enter it manually!
2. **Create Presentations**: Type prompts like:
   - "Create a presentation about artificial intelligence with 5 slides"
   - "Make a business presentation about sustainable energy"
   - "Generate a marketing strategy presentation with 7 slides"
3. **Edit Presentations**: Update existing slides with prompts like:
   - "Add a slide about machine learning applications"
   - "Change the content of slide 2 to focus on benefits"
   - "Make the presentation more technical"
4. **Download**: Click "Download PPTX" to save your presentation

## 📝 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🎯 Usage Examples

### Creating a New Presentation
```
"Create a 5-slide presentation about climate change including causes, effects, and solutions"
```

### Editing Existing Slides
```
"Add a slide about renewable energy sources after slide 3"
"Update the conclusion slide to include action items"
"Change the layout of slide 2 to two-column format"
```

### Customizing Content
```
"Make the presentation more technical with specific data points"
"Simplify the language for a general audience"
"Add more visual descriptions for each slide"
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/chat/           # API routes for AI integration
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── ChatInterface.tsx   # Main chat interface component
│   ├── MessageList.tsx     # Chat messages display
│   ├── MessageInput.tsx    # Message input component
│   └── PresentationPreview.tsx # Slide preview component
└── types/
    └── index.ts           # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables

The application uses server-side API key management for better security. Create a `.env.local` file:

```env
GOOGLE_AI_API_KEY=your_gemini_api_key_here
```

**Important**: 
- Never commit `.env.local` to version control
- The API key is only used server-side for security
- Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Customizing AI Prompts
Edit the prompts in `src/app/api/chat/route.ts` to customize how the AI generates presentation content.

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` to customize the design system
- Update components in `src/components/` to change UI elements
- Edit `src/app/globals.css` for global style overrides

### AI Behavior
- Adjust prompts in the API route for different content styles
- Modify the slide parsing logic in `ChatInterface.tsx`
- Update slide layouts and templates in the presentation generation

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Deploy the `.next` folder and `package.json`

## 🔒 Security Notes

- **Server-side API Key**: API key is stored server-side in `.env.local` for security
- **No Client Exposure**: Users don't need to enter API keys - it's handled securely on the server
- **Environment Variables**: Never commit `.env.local` or `.env` files to version control
- **Input Validation**: All user inputs are validated before processing
- **Rate Limiting**: Consider implementing rate limiting in production

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**: Ensure all dependencies are installed with `npm install`
2. **API Key Issues**: Verify your Gemini API key is valid and has sufficient quota
3. **Port Conflicts**: The app automatically tries port 3001 if 3000 is in use
4. **TypeScript Errors**: Run `npm run build` to check for type issues

### Support

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Gemini AI documentation](https://ai.google.dev/docs)
- Consult [pptxgenjs documentation](https://gitbrent.github.io/PptxGenJS/)

## 📄 License

This project is available for educational and demonstration purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This application requires a valid Google AI Studio API key to function. The key is required for AI-powered content generation features.