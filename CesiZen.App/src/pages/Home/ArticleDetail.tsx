import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, User, Clock, Share2, Heart } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { articleService, type InfoArticle } from '../../services/articleService';
import { useToast } from '../../context/ToastContext';
import styles from './Home.module.css';

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [article, setArticle] = useState<InfoArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        const data = await articleService.getById(parseInt(id));
        setArticle(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement de l'article");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!article) return;
    try {
      await articleService.toggleFavorite(article.id);
      setArticle({ ...article, isFavorite: !article.isFavorite });
      showToast(
        article.isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
        article.isFavorite ? "info" : "success"
      );
    } catch (err: any) {
      showToast(err.message || "Erreur lors de l'ajout aux favoris", "error");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Lien copié dans le presse-papier !", "success");
  };

  const calculateReadTime = (body: string) => {
    const wordsPerMinute = 200;
    const words = body.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
  };

  if (loading) {
    return (
      <DashboardLayout title="Chargement...">
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Préparation de votre lecture...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !article) {
    return (
      <DashboardLayout title="Erreur">
        <div className={styles.errorCard}>
          <p>{error || "Article non trouvé"}</p>
          <button onClick={() => navigate('/articles')} className={styles.readMoreBtn} style={{ width: 'auto', padding: '0 1.5rem' }}>
            Retour aux articles
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Bibliothèque" 
      subtitle="Prévention & Bien-être"
    >
      <div className={styles.widgets}>
        <div className={styles.detailHeader}>
          <button onClick={() => navigate('/articles')} className={styles.backButton} title="Retour">
            <ChevronLeft size={24} />
          </button>
          <h2 className={styles.detailTitle}>{article.title}</h2>
        </div>

        <article className={styles.widgetCard} style={{ background: 'white', padding: '0', overflow: 'hidden' }}>
          {article.imageUrl && article.imageUrl.trim() !== '' && !imageError && (
            <div 
              style={{ 
                height: '300px', 
                width: '100%', 
                backgroundImage: `url(${article.imageUrl})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              }} 
            />
          )}
          
          {article.imageUrl && article.imageUrl.trim() !== '' && (
            <img 
              src={article.imageUrl} 
              alt="" 
              style={{ display: 'none' }} 
              onError={() => setImageError(true)} 
            />
          )}
          
          <div style={{ padding: '2.5rem' }}>
            <header style={{ marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '2rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
                <div className={styles.metaItem}>
                  <User size={18} />
                  <span style={{ fontSize: '0.875rem' }}>{article.authorName || 'Staff CesiZen'}</span>
                </div>
                <div className={styles.metaItem}>
                  <Calendar size={18} />
                  <span style={{ fontSize: '0.875rem' }}>{new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className={styles.metaItem}>
                  <Clock size={18} />
                  <span style={{ fontSize: '0.875rem' }}>{article.readTime ? `${article.readTime} min` : calculateReadTime(article.body)} de lecture</span>
                </div>
                
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={handleToggleFavorite}
                    title={article.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"} 
                    style={{ 
                      background: article.isFavorite ? '#fee2e2' : 'none', 
                      border: '1px solid',
                      borderColor: article.isFavorite ? '#fecaca' : '#e2e8f0', 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer', 
                      color: article.isFavorite ? '#ef4444' : '#64748b',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Heart size={22} fill={article.isFavorite ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={handleShare}
                    title="Partager" 
                    style={{ 
                      background: 'none', 
                      border: '1px solid #e2e8f0', 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      cursor: 'pointer', 
                      color: '#64748b',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Share2 size={22} />
                  </button>
                </div>
              </div>
            </header>

            <div style={{ 
              fontSize: '1.125rem', 
              lineHeight: '1.9', 
              color: '#334155', 
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit'
            }}>
              {article.body}
            </div>
          </div>
        </article>

        <section className={styles.didYouKnow}>
          <div className={styles.dykIcon}>💡</div>
          <div className={styles.dykContent}>
            <h3>Avez-vous aimé cet article ?</h3>
            <p>
              Partagez-le avec vos collègues pour promouvoir le bien-être au sein de votre équipe Cesi.
            </p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ArticleDetail;
