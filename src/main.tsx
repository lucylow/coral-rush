import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error handling for React rendering
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  
  const root = createRoot(rootElement);
  root.render(<App />);
  
  console.log("✅ React app rendered successfully");
} catch (error) {
  console.error("❌ React rendering error:", error);
  
  // Fallback HTML if React fails
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh; 
        background: #1a1a1a; 
        color: white; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        padding: 20px;
        text-align: center;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div>
          <h1>🌊 RUSH Coral Protocol</h1>
          <p>Voice-First Web3 Customer Support Agent</p>
          <p style="color: #ef4444; margin-top: 20px;">React Error: ${error.message}</p>
          <button 
            onclick="window.location.reload()" 
            style="
              margin-top: 20px; 
              padding: 10px 20px; 
              background: #3b82f6; 
              color: white; 
              border: none; 
              border-radius: 5px;
              cursor: pointer;
            "
          >
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
}
