import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useDragControls, animate } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dragControls = useDragControls();
  const drawerProgress = useMotionValue(1); // 1 = closed, 0 = open

  useEffect(() => {
    // Animate the progress value smoothly
    animate(drawerProgress, isMenuOpen ? 0 : 1, {
      type: 'spring',
      stiffness: 400,
      damping: 40,
      restDelta: 0.001
    });
  }, [isMenuOpen, drawerProgress]);

  useEffect(() => {
    // Save original background and set for dashboard
    const originalBg = document.body.style.background;
    document.body.style.background = '#f8fafc';
    document.body.style.color = '#1e293b';
    
    return () => {
      // Restore original when leaving
      document.body.style.background = originalBg;
      document.body.style.color = '';
    };
  }, []);
  // In a real app, we would get this from context/authService
  const username = "Livio"; 

  const moods = [
    { icon: "😊", label: "Heureux" },
    { icon: "😌", label: "Calme" },
    { icon: "🧐", label: "Concentré" },
    { icon: "😴", label: "Fatigué" },
    { icon: "🤯", label: "Stressé" }
  ];

  return (
    <div className={styles.layout}>
      {/* Background Animated Orbs (like AuthLayout) */}
      <div className={styles.bgAnimation}>
        <div className={`${styles.orb} ${styles.orb1}`}></div>
        <div className={`${styles.orb} ${styles.orb2}`}></div>
      </div>

      <Header 
        onMenuToggle={() => {
          console.log('Menu Toggle Clicked', !isMenuOpen);
          setIsMenuOpen(!isMenuOpen);
        }} 
        drawerProgress={drawerProgress}
        greeting={`Bon retour, ${username} 👋`}
        subtitle="Prêt pour une nouvelle séance de bien-être ?"
      />
      <Sidebar 
        onClose={() => setIsMenuOpen(false)}
        dragControls={dragControls}
        progress={drawerProgress}
      />

      <main className={styles.cardContent}>
        <div className={styles.widgets}>
          <section className={styles.moodSection}>
            <div className={styles.widgetCard}>
              <h3 className={styles.cardTitle}>Comment vous sentez-vous ?</h3>
              <div className={styles.moodContainer}>
                {moods.map((mood, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={styles.moodItem}
                  >
                    <span className={styles.moodIcon}>{mood.icon}</span>
                    <span className={styles.moodLabel}>{mood.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <div className={styles.grid}>
            <section className={styles.activityCard}>
              <div className={styles.widgetCard}>
                <h3 className={styles.cardTitle}>Dernières entrées du journal</h3>
                <div className={styles.activityList}>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>📝</div>
                    <div className={styles.activityInfo}>
                      <h4>Réflexion après les cours</h4>
                      <p>Hier à 18:45 • Calme</p>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <div className={styles.activityIcon}>📝</div>
                    <div className={styles.activityInfo}>
                      <h4>Préparation des examens</h4>
                      <p>24 mars • Stressé</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.statsCard}>
              <div className={styles.widgetCard}>
                <h3 className={styles.cardTitle}>Statistiques</h3>
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>12</div>
                  <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Jours consécutifs</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
