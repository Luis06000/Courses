import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticles } from '../contexts/ArticlesContext';
import { FaClock, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';

function Checklist() {
  const [nouvelArticle, setNouvelArticle] = useState('');
  const { id: magasinId } = useParams();
  const navigate = useNavigate();
  
  const { articles, addArticle, toggleArticle, deleteArticle, toggleEnAttente, updateQuantite } = useArticles();
  
  const articlesduMagasin = articles.filter(article => 
    article.magasinId === magasinId && !article.enAttente
  );
  const articlesNonAchetes = articlesduMagasin.filter(article => !article.achete);
  const articlesAchetes = articlesduMagasin.filter(article => article.achete);

  const ajouterArticle = (e) => {
    e.preventDefault();
    if (nouvelArticle.trim()) {
      addArticle({
        nom: nouvelArticle.trim(),
        magasinId: magasinId,
        achete: false,
        enAttente: false
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
        <FaArrowLeft /> Retour
      </button>

      <form onSubmit={ajouterArticle}>
        <input
          type="text"
          value={nouvelArticle}
          onChange={(e) => setNouvelArticle(e.target.value)}
          placeholder="Ajouter un article..."
        />
        <button type="submit"><span>Ajouter</span></button>
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
            <div className="article-actions">
              <div className="quantite-controls" onClick={e => e.stopPropagation()}>
                <button 
                  onClick={() => updateQuantite(article.id, -1)}
                  className="quantite-button"
                >
                  <FaMinus />
                </button>
                <span className="quantite-display">{article.quantite}</span>
                <button 
                  onClick={() => updateQuantite(article.id, 1)}
                  className="quantite-button"
                >
                  <FaPlus />
                </button>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleEnAttente(article.id);
                }}
                className="waiting-button"
                title="Mettre en attente"
              >
                <FaClock />
              </button>
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