import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, User, ChevronRight, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { articleService, type InfoArticle } from '../../services/articleService';
import styles from './Home.module.css';

const Articles: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<InfoArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (id: number) => {
    setImageErrors(prev => new Set(prev).add(id));
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleService.getAll();
        setArticles(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des articles');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const calculateReadTime = (body: string) => {
    const wordsPerMinute = 200;
    const words = body.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
  };

  return (
    <DashboardLayout 
      title="Prévention & Articles" 
      subtitle="Conseils santé et bibliothèque d'informations"
    >
      <div className={styles.widgets}>
        <section className={styles.activityCard}>
          <div className={styles.flexHeader}>
            <h3 className={styles.cardTitle}>Articles à la une</h3>
            <span className={styles.badge}>{articles.length} articles</span>
          </div>

          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Chargement de votre bibliothèque...</p>
            </div>
          ) : error ? (
            <div className={styles.errorCard}>
              <AlertCircle size={32} color="#ef4444" />
              <p>{error}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className={styles.emptyState}>
              <BookOpen size={64} color="#e2e8f0" />
              <p>Aucun article disponible pour le moment.</p>
            </div>
          ) : (
            <div className={styles.articlesGrid}>
              {articles.map((article) => (
                <div 
                  key={article.id} 
                  className={styles.articleItem}
                  onClick={() => navigate(`/articles/${article.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div 
                    className={styles.articleImagePlaceholder}
                    style={article.imageUrl && article.imageUrl.trim() !== '' && !imageErrors.has(article.id) 
                      ? { backgroundImage: `url(${article.imageUrl})` } 
                      : {}}
                  >
                    {( !article.imageUrl || article.imageUrl.trim() === '' || imageErrors.has(article.id) ) && <BookOpen size={40} />}
                    {article.imageUrl && article.imageUrl.trim() !== '' && (
                      <img 
                        src={article.imageUrl} 
                        alt="" 
                        style={{ display: 'none' }} 
                        onError={() => handleImageError(article.id)} 
                      />
                    )}
                  </div>
                  <div className={styles.articleCardContent}>
                    <div className={styles.articleHeader}>
                      <h4>{article.title}</h4>
                      <span className={styles.publishDate}>
                        {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className={styles.articleExcerpt}>
                      {article.body}
                    </p>
                    <div className={styles.articleFooter}>
                      <div className={styles.articleMeta}>
                        <div className={styles.metaItem}>
                          <User size={14} />
                          <span>{article.authorName || 'Staff CesiZen'}</span>
                        </div>
                        <div className={styles.metaItem}>
                          <Clock size={14} />
                          <span>{article.readTime ? `${article.readTime} min` : calculateReadTime(article.body)}</span>
                        </div>
                      </div>
                      <button className={styles.readMoreBtn} title="Lire l'article">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.didYouKnow}>
          <div className={styles.dykIcon}>💡</div>
          <div className={styles.dykContent}>
            <h3>Le saviez-vous ?</h3>
            <p>
              Prendre 10 minutes par jour pour respirer profondément peut réduire votre niveau de cortisol de manière significative et améliorer votre concentration.
            </p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Articles;
