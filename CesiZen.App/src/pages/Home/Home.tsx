import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Smile, 
  Frown, 
  Moon, 
  Flame,
  BookOpen,
  ChevronLeft,
  CheckCircle,
  Zap,
  Ghost,
  HelpCircle
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { emotionService, type Emotion } from '../../services/emotionService';
import { journalService } from '../../services/journalService';
import { articleService, type InfoArticle } from '../../services/articleService';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [recentArticles, setRecentArticles] = useState<InfoArticle[]>([]);
  
  const [step, setStep] = useState(1); 
  const [selectedBase, setSelectedBase] = useState<Emotion | null>(null);
  
  // local loading for saving
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [emotionsData, articlesData] = await Promise.all([
          emotionService.getAll(),
          articleService.getAll()
        ]);
        setEmotions(emotionsData);
        setRecentArticles(articlesData.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const baseEmotions = emotions.filter(e => !e.parentId);
  const nuances = emotions.filter(e => e.parentId === selectedBase?.id);

  const handleBaseSelect = (emotion: Emotion) => {
    setSelectedBase(emotion);
    setStep(2);
  };

  const handleNuanceSelect = (nuance: Emotion) => {
    handleSave(nuance);
  };

  const handleSave = async (nuanceToSave: Emotion) => {
    if (!nuanceToSave) return;
    setIsSaving(true);
    try {
      await journalService.create({
        content: `Météo intérieure: ${selectedBase?.label} - ${nuanceToSave.label}`,
        userId: 0, // Backend will set this from token
        emotionId: nuanceToSave.id
      });
      setStep(4);
      setTimeout(() => {
        setStep(1);
        setSelectedBase(null);
      }, 3000);
    } catch (err) {
      console.error("Failed to save journal entry", err);
    } finally {
      setIsSaving(false);
    }
  };

  const getEmotionIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('joie')) return Smile;
    if (l.includes('tristesse')) return Frown;
    if (l.includes('colère') || l.includes('colere')) return Flame;
    if (l.includes('peur')) return Ghost;
    if (l.includes('surprise')) return Zap;
    if (l.includes('dégoût') || l.includes('degout')) return Moon;
    return HelpCircle;
  };

  if (loading) {
    return (
      <DashboardLayout showGreeting={true} subtitle="Chargement de vos données...">
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      showGreeting={true} 
      subtitle="Prêt pour votre météo intérieure ?"
    >
      <div className={styles.widgets}>
        {/* Météo Intérieur Section */}
        <section className={styles.weatherSection}>
          <div className={styles.widgetCard}>
            <div className={styles.weatherHeader}>
              <h3 className={styles.cardTitle}>Ma météo intérieure</h3>
              {step > 1 && step < 4 && (
                <button 
                  className={styles.backButtonMini} 
                  onClick={() => setStep(step - 1)}
                >
                  <ChevronLeft size={18} />
                </button>
              )}
            </div>

            <div className={styles.weatherContent}>
              {isSaving ? (
                <div className={styles.loadingContainer} style={{ minHeight: '200px' }}>
                  <div className={styles.spinner}></div>
                  <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Mise à jour de votre météo...</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={styles.stepContainer}
                  >
                    <p className={styles.stepHint}>Quelle est votre émotion dominante ?</p>
                    {baseEmotions.length === 0 ? (
                      <p className={styles.emptyHint}>Aucune émotion configurée dans l'API.</p>
                    ) : (
                      <div className={styles.emotionGrid}>
                        {baseEmotions.map((emotion) => {
                          const Icon = getEmotionIcon(emotion.label);
                          return (
                            <motion.div 
                              key={emotion.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={styles.emotionItem}
                              onClick={() => handleBaseSelect(emotion)}
                            >
                              <span className={styles.emotionIcon} style={{ color: emotion.color || 'var(--primary)' }}>
                                <Icon size={32} strokeWidth={2.5} />
                              </span>
                              <span className={styles.emotionLabel}>{emotion.label}</span>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 2 && selectedBase && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={styles.stepContainer}
                  >
                    <p className={styles.stepHint}>Soyons plus précis :</p>
                    <div className={styles.nuanceGrid}>
                      {nuances.map((nuance) => (
                        <motion.button
                          key={nuance.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={styles.nuanceButton}
                          onClick={() => handleNuanceSelect(nuance)}
                          style={{ borderColor: selectedBase.color || 'var(--primary)' }}
                        >
                          {nuance.label}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={styles.successContainer}
                  >
                    <div className={styles.successIcon}>
                      <CheckCircle size={64} color="#10b981" />
                    </div>
                    <h3>C'est enregistré !</h3>
                    <p>Votre météo a été ajoutée à votre journal.</p>
                  </motion.div>
                )}
              </AnimatePresence>
              )}
            </div>
          </div>
        </section>

        <div className={styles.grid}>
          {/* Activities Section */}
          <section className={styles.activityCard}>
            <div className={styles.widgetCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Articles recommandés</h3>
                <button 
                  className={styles.viewAllLink}
                  onClick={() => navigate('/articles')}
                >
                  Voir tout
                </button>
              </div>
              <div className={styles.activityList}>
                {recentArticles.length === 0 ? (
                  <p className={styles.emptyHint}>Aucun article disponible.</p>
                ) : (
                  recentArticles.map((article) => (
                    <div 
                      key={article.id} 
                      className={styles.activityItem}
                      onClick={() => navigate(`/articles/${article.id}`)}
                    >
                      <div className={styles.activityIcon} style={{ color: 'var(--primary)' }}>
                        <BookOpen size={20} strokeWidth={2.5} />
                      </div>
                      <div className={styles.activityInfo}>
                        <h4 className={styles.truncate}>{article.title}</h4>
                        <p>{article.readTime || 5} min de lecture</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className={styles.statsCard}>
            <div className={styles.premiumStreakCard}>
              <h3 className={styles.cardTitle}>Série Zen</h3>
              <div className={styles.streakContainer}>
                <div className={styles.streakVisual}>
                  <svg className={styles.progressRing} width="140" height="140">
                    <circle
                      className={styles.progressRingCircleBg}
                      stroke="#eff6ff"
                      strokeWidth="8"
                      fill="transparent"
                      r="60"
                      cx="70"
                      cy="70"
                    />
                    <circle
                      className={styles.progressRingCircle}
                      stroke="url(#streakGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      fill="transparent"
                      r="60"
                      cx="70"
                      cy="70"
                      style={{ strokeDasharray: '377', strokeDashoffset: '100' }}
                    />
                    <defs>
                      <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  <div className={styles.streakOverlay}>
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                      className={styles.streakGlow} 
                    />
                    <div className={styles.streakContent}>
                      <Flame className={styles.flameIcon} size={28} strokeWidth={2.5} />
                      <span className={styles.streakValue}>12</span>
                      <span className={styles.streakLabel}>Jours</span>
                    </div>
                  </div>
                </div>
                <p className={styles.statsHint}>Vous êtes sur la bonne voie ! 🔥</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
