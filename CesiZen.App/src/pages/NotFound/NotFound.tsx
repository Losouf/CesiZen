import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from '../Auth/AuthLayout.module.css';
import authStyles from '../Auth/Auth.module.css';
import localStyles from './NotFound.module.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.layout}>
      {/* Background Animated Orbs (matching AuthLayout) */}
      <div className={styles.bgAnimation}>
        <div className={`${styles.orb} ${styles.orb1}`}></div>
        <div className={`${styles.orb} ${styles.orb2}`}></div>
      </div>

      <div className={styles.header}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={authStyles.title}
        >
          Oups ! 404
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={authStyles.subtitle}
        >
          Cette page s'est volatilisée.
        </motion.p>
      </div>

      <div className={styles.card}>
        <div className={localStyles.contentWrapper}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className={localStyles.big404}
          >
            404
          </motion.div>
          
          <p className={localStyles.text}>
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          
          <div className={authStyles.animateIn} style={{ animationDelay: '0.3s', marginTop: '2rem' }}>
            <button 
              className={localStyles.primaryButton}
              onClick={() => navigate('/')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
