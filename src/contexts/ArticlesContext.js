import React, { createContext, useContext, useState } from 'react';

const ArticlesContext = createContext();

export function ArticlesProvider({ children }) {
  const [articles, setArticles] = useState([]);

  const addArticle = (article) => {
    setArticles([...articles, article]);
  };

  const toggleArticle = (id) => {
    setArticles(articles.map(article => 
      article.id === id 
        ? { ...article, achete: !article.achete }
        : article
    ));
  };

  const deleteArticle = (id) => {
    setArticles(articles.filter(article => article.id !== id));
  };

  return (
    <ArticlesContext.Provider value={{ articles, addArticle, toggleArticle, deleteArticle }}>
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