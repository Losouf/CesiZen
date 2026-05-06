import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import {
  MyAlert,
  MyButton,
  MyInput,
  MyModal,
  MyTable,
  MyTextarea,
  MyToolbar,
  type MyTableColumn,
} from '../../components/my';
import { articleService, type InfoArticle } from '../../services/articleService';
import { authService } from '../../services/authService';

interface FormState {
  id?: number;
  title: string;
  body: string;
  imageUrl: string;
  readTime: string;
}

const empty: FormState = { title: '', body: '', imageUrl: '', readTime: '' };

const AdminArticles: React.FC = () => {
  const [articles, setArticles] = useState<InfoArticle[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setArticles(await articleService.getAll());
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    authService.getCurrentUser().then(u => setCurrentUserId(u.id)).catch(() => {});
  }, []);

  const openCreate = () => {
    setForm(empty);
    setEditing(false);
    setError(null);
    setOpen(true);
  };

  const openEdit = (a: InfoArticle) => {
    setForm({
      id: a.id,
      title: a.title,
      body: a.body,
      imageUrl: a.imageUrl || '',
      readTime: a.readTime ? String(a.readTime) : '',
    });
    setEditing(true);
    setError(null);
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editing && form.id) {
        await articleService.update(form.id, {
          title: form.title,
          body: form.body,
          imageUrl: form.imageUrl || undefined,
          readTime: form.readTime ? Number(form.readTime) : undefined,
        });
      } else {
        if (!currentUserId) {
          setError('Utilisateur courant introuvable');
          return;
        }
        await articleService.create({
          title: form.title,
          body: form.body,
          authorId: currentUserId,
          imageUrl: form.imageUrl || undefined,
          readTime: form.readTime ? Number(form.readTime) : undefined,
        });
      }
      setOpen(false);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const remove = async (a: InfoArticle) => {
    if (!confirm(`Supprimer l'article "${a.title}" ?`)) return;
    try {
      await articleService.delete(a.id);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.body.toLowerCase().includes(search.toLowerCase())
  );

  const columns: MyTableColumn<InfoArticle>[] = [
    {
      key: 'title',
      header: 'Titre',
      render: a => (
        <span
          style={{
            fontWeight: 600,
            color: '#1e293b',
            display: 'block',
            maxWidth: 380,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {a.title}
        </span>
      ),
    },
    {
      key: 'author',
      header: 'Auteur',
      render: a => a.authorName || `#${a.authorId}`,
    },
    {
      key: 'readTime',
      header: 'Lecture',
      render: a => a.readTime ? `${a.readTime} min` : '—',
    },
    {
      key: 'publishedAt',
      header: 'Publié',
      render: a => new Date(a.publishedAt).toLocaleDateString('fr-FR'),
    },
  ];

  return (
    <DashboardLayout title="Articles" subtitle="Contenus de prévention publiés">
      <MyToolbar
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Rechercher un article…"
        actions={
          <MyButton variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
            Nouvel article
          </MyButton>
        }
      />

      <MyTable
        columns={columns}
        rows={filtered}
        rowKey={a => a.id}
        loading={loading}
        emptyMessage="Aucun article"
        onEdit={openEdit}
        onDelete={remove}
      />

      <MyModal
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={editing ? 'Modifier l\'article' : 'Nouvel article'}
        footer={
          <>
            <MyButton variant="ghost" onClick={() => setOpen(false)}>Annuler</MyButton>
            <MyButton variant="primary" onClick={submit}>
              {editing ? 'Enregistrer' : 'Publier'}
            </MyButton>
          </>
        }
      >
        {error && <MyAlert variant="error">{error}</MyAlert>}
        <form onSubmit={submit}>
          <MyInput
            label="Titre"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
          />
          <MyInput
            label="URL de l'image"
            type="url"
            placeholder="https://…"
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
          />
          <MyInput
            label="Temps de lecture (minutes)"
            type="number"
            min={1}
            value={form.readTime}
            onChange={e => setForm({ ...form, readTime: e.target.value })}
          />
          <MyTextarea
            label="Contenu"
            rows={10}
            value={form.body}
            onChange={e => setForm({ ...form, body: e.target.value })}
            required
            style={{ minHeight: 220 }}
          />
        </form>
      </MyModal>
    </DashboardLayout>
  );
};

export default AdminArticles;
