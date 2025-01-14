import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/magasins');
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          
          const userDoc = doc(db, 'users', userCredential.user.uid);
          await setDoc(userDoc, {
            email: email,
            createdAt: new Date().toISOString(),
            magasins: [],
            articles: []
          });

          navigate('/magasins');
        } catch (createError) {
          if (createError.code === 'auth/email-already-in-use') {
            setError('Cette adresse email est déjà utilisée.');
          } else {
            setError('Erreur lors de la création du compte: ' + createError.message);
          }
        }
      } else if (error.code === 'auth/wrong-password') {
        setError('Mot de passe incorrect');
      } else {
        setError('Erreur de connexion: ' + error.message);
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" className="submit-button">Se connecter / S'inscrire</button>
      </form>
    </div>
  );
}

export default Login; 