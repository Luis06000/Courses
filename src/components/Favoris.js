import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useArticles } from '../contexts/ArticlesContext';

// Définition des catégories
const CATEGORIES = [
  'Frais',
  'Boissons',
  'Fruits/Légumes',
  'Bonbons',
  'Autres'
];

function Favoris() {
  const navigate = useNavigate();
  const { magasinId } = useParams(); // Récupération du magasinId depuis l'URL
  const { favoris, addArticle, supprimerDesFavoris } = useArticles();
  const [quantites, setQuantites] = useState({});

  const updateQuantite = (articleId, delta) => {
    setQuantites(prev => ({
      ...prev,
      [articleId]: Math.max(1, (prev[articleId] || 1) + delta)
    }));
  };

  const ajouterALaListe = (article) => {
    const articleQuantite = quantites[article.id] || 1;
    
    addArticle({
      ...article,
      magasinId,
      achete: false,
      enAttente: false,
      quantite: articleQuantite
    });
    
    setQuantites(prev => ({
      ...prev,
      [article.id]: 1
    }));
  };

  return (
    <div>
      <div className="header-buttons">
        <button className="back-button" onClick={() => navigate(`/magasin/${magasinId}`)}>
          <FaArrowLeft /> Retour
        </button>
      </div>

      <h2>Articles Favoris</h2>
      
      {CATEGORIES.map(categorie => {
        const favorisDeCategorie = favoris.filter(
          article => article.categorie === categorie && article.magasinId === magasinId
        );
        
        if (favorisDeCategorie.length === 0) return null;
        
        return (
          <div key={categorie} className="categorie-section">
            <h3>{categorie}</h3>
            {favorisDeCategorie.map(article => (
              <div key={article.id} className="article-item">
                <div className="article-info">
                  <span>{article.nom}</span>
                  <div className="article-actions">
                    <div className="quantite-controls">
                      <button
                        className="quantite-button"
                        onClick={() => updateQuantite(article.id, -1)}
                      >
                        <FaMinus />
                      </button>
                      <span className="quantite-display">
                        {quantites[article.id] || 1}
                      </span>
                      <button
                        className="quantite-button"
                        onClick={() => updateQuantite(article.id, 1)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <button 
                      className="add-to-list-button"
                      onClick={() => ajouterALaListe(article)}
                    >
                      <FaPlus />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => supprimerDesFavoris(article.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
      
      {favoris.filter(f => f.magasinId === magasinId).length === 0 && (
        <div className="empty-message">
          Aucun favori pour ce magasin
        </div>
      )}
    </div>
  );
}

export default Favoris; 