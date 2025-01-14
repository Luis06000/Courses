import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListeMagasins from './components/ListeMagasins';
import Checklist from './components/Checklist';
import ListeAttente from './components/ListeAttente';
import Favoris from './components/Favoris';
import Login from './components/Login';
import './App.css';
import { ArticlesProvider } from './contexts/ArticlesContext';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <ArticlesProvider>
      <Router basename={process.env.PUBLIC_URL}>
        <div className="App">
          <h1>Mes courses</h1>
          <Routes>
            <Route path="/" element={!user ? <Login /> : <ListeMagasins />} />
            <Route path="/magasins" element={user ? <ListeMagasins /> : <Login />} />
            <Route path="/magasin/:id" element={user ? <Checklist /> : <Login />} />
            <Route path="/en-attente" element={user ? <ListeAttente /> : <Login />} />
            <Route path="/favoris/:magasinId" element={user ? <Favoris /> : <Login />} />
          </Routes>
        </div>
      </Router>
    </ArticlesProvider>
  );
}

export default App;