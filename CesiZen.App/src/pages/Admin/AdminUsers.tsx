import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import {
  MyAlert,
  MyBadge,
  MyButton,
  MyDropdown,
  MyInput,
  MyModal,
  MyTable,
  MyToolbar,
  type MyTableColumn,
} from '../../components/my';
import { userService, type AdminUser } from '../../services/userService';
import { roleService, type Role } from '../../services/roleService';

interface FormState {
  id?: number;
  username: string;
  email: string;
  displayName: string;
  password: string;
  roleId: string;
}

const empty: FormState = { username: '', email: '', displayName: '', password: '', roleId: '' };

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setUsers(await userService.getAll());
    } catch (e: any) {
      setError(e.message);
    }
    try {
      setRoles(await roleService.getAll());
    } catch {
      setRoles([]);
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

  const openEdit = (u: AdminUser) => {
    setForm({
      id: u.id,
      username: u.username,
      email: u.email,
      displayName: u.displayName || '',
      password: '',
      roleId: u.roleId ? String(u.roleId) : '',
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
        await userService.update(form.id, {
          displayName: form.displayName,
          email: form.email,
          roleId: form.roleId ? Number(form.roleId) : undefined,
          newPassword: form.password || undefined,
        });
      } else {
        await userService.create({
          username: form.username,
          email: form.email,
          password: form.password,
          displayName: form.displayName || undefined,
          roleId: form.roleId ? Number(form.roleId) : undefined,
        });
      }
      setOpen(false);
      load();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const remove = async (u: AdminUser) => {
    if (!confirm(`Supprimer l'utilisateur "${u.username}" ?`)) return;
    try {
      await userService.delete(u.id);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const filtered = users.filter(u =>
    [u.username, u.email, u.displayName, u.role]
      .filter(Boolean)
      .some(v => v!.toLowerCase().includes(search.toLowerCase()))
  );

  const roleColor = (role?: string): 'red' | 'amber' | 'green' | 'slate' => {
    if (role === 'Admin') return 'red';
    if (role === 'Moderator') return 'amber';
    if (role === 'User') return 'green';
    return 'slate';
  };

  const columns: MyTableColumn<AdminUser>[] = [
    { key: 'username', header: 'Pseudo' },
    { key: 'email', header: 'Email' },
    { key: 'displayName', header: 'Nom affiché', render: u => u.displayName || '—' },
    {
      key: 'role',
      header: 'Rôle',
      render: u => u.role ? <MyBadge color={roleColor(u.role)}>{u.role}</MyBadge> : '—',
    },
    {
      key: 'createdAt',
      header: 'Créé le',
      render: u => u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '—',
    },
  ];

  return (
    <DashboardLayout title="Utilisateurs" subtitle="Gestion des comptes de la plateforme">
      <MyToolbar
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Rechercher un utilisateur…"
        actions={
          <MyButton variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
            Nouveau
          </MyButton>
        }
      />

      <MyTable
        columns={columns}
        rows={filtered}
        rowKey={u => u.id}
        loading={loading}
        emptyMessage="Aucun utilisateur"
        onEdit={openEdit}
        onDelete={remove}
      />

      <MyModal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        subtitle={editing ? form.username : 'Renseignez les informations du compte'}
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
            label="Nom d'utilisateur"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            disabled={editing}
            required
          />
          <MyInput
            label="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <MyInput
            label="Nom affiché"
            value={form.displayName}
            onChange={e => setForm({ ...form, displayName: e.target.value })}
          />
          <MyInput
            label={editing ? 'Nouveau mot de passe' : 'Mot de passe'}
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required={!editing}
            help={editing ? 'Laissez vide pour ne pas le changer' : 'Au moins 6 caractères'}
            minLength={editing ? 0 : 6}
          />
          <MyDropdown
            label="Rôle"
            value={form.roleId}
            onChange={v => setForm({ ...form, roleId: v })}
            placeholder="— Aucun —"
            options={roles.map(r => ({ value: r.id, label: r.label }))}
            emptyMessage="Aucun rôle disponible"
          />
        </form>
      </MyModal>
    </DashboardLayout>
  );
};

export default AdminUsers;
