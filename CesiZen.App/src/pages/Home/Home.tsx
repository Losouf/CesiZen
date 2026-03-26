import React from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const moods = [
    { icon: "😊", label: "Heureux" },
    { icon: "😐", label: "Neutre" },
    { icon: "😔", label: "Triste" },
    { icon: "😫", label: "Fatigué" },
    { icon: "🧘", label: "Calme" },
    { icon: "🔥", label: "Stressé" }
  ];

  const activities = [
    { title: "Méditation matinale", time: "08:00 - 08:15", type: "mental" },
    { title: "Marche active", time: "12:30 - 13:00", type: "physical" },
    { title: "Lecture quotidienne", time: "21:00 - 21:30", type: "leisure" }
  ];

  return (
    <DashboardLayout 
      showGreeting={true} 
      subtitle="Prêt pour une nouvelle séance de bien-être ?"
    >
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
              <h3 className={styles.cardTitle}>Activités suggérées</h3>
              <div className={styles.activityList}>
                {activities.map((activity, index) => (
                  <div key={index} className={styles.activityItem}>
                    <div className={styles.activityIcon}>✨</div>
                    <div className={styles.activityInfo}>
                      <h4>{activity.title}</h4>
                      <p>{activity.time}</p>
                    </div>
                  </div>
                ))}
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
    </DashboardLayout>
  );
};

export default Home;
