import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, HelpCircle, FileText } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import styles from './Profile.module.css';

const ProfileHelp: React.FC = () => {
  const navigate = useNavigate();

  const faqs = [
    { q: "Comment mes données sont-elles sécurisées ?", a: "Toutes vos données sont chiffrées et stockées sur nos serveurs sécurisés." },
    { q: "Comment réinitialiser mon mot de passe ?", a: "Vous pouvez le faire via la page de connexion, lien 'Mot de passe oublié'." },
    { q: "Puis-je supprimer mon compte ?", a: "Oui, contactez le support et nous traiterons votre demande sous 24h." }
  ];

  return (
    <DashboardLayout title="Aide & Support">
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <button className={styles.backButton} onClick={() => navigate('/profile')}>
            <ArrowLeft size={24} />
          </button>
          <h3>Besoin d'aide ?</h3>
        </div>

        <div className={styles.supportActions}>
          <div className={styles.supportCard}>
            <MessageCircle size={32} color="var(--primary)" />
            <h4>Contacter le support</h4>
            <p>Disponible 24/7 pour vous aider.</p>
          </div>
          <div className={styles.supportCard}>
            <FileText size={32} color="var(--secondary)" />
            <h4>Documentation</h4>
            <p>Guide complet de l'application.</p>
          </div>
        </div>

        <div className={styles.faqSection}>
          <h4>Questions fréquentes</h4>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <HelpCircle size={18} className={styles.faqIcon} />
              <div>
                <h5>{faq.q}</h5>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileHelp;
