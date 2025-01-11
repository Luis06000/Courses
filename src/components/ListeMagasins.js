import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
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
    const articlesduMagasin = articles.filter(article => article.magasinId === magasinId);
    if (articlesduMagasin.length === 0) return true;
    return articlesduMagasin.every(article => article.achete === true);
  };

  const handleMagasinClick = (id) => {
    navigate(`/magasin/${id}`);
  };

  return (
    <div className="liste-magasins">
      {magasins.map((magasin) => (
        <div 
          key={magasin.id} 
          className="magasin"
          onClick={() => handleMagasinClick(magasin.id)}
        >
          <div className="article-content">
            <span>{magasin.nom}</span>
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