import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home.tsx";
import '@/index.css';
import { MantineProvider } from '@mantine/core';

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
