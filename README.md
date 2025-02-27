# Drawalyze

**Drawalyze** is a web application that uses AI to analyze drawings. You can draw mathematical equations, trees, cars, or any other sketches, and the application will provide descriptions and interpretations of your drawings. The application works on both desktop and mobile devices.

---

## Features

### **Drawing Tools**

- Drawing canvas with adjustable stroke width
- Pen and eraser tools
- Color selection
- Mobile support
- Save drawings and continue later
- View and load saved drawings

### **AI Analysis**

- Provides brief descriptions and detailed interpretations of drawings
- Identifies mathematical expressions and general drawings

### **User Interface**

- Tool panels that work on desktop and mobile
- Simple design with smooth transitions

### **Backend Integration**

- Uses Google's Generative AI for drawing analysis
- Handles data processing and error management
- Secure image storage with Appwrite

---

## Demo

Visit [Drawalyze](https://drawalyze.netlify.app)

---

## Usage

### **Drawing:**

1. Use the pen tool to draw on the canvas
2. Adjust stroke width with the slider
3. Choose colors from the palette
4. Use the eraser to remove parts of your drawing

### **Saving and Loading:**

1. Click **Save** to store your drawing
2. Add a name to identify your drawing
3. Access saved drawings from the sidebar
4. Click on a saved drawing to continue working on it

### **Analysis:**

1. Click the **Analyze** button when finished drawing
2. View the description and analysis in the popup window
3. Click **Draw Something New** to clear the canvas

---

## Technologies Used

### **Frontend**

- **React** with **TypeScript**
- **Vite** for development
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Lucide React** for icons
- **Axios** for HTTP requests
- **Appwrite** for authentication and storage
- **Redux Toolkit** for state management

### **Backend**

- **Node.js** with **Express**
- **Google Generative AI** for image analysis
- **Joi** for request validation
- **Cors** for cross-origin resource sharing
- **dotenv** for environment variables

---

## Project Structure

### **Frontend**

```plaintext
frontend/
├── public/
├── src/
│   ├── assets/
│   ├── appwrite/
│   │   ├── auth.ts
│   │   └── storage.ts
│   ├── components/
│   │   ├── ui/
│   │   ├── AnimatedCube.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── PublicRoute.tsx
│   │   ├── ResultsModal.tsx
│   │   ├── SavedImagesPanel.tsx
│   │   └── SaveImageModal.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── VerifyEmail.tsx
│   ├── store/
│   │   ├── features/
│   │   │   └── authSlice.ts
│   │   ├── hooks.ts
│   │   └── store.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

### **Backend**

```plaintext
backend/
├── src/
│   ├── config/
│   │   └── constants.js
│   ├── routes/
│   │   └── calculator.route.js
│   ├── utils/
│   │   └── imageAnalyzer.js
│   └── index.js
├── .env.sample
└── package.json
```

---

**Drawalyze** - Draw and Analyze
