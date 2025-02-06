# Artalyze

**Artalyze** is a cutting-edge web application that seamlessly blends creativity with artificial intelligence. Whether you're sketching a mathematical equation, drawing a tree, or designing a car, Artalyze intelligently analyzes your artwork, providing insightful descriptions and detailed interpretations. Designed with both desktop and mobile users in mind, Artalyze offers a responsive and intuitive interface, making artistic expression and analysis accessible anytime, anywhere.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)

## Features

- **Intuitive Drawing Interface**
  - Smooth drawing experience with customizable stroke widths
  - Pen and eraser tools with dynamic cursor icons
  - Color palette with a wide range of colors
  - Mobile-responsive design for drawing on-the-go

- **AI-Powered Analysis**
  - Generates a brief description and a detailed interpretation of your drawings
  - Differentiates between mathematical expressions and general drawings, providing context-aware analysis

- **Responsive UI**
  - Adaptive tool panels for both desktop and mobile views
  - Clean and modern design with backdrop blur effects and smooth transitions

- **Seamless Integration**
  - Backend powered by Google's Generative AI for accurate and insightful analysis
  - Efficient data handling and error management for a robust user experience

## Demo

*Coming Soon!*

## Usage

1. **Drawing**
   - Use the pen tool to create your artwork on the canvas
   - Adjust the stroke width using the slider to achieve desired thickness
   - Select colors from the palette to add vibrancy to your drawings
   - Switch to the eraser tool to remove specific parts of your drawing

2. **Analysis**
   - Once you've completed your drawing, click the **Analyze** button
   - Artalyze will process your drawing and display a modal with a brief description and a detailed analysis
   - Use the **Draw Something New** button to reset the canvas and start a fresh drawing

## Technologies Used

### Frontend
- **React** with **TypeScript**
- **Vite** for fast development and build
- **Tailwind CSS** for utility-first styling
- **Mantine** for additional UI components
- **Lucide React** for scalable icons
- **Axios** for HTTP requests

### Backend
- **Node.js** with **Express**
- **Google Generative AI** for image analysis
- **Joi** for request validation
- **Cors** for cross-origin resource sharing
- **dotenv** for environment variable management

## Project Structure

### Frontend
```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   │   └── Home.tsx
│   ├── lib/
│   ├── App.tsx
│   ├── main.tsx
│   ├── constants.ts
│   └── ...
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── vite.config.ts
└── ...
```

### Backend
```
backend/
├── src/
│   ├── config/
│   │   └── constants.js
│   ├── routes/
│   │   └── calculator.route.js
│   ├── utils/
│   │   └── imageAnalyzer.js
│   └── index.js
├── .gitignore
├── package.json
└── ...
```