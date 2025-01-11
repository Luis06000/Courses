import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListeMagasins from './components/ListeMagasins';
import Checklist from './components/Checklist';
import './App.css';
import { ArticlesProvider } from './contexts/ArticlesContext';

function App() {
  return (
    <ArticlesProvider>
      <Router>
        <div className="App">
          <h1>Ma Liste de Courses</h1>
          <Routes>
            <Route path="/" element={<ListeMagasins />} />
            <Route path="/magasin/:id" element={<Checklist />} />
          </Routes>
        </div>
      </Router>
    </ArticlesProvider>
  );
}

export default App;