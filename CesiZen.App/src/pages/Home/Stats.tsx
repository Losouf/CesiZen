import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import styles from './Home.module.css'; // Reuse core widget styles

const Stats: React.FC = () => {
  return (
    <DashboardLayout 
      title="Suivi & Statistiques" 
      subtitle="Visualisez votre évolution émotionnelle"
    >
      <div className={styles.widgets}>
        <section className={styles.moodSection}>
          <div className={styles.widgetCard}>
            <h3 className={styles.cardTitle}>Historique Hebdomadaire</h3>
            <div style={{ padding: '2rem 0', display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', justifyContent: 'space-around' }}>
              {[60, 80, 40, 90, 70, 50, 85].map((height, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '100%', height: `${height}%`, background: 'var(--primary)', borderRadius: '4px', opacity: 0.8 }}></div>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.grid}>
          <div className={styles.widgetCard}>
            <h3 className={styles.cardTitle}>Score de Bien-être</h3>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: '800', color: '#10b981' }}>84%</div>
              <p style={{ color: '#64748b' }}>+5% par rapport à hier</p>
            </div>
          </div>
          
          <div className={styles.widgetCard} style={{ background: 'var(--primary)', color: 'white' }}>
            <h3 className={styles.cardTitle} style={{ color: 'white' }}>Recommandation</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              Vous semblez être plus productif en début de matinée. Essayez de placer vos tâches complexes avant 10h.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Stats;
