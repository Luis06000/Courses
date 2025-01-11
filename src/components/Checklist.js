import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where,
  updateDoc,
  doc,
  deleteDoc 
} from 'firebase/firestore';

function Checklist() {
  const [articles, setArticles] = useState([]);
  const [nouvelArticle, setNouvelArticle] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    const articlesRef = collection(db, 'articles');
    const q = query(articlesRef, where('magasinId', '==', id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const articlesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setArticles(articlesData);
    });

    return () => unsubscribe();
  }, [id]);

  const ajouterArticle = async (e) => {
    e.preventDefault();
    if (nouvelArticle.trim()) {
      try {
        await addDoc(collection(db, 'articles'), {
          nom: nouvelArticle.trim(),
          magasinId: id,
          achete: false,
          createdAt: new Date().toISOString()
        });
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'article:", error);
      }
    }
    setNouvelArticle('');
  };

  const toggleArticle = async (articleId, achete) => {
    try {
      const articleRef = doc(db, 'articles', articleId);
      await updateDoc(articleRef, {
        achete: !achete
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'article:", error);
    }
  };

  const resetListe = async () => {
    try {
      const promises = articles.map(article => 
        deleteDoc(doc(db, 'articles', article.id))
      );
      await Promise.all(promises);
    } catch (error) {
      console.error("Erreur lors de la réinitialisation de la liste:", error);
    }
  };

  const articlesNonAchetes = articles.filter(article => !article.achete);
  const articlesAchetes = articles.filter(article => article.achete);

  const startEditing = (article) => {
    setEditingId(article.id);
    setEditingName(article.nom);
  };

  const updateArticle = async (id, e) => {
    e?.preventDefault();
    if (editingName.trim()) {
      try {
        const articleRef = doc(db, 'articles', id);
        await updateDoc(articleRef, {
          nom: editingName.trim()
        });
      } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
      } finally {
        setEditingId(null);
        setEditingName('');
      }
    }
  };

  const deleteArticle = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet article ?')) {
      try {
        await deleteDoc(doc(db, 'articles', id));
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const renderArticle = (article) => (
    <div 
      key={article.id} 
      className="article-item"
      onClick={() => toggleArticle(article.id, article.achete)}
    >
      {editingId === article.id ? (
        <>
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && updateArticle(article.id, e)}
          />
          <div className="edit-buttons">
            <button onClick={(e) => updateArticle(article.id, e)}>Sauvegarder</button>
            <button onClick={() => setEditingId(null)}>Annuler</button>
          </div>
        </>
      ) : (
        <>
          <span>{article.nom}</span>
          <div className="edit-buttons">
            <button 
              className="edit-button" 
              onClick={(e) => {
                e.stopPropagation();
                startEditing(article);
              }}
            >
              Éditer
            </button>
            <button 
              className="delete-button" 
              onClick={(e) => {
                e.stopPropagation();
                deleteArticle(article.id);
              }}
            >
              Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="checklist">
      <button className="back-button" onClick={() => navigate('/')}>
        Retour aux magasins
      </button>

      <form onSubmit={ajouterArticle}>
        <input
          type="text"
          value={nouvelArticle}
          onChange={(e) => setNouvelArticle(e.target.value)}
          placeholder="Nouvel article"
        />
        <button type="submit">Ajouter</button>
      </form>

      <h2>Articles à acheter ({articlesNonAchetes.length})</h2>
      <div className="articles-non-achetes">
        {articlesNonAchetes.map(renderArticle)}
      </div>

      <h2>Articles achetés ({articlesAchetes.length})</h2>
      <div className="articles-achetes">
        {articlesAchetes.map(renderArticle)}
      </div>

      <button className="reset-button" onClick={resetListe}>
        Réinitialiser la liste
      </button>
    </div>
  );
}

export default Checklist;