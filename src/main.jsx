import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'

import Home from './Home.jsx'
import ImageConverter from './ImageConverter.jsx'

import {
  BrowserRouter, Routes, Route
} from "react-router";

const root = document.getElementById("root");
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image-converter" element={<ImageConverter/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
