import React, { createContext, useContext, useState, useEffect } from 'react';

const ArticlesContext = createContext();
const LOCAL_STORAGE_KEY = 'shopping_list_articles';
const FAVORIS_STORAGE_KEY = 'shopping_list_favoris';

export function ArticlesProvider({ children }) {
  const [articles, setArticles] = useState(() => {
    const savedArticles = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedArticles ? JSON.parse(savedArticles) : [];
  });

  const [favoris, setFavoris] = useState(() => {
    const savedFavoris = localStorage.getItem(FAVORIS_STORAGE_KEY);
    return savedFavoris ? JSON.parse(savedFavoris) : [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(FAVORIS_STORAGE_KEY, JSON.stringify(favoris));
  }, [favoris]);

  const addArticle = (articleData) => {
    // Vérifier si l'article existe déjà
    const existingArticle = articles.find(
      article => 
        article.magasinId === articleData.magasinId && 
        article.nom.toLowerCase() === articleData.nom.toLowerCase()
    );

    if (existingArticle) {
      // Si l'article existe, mettre à jour sa quantité
      setArticles(articles.map(article => 
        article.id === existingArticle.id
          ? { ...article, quantite: article.quantite + (articleData.quantite || 1) }
          : article
      ));
    } else {
      // Si l'article n'existe pas, l'ajouter avec sa quantité
      const newArticle = {
        ...articleData,
        id: Date.now().toString(),
        quantite: articleData.quantite || 1
      };
      setArticles([...articles, newArticle]);
    }
  };

  const ajouterAuxFavoris = (articleData) => {
    const { nom, categorie, magasinId } = articleData;
    const newFavori = {
      id: Date.now().toString(),
      nom,
      categorie: categorie || 'Non classé',
      magasinId
    };
    setFavoris(prevFavoris => [...prevFavoris, newFavori]);
  };

  const supprimerDesFavoris = (id) => {
    setFavoris(prevFavoris => prevFavoris.filter(favori => favori.id !== id));
  };

  const toggleArticle = (id) => {
    setArticles(prevArticles => 
      prevArticles.map(article => 
        article.id === id 
          ? { ...article, achete: !article.achete }
          : article
      )
    );
  };

  const deleteArticle = (id) => {
    setArticles(prevArticles => 
      prevArticles.filter(article => article.id !== id)
    );
  };

  const updateArticle = (id, updates) => {
    setArticles(prevArticles =>
      prevArticles.map(article =>
        article.id === id
          ? { ...article, ...updates }
          : article
      )
    );
  };

  const toggleEnAttente = (id) => {
    setArticles(articles.map(article => 
      article.id === id 
        ? { ...article, enAttente: !article.enAttente }
        : article
    ));
  };

  const updateQuantite = (id, delta) => {
    setArticles(articles.map(article => {
      if (article.id === id) {
        const newQuantite = Math.max(1, article.quantite + delta);
        return { ...article, quantite: newQuantite };
      }
      return article;
    }));
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
      updateArticle,
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