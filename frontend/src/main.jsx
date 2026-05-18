import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AppProvider } from './context/AppContex';
import { StudentProvider } from './context/StudentContext';
import { RecruiterProvider } from './context/RecruiterContext';
import {AdminProvider} from './context/AdminContext';
import { AuthProvider } from './context/AuthenthicationContext';



import '@styles/index.css';
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>

      <AuthProvider>
        <AppProvider>
          <StudentProvider>
            <RecruiterProvider>
              <AdminProvider>

                <App />
                <Toaster position="top-right" />

              </AdminProvider>
            </RecruiterProvider>
          </StudentProvider>
        </AppProvider>
      </AuthProvider>

    </BrowserRouter>
  </React.StrictMode>
);