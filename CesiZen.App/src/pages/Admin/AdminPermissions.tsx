import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import {
  MyAlert,
  MyButton,
  MyInput,
  MyModal,
  MyTable,
  MyToolbar,
  type MyTableColumn,
} from '../../components/my';
import { permissionService, type Permission } from '../../services/permissionService';

interface FormState {
  id?: number;
  label: string;
  code: string;
}

const empty: FormState = { label: '', code: '' };

const AdminPermissions: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setPermissions(await permissionService.getAll());
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setForm(empty);
    setEditing(false);
    setError(null);
    setOpen(true);
  };

  const openEdit = (p: Permission) => {
    setForm({ id: p.id, label: p.label, code: p.code });
    setEditing(true);
    setError(null);
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = { label: form.label, code: form.code.toUpperCase().trim() };
      if (editing && form.id) {
        await permissionService.update(form.id, payload);
      } else {
        await permissionService.create(payload);
      }
      setOpen(false);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const remove = async (p: Permission) => {
    if (!confirm(`Supprimer la permission "${p.label}" ?`)) return;
    try {
      await permissionService.delete(p.id);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const filtered = permissions.filter(p =>
    p.label.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  const columns: MyTableColumn<Permission>[] = [
    { key: 'label', header: 'Libellé', render: p => <strong>{p.label}</strong> },
    {
      key: 'code',
      header: 'Code',
      render: p => (
        <code style={{
          background: '#f1f5f9',
          padding: '0.2rem 0.6rem',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          color: '#1e293b',
          fontWeight: 600,
        }}>{p.code}</code>
      ),
    },
  ];

  return (
    <DashboardLayout title="Permissions" subtitle="Référentiel des permissions du système">
      <MyToolbar
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Rechercher une permission…"
        actions={
          <MyButton variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
            Nouvelle permission
          </MyButton>
        }
      />

      <MyTable
        columns={columns}
        rows={filtered}
        rowKey={p => p.id}
        loading={loading}
        emptyMessage="Aucune permission"
        onEdit={openEdit}
        onDelete={remove}
      />

      <MyModal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Modifier la permission' : 'Nouvelle permission'}
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
            placeholder="Ex. Gérer les utilisateurs"
            required
          />
          <MyInput
            label="Code"
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="Ex. USER_MANAGE"
            help="Identifiant unique en majuscules, sans espaces"
            required
          />
        </form>
      </MyModal>
    </DashboardLayout>
  );
};

export default AdminPermissions;
