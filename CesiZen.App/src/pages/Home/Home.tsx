import { motion } from 'framer-motion';
import { 
  Smile, 
  Meh, 
  Frown, 
  Moon, 
  Heart, 
  Flame, 
  BookOpen,
  Activity
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const moods = [
    { icon: Smile, label: "Heureux", color: "#eab308" },
    { icon: Meh, label: "Neutre", color: "#64748b" },
    { icon: Frown, label: "Triste", color: "#6366f1" },
    { icon: Moon, label: "Fatigué", color: "#94a3b8" },
    { icon: Heart, label: "Calme", color: "#ec4899" },
    { icon: Flame, label: "Stressé", color: "#ef4444" }
  ];

  const activities = [
    { title: "Méditation matinale", time: "08:00 - 08:15", icon: Smile, color: "#eab308" },
    { title: "Marche active", time: "12:30 - 13:00", icon: Activity, color: "#22c55e" },
    { title: "Lecture quotidienne", time: "21:00 - 21:30", icon: BookOpen, color: "#6366f1" }
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
                  <span className={styles.moodIcon} style={{ color: mood.color }}>
                    <mood.icon size={28} strokeWidth={2.5} />
                  </span>
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
                    <div className={styles.activityIcon} style={{ color: activity.color }}>
                      <activity.icon size={20} strokeWidth={2.5} />
                    </div>
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
