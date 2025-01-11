import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { useArticles } from '../contexts/ArticlesContext';

function ListeMagasins() {
  const { articles } = useArticles();
  const magasins = [
    { id: 'carrefour', nom: 'Carrefour' },
    { id: 'metro', nom: 'Metro' },
    { id: 'italie', nom: 'Italie' }
  ];
  const navigate = useNavigate();

  const isListeComplete = (magasinId) => {
    const articlesduMagasin = articles.filter(article => 
      article.magasinId === magasinId && !article.enAttente
    );
    if (articlesduMagasin.length === 0) return true;
    return articlesduMagasin.every(article => article.achete === true);
  };

  const totalArticlesEnAttente = articles.filter(article => article.enAttente).length;

  return (
    <div className="liste-magasins">
      {totalArticlesEnAttente > 0 && (
        <button 
          className="waiting-list-button"
          onClick={() => navigate('/en-attente')}
        >
          <FaClock /> Articles en attente ({totalArticlesEnAttente})
        </button>
      )}

      {magasins.map((magasin) => (
        <div 
          key={magasin.id} 
          className="magasin"
          onClick={() => navigate(`/magasin/${magasin.id}`)}
        >
          <div className="article-content">
            <span className="magasin-nom">{magasin.nom}</span>
            <div className="status-icon">
              {isListeComplete(magasin.id) ? (
                <FaCheck className="icon-check" />
              ) : (
                <FaTimes className="icon-times" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListeMagasins;