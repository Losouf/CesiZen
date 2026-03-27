import React, { useState, useEffect, useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { 
  Smile, 
  Frown, 
  Moon, 
  Flame, 
  Zap, 
  Ghost, 
  HelpCircle,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { journalService, type JournalEntry } from '../../services/journalService';
import { emotionService, type Emotion } from '../../services/emotionService';
import styles from './Stats.module.css';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.05 ? (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: '12px', fontWeight: 800 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

const Stats: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [journalData, emotionData] = await Promise.all([
          journalService.getAll(),
          emotionService.getAll()
        ]);
        setEntries(journalData);
        setEmotions(emotionData);
      } catch (err) {
        console.error("Failed to fetch stats data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Process data for charts
  const stats = useMemo(() => {
    if (entries.length === 0) return { pieData: [], trendData: [], topEmotion: null };

    // Filter by time range
    const now = new Date();
    const rangeDays = timeRange === 'weekly' ? 7 : 30;
    const filteredEntries = entries.filter(entry => {
      const entryDate = new Date(entry.loggedAt);
      const diffTime = Math.abs(now.getTime() - entryDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= rangeDays;
    });

    // Pie chart: Emotion distribution (Grouped by Base Emotion)
    const emotionCounts: Record<string, { count: number, color: string, label: string }> = {};
    
    filteredEntries.forEach(entry => {
      // Find the base emotion for this entry
      const emotion = emotions.find(e => e.id === entry.emotionId);
      if (!emotion) return;
      
      const baseEmotion = emotion.parentId 
        ? emotions.find(e => e.id === emotion.parentId) 
        : emotion;
        
      if (!baseEmotion) return;
      
      if (!emotionCounts[baseEmotion.label]) {
        emotionCounts[baseEmotion.label] = { 
          count: 0, 
          color: baseEmotion.color || 'var(--primary)',
          label: baseEmotion.label
        };
      }
      emotionCounts[baseEmotion.label].count++;
    });

    const pieData = Object.values(emotionCounts).map(ec => ({
      name: ec.label,
      value: ec.count,
      color: ec.color
    })).sort((a, b) => b.value - a.value);

    // Trend data: Mood over last 7/30 days
    const emotionScores: Record<string, number> = {
      'joie': 9,
      'surprise': 7,
      'colère': 3,
      'colere': 3,
      'sadness': 2,
      'peur': 4,
      'dégoût': 3,
      'degout': 3,
      'tristesse': 2
    };

    const days = Array.from({ length: rangeDays }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (rangeDays - 1 - i));
      return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
    });

    const trendData = days.map((dayLabel, i) => {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - (rangeDays - 1 - i));
      const targetYear = targetDate.getFullYear();
      const targetMonth = targetDate.getMonth();
      const targetDay = targetDate.getDate();
      
      const dayEntries = filteredEntries.filter(e => {
        const d = new Date(e.loggedAt);
        return d.getFullYear() === targetYear && 
               d.getMonth() === targetMonth && 
               d.getDate() === targetDay;
      });
      
      let avgScore = 0;
      if (dayEntries.length > 0) {
        const scores = dayEntries.map(e => {
          const emotion = emotions.find(em => em.id === e.emotionId);
          const base = emotion?.parentId ? emotions.find(em => em.id === emotion.parentId) : emotion;
          const label = (base?.label || '').toLowerCase();
          return emotionScores[label] || 5;
        });
        avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      }

      return {
        name: dayLabel,
        score: avgScore > 0 ? avgScore : null
      };
    });

    const topEmotion = pieData[0] || null;

    return { pieData, trendData, topEmotion, filteredEntries };
  }, [entries, emotions, timeRange]);

  const filteredEntries = stats.filteredEntries || [];

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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <DashboardLayout title="Suivi & Statistiques">
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Analyse de vos données...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Suivi & Statistiques" 
      subtitle="Observez votre paysage émotionnel"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={styles.widgets}
      >
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Vue d'ensemble</h2>
          <div className={styles.rangeSelector}>
            <button 
              className={`${styles.rangeBtn} ${timeRange === 'weekly' ? styles.rangeBtnActive : ''}`}
              onClick={() => setTimeRange('weekly')}
            >
              7 jours
            </button>
            <button 
              className={`${styles.rangeBtn} ${timeRange === 'monthly' ? styles.rangeBtnActive : ''}`}
              onClick={() => setTimeRange('monthly')}
            >
              30 jours
            </button>
          </div>
        </div>

        <div className={styles.statsGrid}>
          {/* Pie Chart Card */}
          <section className={styles.widgetCard}>
            <h3 className={styles.cardTitle}>Répartition des émotions</h3>
            <div className={styles.chartContainer}>
              {stats.pieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        style={{ cursor: 'pointer', outline: 'none' }}
                      >
                        {stats.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className={styles.chartCenter}>
                    <span className={styles.totalCount}>{filteredEntries.length}</span>
                    <span className={styles.totalLabel}>Entrées</span>
                  </div>
                </>
              ) : (
                <p className={styles.emptyHint}>Aucune donnée pour cette période.</p>
              )}
            </div>
            
            <div className={styles.legend}>
              {stats.pieData.map((data, i) => (
                <div key={i} className={styles.legendItem}>
                  <div className={styles.dot} style={{ backgroundColor: data.color }} />
                  <div className={styles.legendInfo}>
                    <span className={styles.legendLabel}>{data.name}</span>
                    <span className={styles.legendPercent}>
                      {((data.value / filteredEntries.length) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Trend Chart Card */}
          <section className={styles.widgetCard}>
            <h3 className={styles.cardTitle}>Évolution du bien-être</h3>
            <div className={styles.chartContainer} style={{ paddingTop: '2rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.trendData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }} 
                  />
                  <YAxis hide domain={[0, 10]} />
                  <RechartsTooltip />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="var(--primary)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    connectNulls
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Tendance actuelle</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {stats.topEmotion 
                      ? `La "${stats.topEmotion.name}" est votre émotion dominante.` 
                      : "Pas encore assez de données pour conclure."}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* History List */}
        <section className={styles.widgetCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Historique récent</h3>
          </div>
          <div className={styles.historyList}>
            {filteredEntries.length === 0 ? (
              <p className={styles.emptyHint}>Aucune entrée pour le moment.</p>
            ) : (
              filteredEntries.slice(0, 5).map((entry) => {
                const emotion = emotions.find(e => e.id === entry.emotionId);
                const base = emotion?.parentId ? emotions.find(e => e.id === emotion.parentId) : emotion;
                const Icon = getEmotionIcon(base?.label || '');
                return (
                  <div key={entry.id} className={styles.historyItem}>
                    <div className={styles.historyIcon} style={{ color: base?.color || 'var(--primary)' }}>
                      <Icon size={24} strokeWidth={2.5} />
                    </div>
                    <div className={styles.historyInfo}>
                      <h4>{emotion?.label || "Sans titre"}</h4>
                      <p>{entry.content.split(': ')[1] || entry.content}</p>
                    </div>
                    <div className={styles.historyDate}>
                      {formatDate(entry.loggedAt)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </motion.div>
    </DashboardLayout>
  );
};

export default Stats;
