import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import styles from './Home.module.css';

const Articles: React.FC = () => {
  const articles = [
    { title: "Sommeil : 5 astuces pour mieux dormir", category: "Repos", readTime: "4 min" },
    { title: "Gérer l'anxiété avant les examens", category: "Bien-être", readTime: "6 min" },
    { title: "L'importance de la marche quotidienne", category: "Physique", readTime: "3 min" },
    { title: "Nutrition : les aliments du bonheur", category: "Santé", readTime: "5 min" }
  ];

  return (
    <DashboardLayout 
      title="Prévention & Articles" 
      subtitle="Conseils santé et bibliothèque d'informations"
    >
      <div className={styles.widgets}>
        <section className={styles.activityCard}>
          <div className={styles.widgetCard}>
            <h3 className={styles.cardTitle}>Articles à la une</h3>
            <div className={styles.activityList}>
              {articles.map((article, index) => (
                <div key={index} className={styles.activityItem}>
                  <div className={styles.activityIcon}>📚</div>
                  <div className={styles.activityInfo}>
                    <h4>{article.title}</h4>
                    <p>{article.category} • {article.readTime} de lecture</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.widgetCard} style={{ background: '#eff6ff', border: '1px solid #dbeafe' }}>
          <h3 className={styles.cardTitle} style={{ color: 'var(--primary)' }}>💡 Le saviez-vous ?</h3>
          <p style={{ fontSize: '0.9rem', color: '#1e40af', lineHeight: '1.6' }}>
            Prendre 10 minutes par jour pour respirer profondément peut réduire votre niveau de cortisol de manière significative.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Articles;
