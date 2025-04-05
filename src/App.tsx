import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import CreateRole from './pages/roles/CreateRole';
import Footer from './components/layout/Footer';

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#9c27b0',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#d9534f',
    },
    warning: {
      main: '#f0ad4e',
    },
    info: {
      main: '#5bc0de',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

// Componente para rutas protegidas
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Componente de página en construcción
const UnderConstruction = () => (
  <div style={{ textAlign: 'center', padding: '5rem' }}>
    <h2>Página en Construcción</h2>
    <p>Esta sección estará disponible próximamente.</p>
  </div>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Sidebar>
                    <Dashboard />
                    <Footer />
                  </Sidebar>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <Sidebar>
                    <UnderConstruction />
                    <Footer />
                  </Sidebar>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute>
                  <Sidebar>
                    <UnderConstruction />
                    <Footer />
                  </Sidebar>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/roles/create" 
              element={
                <ProtectedRoute>
                  <Sidebar>
                    <CreateRole />
                    <Footer />
                  </Sidebar>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/roles" 
              element={
                <ProtectedRoute>
                  <Sidebar>
                    <UnderConstruction />
                    <Footer />
                  </Sidebar>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Sidebar>
                    <UnderConstruction />
                    <Footer />
                  </Sidebar>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
