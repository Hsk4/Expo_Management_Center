import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import './index.css'
import App from './App.tsx'
import {AuthProvider} from "./contexts/Auth.context.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <AuthProvider>

        <App />
          </AuthProvider>
      </BrowserRouter>
  </StrictMode>,
)
