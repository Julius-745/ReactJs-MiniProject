import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { GlobalAlert } from './components/global-alert.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <div className="fixed top-4 right-4 z-[100]">
      <GlobalAlert />
    </div>
  </StrictMode>
);
