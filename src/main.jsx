import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'

import ImageConverter from './ImageConverter.jsx'

import {
  BrowserRouter, Routes, Route
} from "react-router";

const BASE = '/web_utils/';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <main id="main-content">
      <BrowserRouter basename={BASE}>
        <Routes>
          <Route path="/" element={<ImageConverter/>} />
        </Routes>
      </BrowserRouter>
    </main>
    <footer className="footer py-12">
      <p><a href="https://www.zoarvalleysoftware.com" target="_blank" rel="noopener noreferrer">© Zoar Valley Software LLC - 2025</a></p>
    </footer>
  </StrictMode>
)
