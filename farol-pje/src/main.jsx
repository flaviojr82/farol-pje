import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Importações do PrimeReact (Estilos)
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // Tema base do Sakai
import 'primereact/resources/primereact.min.css';                 // Core CSS
import 'primeicons/primeicons.css';                               // Ícones

import { PrimeReactProvider } from 'primereact/api';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>,
)