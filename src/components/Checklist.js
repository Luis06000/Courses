import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArticles } from '../contexts/ArticlesContext';
import { FaClock, FaMinus, FaPlus, FaArrowLeft, FaStar } from 'react-icons/fa';
import AlertPopup from './AlertPopup';

const CATEGORIES = [
  'Frais',
  'Boissons',
  'Fruits/Légumes',
  'Bonbons',
  'Autres'
];

function Checklist() {
  const [nouvelArticle, setNouvelArticle] = useState('');
  const [categorieSelectionnee, setCategorieSelectionnee] = useState(CATEGORIES[0]);
  const { id: magasinId } = useParams();
  const navigate = useNavigate();
  
  const { articles, addArticle, toggleArticle, deleteArticle, toggleEnAttente, updateQuantite, ajouterAuxFavoris } = useArticles();
  
  const articlesduMagasin = articles.filter(article => 
    article.magasinId === magasinId && !article.enAttente
  );
  const articlesNonAchetes = articlesduMagasin.filter(article => !article.achete);
  const articlesAchetes = articlesduMagasin.filter(article => article.achete);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [filtreCategorie, setFiltreCategorie] = useState('Toutes');

  const filtrerArticles = (articles) => {
    if (filtreCategorie === 'Toutes') {
      return articles;
    }
    return articles.filter(article => article.categorie === filtreCategorie);
  };

  const articlesNonAchetesFiltres = filtrerArticles(articlesNonAchetes);
  const articlesAchetesFiltres = filtrerArticles(articlesAchetes);

  const ajouterArticle = (e) => {
    e.preventDefault();
    if (nouvelArticle.trim()) {
      const articleExistant = articles.find(
        a => a.magasinId === magasinId && 
             a.nom.toLowerCase() === nouvelArticle.toLowerCase()
      );

      if (articleExistant) {
        setAlertMessage(`"${nouvelArticle}" est déjà dans la liste`);
        setShowAlert(true);
        
        // Scroll vers l'article existant
        const element = document.getElementById(`article-${articleExistant.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlight');
          setTimeout(() => element.classList.remove('highlight'), 3000);
        }
        
        setNouvelArticle('');
        return;
      }

      addArticle({
        nom: nouvelArticle.trim(),
        magasinId: magasinId,
        achete: false,
        enAttente: false,
        categorie: categorieSelectionnee
      });
      setNouvelArticle('');
    }
  };

  const resetListe = () => {
    if (window.confirm('Voulez-vous vraiment réinitialiser la liste ?')) {
      articlesduMagasin.forEach(article => deleteArticle(article.id));
    }
  };

  const handleWaitingClick = (article, e) => {
    e.stopPropagation();
    toggleEnAttente(article.id);
  };

  return (
    <div className="checklist">
      <div className="header-buttons">
        <button className="back-button" onClick={() => navigate('/')}>
          <FaArrowLeft /> Retour
        </button>
        <button 
          className="favorites-button" 
          onClick={() => navigate(`/favoris/${magasinId}`)}
        >
          <FaStar /> Favoris
        </button>
      </div>

      <div className="filtre-categories">
        <select
          value={filtreCategorie}
          onChange={(e) => setFiltreCategorie(e.target.value)}
          className="filtre-select"
        >
          <option value="Toutes">Toutes les catégories</option>
          {CATEGORIES.map(categorie => (
            <option key={categorie} value={categorie}>
              {categorie}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={ajouterArticle}>
        <div className="form-group">
          <input
            type="text"
            value={nouvelArticle}
            onChange={(e) => setNouvelArticle(e.target.value)}
            placeholder="Ajouter un article..."
          />
          <select
            value={categorieSelectionnee}
            onChange={(e) => setCategorieSelectionnee(e.target.value)}
          >
            {CATEGORIES.map(categorie => (
              <option key={categorie} value={categorie}>
                {categorie}
              </option>
            ))}
          </select>
        </div>
        <button type="submit"><span>Ajouter</span></button>
        <button 
          type="button" 
          className="favorite-add-button"
          onClick={() => {
            if (nouvelArticle.trim()) {
              ajouterAuxFavoris({
                nom: nouvelArticle.trim(),
                categorie: categorieSelectionnee,
                magasinId: magasinId
              });
              setNouvelArticle('');
            }
          }}
        >
          <FaStar />
        </button>
      </form>

      <div className="articles-non-achetes">
        <h2>À acheter</h2>
        {filtreCategorie === 'Toutes' ? (
          CATEGORIES.map(categorie => {
            const articlesDeCategorie = articlesNonAchetes.filter(
              article => article.categorie === categorie
            );
            
            if (articlesDeCategorie.length === 0) return null;
            
            return (
              <div key={categorie} className="categorie-section">
                <h3>{categorie}</h3>
                {articlesDeCategorie.map(article => (
                  <div 
                    key={article.id}
                    id={`article-${article.id}`}
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
                        className="waiting-button"
                        onClick={(e) => handleWaitingClick(article, e)}
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
            );
          })
        ) : (
          <div className="categorie-section">
            <h3>{filtreCategorie}</h3>
            {articlesNonAchetesFiltres.map(article => (
              <div 
                key={article.id}
                id={`article-${article.id}`}
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
                    className="waiting-button"
                    onClick={(e) => handleWaitingClick(article, e)}
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
        )}
      </div>

      <div className="articles-achetes">
        <h2>Déjà acheté</h2>
        {articlesAchetesFiltres.map(article => (
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

      {showAlert && (
        <AlertPopup 
          message={alertMessage} 
          onClose={() => setShowAlert(false)} 
        />
      )}
    </div>
  );
}

export default Checklist;