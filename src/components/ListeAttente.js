import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useArticles } from '../contexts/ArticlesContext';
import { FaClock, FaArrowLeft } from 'react-icons/fa';

function ListeAttente() {
  const navigate = useNavigate();
  const { articles, toggleEnAttente, deleteArticle } = useArticles();
  
  const articlesEnAttente = articles.filter(article => article.enAttente);

  return (
    <div className="checklist">
      <button className="back-button" onClick={() => navigate('/')}>
        <FaArrowLeft /> Retour
      </button>

      <div className="articles-en-attente-section">
        {articlesEnAttente.map(article => (
          <div 
            key={article.id} 
            className="article-item en-attente"
          >
            <div className="article-info">
              <span>
                {article.quantite > 1 ? `${article.quantite} × ${article.nom}` : article.nom}
              </span>
            </div>
            <div className="article-actions">
              <button 
                onClick={() => toggleEnAttente(article.id)}
                className="waiting-button active"
                title="Remettre dans la liste"
              >
                <FaClock />
              </button>
              <button 
                onClick={() => deleteArticle(article.id)}
                className="delete-button"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {articlesEnAttente.length === 0 && (
          <p className="empty-message">Aucun article en attente</p>
        )}
      </div>
    </div>
  );
}

export default ListeAttente; 