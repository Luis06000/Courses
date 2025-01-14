import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { useArticles } from '../contexts/ArticlesContext';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

function ListeMagasins() {
  const { articles } = useArticles();
  const [magasins, setMagasins] = useState([]);
  const [nouveauMagasin, setNouveauMagasin] = useState('');
  const navigate = useNavigate();

  // Charger les magasins de l'utilisateur
  useEffect(() => {
    const chargerMagasins = async () => {
      if (!auth.currentUser) return;
      
      const magasinsRef = collection(db, 'magasins');
      const q = query(magasinsRef, where("userId", "==", auth.currentUser.uid));
      
      try {
        const querySnapshot = await getDocs(q);
        const magasinsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMagasins(magasinsData);
      } catch (error) {
        console.error("Erreur lors du chargement des magasins:", error);
      }
    };

    chargerMagasins();
  }, []);

  const ajouterMagasin = async (e) => {
    e.preventDefault();
    if (!nouveauMagasin.trim()) return;

    try {
      const magasinsRef = collection(db, 'magasins');
      const docRef = await addDoc(magasinsRef, {
        nom: nouveauMagasin.trim(),
        userId: auth.currentUser.uid,
        dateCreation: new Date().toISOString()
      });

      setMagasins([...magasins, {
        id: docRef.id,
        nom: nouveauMagasin.trim(),
        userId: auth.currentUser.uid
      }]);
      
      setNouveauMagasin('');
    } catch (error) {
      console.error("Erreur lors de l'ajout du magasin:", error);
    }
  };

  const supprimerMagasin = async (magasinId, e) => {
    e.stopPropagation();
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce magasin ? Tous les articles et favoris associés seront également supprimés.")) {
      try {
        // 1. Supprimer les articles liés au magasin
        const articlesRef = collection(db, 'articles');
        const articlesQuery = query(
          articlesRef,
          where("magasinId", "==", magasinId),
          where("userId", "==", auth.currentUser.uid)
        );
        const articlesSnapshot = await getDocs(articlesQuery);
        const articlesDeletions = articlesSnapshot.docs.map(doc => 
          deleteDoc(doc.ref)
        );

        // 2. Supprimer les favoris liés au magasin
        const favorisRef = collection(db, 'favoris');
        const favorisQuery = query(
          favorisRef,
          where("magasinId", "==", magasinId),
          where("userId", "==", auth.currentUser.uid)
        );
        const favorisSnapshot = await getDocs(favorisQuery);
        const favorisDeletions = favorisSnapshot.docs.map(doc => 
          deleteDoc(doc.ref)
        );

        // 3. Supprimer le magasin
        const magasinRef = doc(db, 'magasins', magasinId);

        // Exécuter toutes les suppressions en parallèle
        await Promise.all([
          ...articlesDeletions,
          ...favorisDeletions,
          deleteDoc(magasinRef)
        ]);

        // Mettre à jour l'état local
        setMagasins(magasins.filter(m => m.id !== magasinId));

      } catch (error) {
        console.error("Erreur lors de la suppression du magasin et de ses données:", error);
        alert("Une erreur est survenue lors de la suppression");
      }
    }
  };

  const isListeComplete = (magasinId) => {
    const articlesduMagasin = articles.filter(article => 
      article.magasinId === magasinId && !article.enAttente
    );
    if (articlesduMagasin.length === 0) return true;
    return articlesduMagasin.every(article => article.achete === true);
  };

  const totalArticlesEnAttente = articles.filter(article => article.enAttente).length;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="liste-magasins">
      <div className="header-container">
        <h2>Liste des Magasins</h2>
        <button onClick={handleLogout} className="logout-button">
          Déconnexion
        </button>
      </div>

      <form onSubmit={ajouterMagasin} className="magasin-form">
        <div className="input-container">
          <input
            type="text"
            value={nouveauMagasin}
            onChange={(e) => setNouveauMagasin(e.target.value)}
            placeholder="Nom du nouveau magasin"
            required
          />
          <button type="submit"><span>Ajouter</span></button>
        </div>
      </form>

      {totalArticlesEnAttente > 0 && (
        <button 
          className="waiting-list-button"
          onClick={() => navigate('/en-attente')}
        >
          <FaClock /> Articles en attente ({totalArticlesEnAttente})
        </button>
      )}

      {magasins.length === 0 ? (
        <p className="empty-message">Aucun magasin ajouté</p>
      ) : (
        magasins.map((magasin) => (
          <div 
            key={magasin.id} 
            className="magasin"
            onClick={() => navigate(`/magasin/${magasin.id}`)}
          >
            <div className="article-content">
              <span className="magasin-nom">{magasin.nom}</span>
              <div className="magasin-actions">
                <div className="status-icon">
                  {isListeComplete(magasin.id) ? (
                    <FaCheck className="icon-check" />
                  ) : (
                    <FaTimes className="icon-times" />
                  )}
                </div>
                <button 
                  className="delete-button"
                  onClick={(e) => supprimerMagasin(magasin.id, e)}
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ListeMagasins;