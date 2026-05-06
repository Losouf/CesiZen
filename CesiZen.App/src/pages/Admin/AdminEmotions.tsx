import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import {
  MyAlert,
  MyBadge,
  MyButton,
  MyColorInput,
  MyDropdown,
  MyInput,
  MyModal,
  MyTable,
  MyToolbar,
  type MyTableColumn,
} from '../../components/my';
import { emotionService, type Emotion } from '../../services/emotionService';

interface FormState {
  id?: number;
  label: string;
  color: string;
  parentId: string;
}

const empty: FormState = { label: '', color: '#3b82f6', parentId: '' };

const AdminEmotions: React.FC = () => {
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      setEmotions(await emotionService.getAll());
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const primaries = emotions.filter(e => !e.parentId);

  const openCreate = () => {
    setForm(empty);
    setEditing(false);
    setError(null);
    setOpen(true);
  };

  const openEdit = (e: Emotion) => {
    setForm({
      id: e.id,
      label: e.label,
      color: e.color || '#3b82f6',
      parentId: e.parentId ? String(e.parentId) : '',
    });
    setEditing(true);
    setError(null);
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        label: form.label,
        color: form.color,
        parentId: form.parentId ? Number(form.parentId) : undefined,
      };
      if (editing && form.id) {
        await emotionService.update(form.id, payload);
      } else {
        await emotionService.create(payload);
      }
      setOpen(false);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const remove = async (e: Emotion) => {
    if (!confirm(`Supprimer l'émotion "${e.label}" ?`)) return;
    try {
      await emotionService.delete(e.id);
      load();
    } catch (er: any) {
      alert(er.message);
    }
  };

  const filtered = emotions.filter(e =>
    e.label.toLowerCase().includes(search.toLowerCase())
  );

  const parentLabel = (id?: number) =>
    id ? (emotions.find(e => e.id === id)?.label ?? '—') : '—';

  const columns: MyTableColumn<Emotion>[] = [
    {
      key: 'label',
      header: 'Émotion',
      render: e => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: e.color || '#cbd5e1',
              border: '1px solid rgba(0,0,0,0.08)',
              display: 'inline-block',
            }}
          />
          <strong>{e.label}</strong>
        </span>
      ),
    },
    {
      key: 'color',
      header: 'Couleur',
      render: e => <code style={{ fontSize: '0.85rem', color: '#64748b' }}>{e.color || '—'}</code>,
    },
    {
      key: 'parent',
      header: 'Parent',
      render: e => parentLabel(e.parentId),
    },
    {
      key: 'type',
      header: 'Type',
      render: e => e.parentId
        ? <MyBadge color="violet">Secondaire</MyBadge>
        : <MyBadge color="blue">Primaire</MyBadge>,
    },
  ];

  return (
    <DashboardLayout title="Émotions" subtitle="Référentiel d'émotions du tracker">
      <MyToolbar
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Rechercher une émotion…"
        actions={
          <MyButton variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
            Nouvelle émotion
          </MyButton>
        }
      />

      <MyTable
        columns={columns}
        rows={filtered}
        rowKey={e => e.id}
        loading={loading}
        emptyMessage="Aucune émotion"
        onEdit={openEdit}
        onDelete={remove}
      />

      <MyModal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Modifier l\'émotion' : 'Nouvelle émotion'}
        footer={
          <>
            <MyButton variant="ghost" onClick={() => setOpen(false)}>Annuler</MyButton>
            <MyButton variant="primary" onClick={submit}>
              {editing ? 'Enregistrer' : 'Créer'}
            </MyButton>
          </>
        }
      >
        {error && <MyAlert variant="error">{error}</MyAlert>}
        <form onSubmit={submit}>
          <MyInput
            label="Libellé"
            value={form.label}
            onChange={e => setForm({ ...form, label: e.target.value })}
            required
          />
          <MyColorInput
            label="Couleur"
            value={form.color}
            onChange={c => setForm({ ...form, color: c })}
          />
          <MyDropdown
            label="Parent"
            value={form.parentId}
            onChange={v => setForm({ ...form, parentId: v })}
            placeholder="— Aucun (émotion primaire) —"
            options={primaries
              .filter(p => p.id !== form.id)
              .map(p => ({ value: p.id, label: p.label }))}
            help="Laissez vide pour créer une émotion primaire"
            emptyMessage="Aucune émotion primaire"
          />
        </form>
      </MyModal>
    </DashboardLayout>
  );
};

export default AdminEmotions;
