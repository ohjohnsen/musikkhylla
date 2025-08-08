import React from 'react';
import MusicRack from './components/MusicRack';
import './App.css';

function App() {
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

export default App;
