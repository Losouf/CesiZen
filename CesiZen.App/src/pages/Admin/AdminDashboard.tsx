import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Heart, FileText, ArrowRight } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { MyCard, MyStatCard, MyButton } from '../../components/my';
import { userService } from '../../services/userService';
import { emotionService } from '../../services/emotionService';
import { articleService } from '../../services/articleService';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ users: 0, emotions: 0, articles: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      userService.getAll(),
      emotionService.getAll(),
      articleService.getAll(),
    ]).then(([u, e, a]) => {
      setCounts({
        users: u.status === 'fulfilled' ? u.value.length : 0,
        emotions: e.status === 'fulfilled' ? e.value.length : 0,
        articles: a.status === 'fulfilled' ? a.value.length : 0,
      });
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout title="Administration" subtitle="Vue d'ensemble de la plateforme">
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '1.75rem' }}>
        <MyStatCard
          label="Utilisateurs"
          value={loading ? '…' : counts.users}
          icon={<Users size={22} />}
          color="#3b82f6"
        />
        <MyStatCard
          label="Émotions"
          value={loading ? '…' : counts.emotions}
          icon={<Heart size={22} />}
          color="#ec4899"
        />
        <MyStatCard
          label="Articles"
          value={loading ? '…' : counts.articles}
          icon={<FileText size={22} />}
          color="#10b981"
        />
      </div>

      <MyCard
        title="Bienvenue dans l'espace administrateur"
        subtitle="Gérez les utilisateurs, le référentiel d'émotions et les articles de prévention"
      >
        <p style={{ color: '#64748b', lineHeight: 1.6, margin: 0 }}>
          Utilisez le menu pour accéder aux différents modules. Chaque section permet de
          créer, modifier ou supprimer les contenus correspondants.
        </p>
        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          <MyButton
            variant="secondary"
            icon={<Users size={16} />}
            onClick={() => navigate('/admin/users')}
          >
            Utilisateurs
          </MyButton>
          <MyButton
            variant="secondary"
            icon={<FileText size={16} />}
            onClick={() => navigate('/admin/articles')}
          >
            Articles
          </MyButton>
          <MyButton
            variant="primary"
            icon={<ArrowRight size={16} />}
            onClick={() => navigate('/admin/emotions')}
          >
            Émotions
          </MyButton>
        </div>
      </MyCard>
    </DashboardLayout>
  );
};

export default AdminDashboard;
