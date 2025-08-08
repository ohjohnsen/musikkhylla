import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import MusicRack from './components/MusicRack';
import Login from './components/Login';
import './App.css';

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="App">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '18px'
        }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="App">
      <header style={{ 
        textAlign: 'center', 
        padding: '20px 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        marginBottom: '0'
      }}>
        <h1 style={{ margin: 0, fontSize: '3rem', fontWeight: 'bold' }}>🎵 Musikkhylla</h1>
        <p style={{ margin: '10px 0 0', fontSize: '1.2rem', opacity: 0.9 }}>
          Your Visual Music Collection
        </p>
      </header>
      
      <main>
        <MusicRack />
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
