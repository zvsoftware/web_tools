import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'

import ImageConverter from './ImageConverter.jsx'

import {
  BrowserRouter, Routes, Route
} from "react-router";

const BASE = process.env.NODE_ENV === 'production' ? '/' : '/';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <main id="main-content">
      <BrowserRouter basename={ BASE }>
        <Routes>
          <Route path="/" element={<ImageConverter/>} />
        </Routes>
      </BrowserRouter>
    </main>
    <footer className="footer py-12 text-gray-400">
      
      <p className="mb-4">
        <a href="https://apps.zoarvalleysoftware.com/" target="_blank">Created by Zoar Valley Software LLC</a>
        <br/>
        <a href="https://github.com/zvsoftware/web_tools" target="_blank">View on Github</a></p>
      <p>DISCLAIMER: We are not responsible for any potential data loss or data corruption that may result from the use of this tool.</p>
    </footer>
  </StrictMode>
)
