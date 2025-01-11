import React, { createContext, useContext, useState, useEffect } from 'react';

const ArticlesContext = createContext();
const LOCAL_STORAGE_KEY = 'shopping_list_articles';

export function ArticlesProvider({ children }) {
  const [articles, setArticles] = useState(() => {
    // Charger les articles depuis le localStorage au démarrage
    const savedArticles = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedArticles ? JSON.parse(savedArticles) : [];
  });

  // Sauvegarder dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(articles));
  }, [articles]);

  const addArticle = (articleData) => {
    const newArticle = {
      ...articleData,
      id: Date.now().toString(),
      quantite: 1 // Quantité par défaut
    };
    setArticles([...articles, newArticle]);
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
        const newQuantite = Math.max(1, article.quantite + delta); // Minimum 1
        return { ...article, quantite: newQuantite };
      }
      return article;
    }));
  };

  return (
    <ArticlesContext.Provider value={{ 
      articles, 
      addArticle, 
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