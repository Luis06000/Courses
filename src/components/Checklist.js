import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticles } from '../contexts/ArticlesContext';

function Checklist() {
  const [nouvelArticle, setNouvelArticle] = useState('');
  const { id: magasinId } = useParams();
  const navigate = useNavigate();
  
  const { articles, addArticle, toggleArticle, deleteArticle } = useArticles();
  
  const articlesduMagasin = articles.filter(article => article.magasinId === magasinId);
  const articlesNonAchetes = articlesduMagasin.filter(article => !article.achete);
  const articlesAchetes = articlesduMagasin.filter(article => article.achete);

  const ajouterArticle = (e) => {
    e.preventDefault();
    if (nouvelArticle.trim()) {
      addArticle({
        nom: nouvelArticle.trim(),
        magasinId: magasinId,
        achete: false
      });
      setNouvelArticle('');
    }
  };

  const resetListe = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser la liste ?')) {
      articlesduMagasin.forEach(article => deleteArticle(article.id));
    }
  };

  return (
    <div className="checklist">
      <button className="back-button" onClick={() => navigate('/')}>
        Retour
      </button>

      <form onSubmit={ajouterArticle}>
        <input
          type="text"
          value={nouvelArticle}
          onChange={(e) => setNouvelArticle(e.target.value)}
          placeholder="Ajouter un article..."
        />
        <button type="submit">Ajouter</button>
      </form>

      <div className="articles-non-achetes">
        <h2>À acheter</h2>
        {articlesNonAchetes.map(article => (
          <div 
            key={article.id} 
            className="article-item"
            onClick={() => toggleArticle(article.id)}
          >
            <span>{article.nom}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                deleteArticle(article.id);
              }}
              className="delete-button"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="articles-achetes">
        <h2>Déjà acheté</h2>
        {articlesAchetes.map(article => (
          <div 
            key={article.id} 
            className="article-item"
            onClick={() => toggleArticle(article.id)}
          >
            <span>{article.nom}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                deleteArticle(article.id);
              }}
              className="delete-button"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {articlesduMagasin.length > 0 && (
        <button className="reset-button" onClick={resetListe}>
          Réinitialiser la liste
        </button>
      )}
    </div>
  );
}

export default Checklist;