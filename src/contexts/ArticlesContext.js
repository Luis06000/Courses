import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  onSnapshot
} from 'firebase/firestore';

const ArticlesContext = createContext();

export function ArticlesProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [favoris, setFavoris] = useState([]);

  // Charger les articles et favoris de l'utilisateur
  useEffect(() => {
    if (!auth.currentUser) return;

    // Observer pour les articles
    const articlesQuery = query(
      collection(db, 'articles'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribeArticles = onSnapshot(articlesQuery, (snapshot) => {
      const articlesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArticles(articlesData);
    });

    // Observer pour les favoris
    const favorisQuery = query(
      collection(db, 'favoris'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribeFavoris = onSnapshot(favorisQuery, (snapshot) => {
      const favorisData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFavoris(favorisData);
    });

    return () => {
      unsubscribeArticles();
      unsubscribeFavoris();
    };
  }, []);

  const addArticle = async (articleData) => {
    if (!auth.currentUser) return;

    try {
      // Vérifier si l'article existe déjà
      const articlesRef = collection(db, 'articles');
      const q = query(
        articlesRef,
        where('userId', '==', auth.currentUser.uid),
        where('magasinId', '==', articleData.magasinId),
        where('nom', '==', articleData.nom)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Mettre à jour la quantité si l'article existe
        const existingDoc = querySnapshot.docs[0];
        const newQuantite = existingDoc.data().quantite + (articleData.quantite || 1);
        await updateDoc(doc(db, 'articles', existingDoc.id), {
          quantite: newQuantite
        });
      } else {
        // Ajouter un nouvel article
        await addDoc(collection(db, 'articles'), {
          ...articleData,
          userId: auth.currentUser.uid,
          quantite: articleData.quantite || 1,
          dateCreation: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'article:', error);
    }
  };

  const ajouterAuxFavoris = async (articleData) => {
    if (!auth.currentUser) return;

    try {
      await addDoc(collection(db, 'favoris'), {
        ...articleData,
        userId: auth.currentUser.uid,
        dateCreation: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
    }
  };

  const supprimerDesFavoris = async (id) => {
    try {
      await deleteDoc(doc(db, 'favoris', id));
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
    }
  };

  const toggleArticle = async (id) => {
    try {
      const articleRef = doc(db, 'articles', id);
      const article = articles.find(a => a.id === id);
      await updateDoc(articleRef, {
        achete: !article.achete
      });
    } catch (error) {
      console.error('Erreur lors du toggle de l\'article:', error);
    }
  };

  const deleteArticle = async (id) => {
    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
    }
  };

  const toggleEnAttente = async (articleId) => {
    try {
      const articleRef = doc(db, 'articles', articleId);
      const article = articles.find(a => a.id === articleId);
      
      // Mettre à jour dans Firebase
      await updateDoc(articleRef, {
        enAttente: !article.enAttente,
        dateModification: new Date().toISOString()
      });

      // Mettre à jour le state local
      setArticles(articles.map(article => 
        article.id === articleId 
          ? { ...article, enAttente: !article.enAttente }
          : article
      ));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut en attente:", error);
    }
  };

  const updateQuantite = async (id, delta) => {
    try {
      const article = articles.find(a => a.id === id);
      const newQuantite = Math.max(1, article.quantite + delta);
      await updateDoc(doc(db, 'articles', id), {
        quantite: newQuantite
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
    }
  };

  return (
    <ArticlesContext.Provider value={{ 
      articles, 
      favoris,
      addArticle, 
      ajouterAuxFavoris,
      supprimerDesFavoris,
      toggleArticle, 
      deleteArticle,
      toggleEnAttente,
      updateQuantite
    }}>
      {children}
    </ArticlesContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles doit être utilisé dans un ArticlesProvider');
  }
  return context;
} 