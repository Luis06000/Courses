import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListeMagasins from './components/ListeMagasins';
import Checklist from './components/Checklist';
import ListeAttente from './components/ListeAttente';
import './App.css';
import { ArticlesProvider } from './contexts/ArticlesContext';

function App() {
  return (
    <ArticlesProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <h1>Mes courses</h1>
          <Routes>
            <Route path="/" element={<ListeMagasins />} />
            <Route path="/magasin/:id" element={<Checklist />} />
            <Route path="/en-attente" element={<ListeAttente />} />
          </Routes>
        </div>
      </Router>
    </ArticlesProvider>
  );
}

export default App;