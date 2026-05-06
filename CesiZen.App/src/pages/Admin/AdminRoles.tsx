import React, { useEffect, useState } from 'react';
import { Plus, ShieldCheck, Check } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import {
  MyAlert,
  MyBadge,
  MyButton,
  MyInput,
  MyModal,
  MyTable,
  MyToolbar,
  type MyTableColumn,
} from '../../components/my';
import { roleService, type Role, type RoleWithPermissions } from '../../services/roleService';
import { permissionService, type Permission } from '../../services/permissionService';
import styles from './AdminRoles.module.css';

interface FormState {
  id?: number;
  label: string;
}

const empty: FormState = { label: '' };

const AdminRoles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(empty);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [permsOpen, setPermsOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<RoleWithPermissions | null>(null);
  const [permsLoading, setPermsLoading] = useState(false);

  const loadRoles = async () => {
    setLoading(true);
    try {
      setRoles(await roleService.getAll());
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRoles();
    permissionService.getAll()
      .then(setAllPermissions)
      .catch(() => setAllPermissions([]));
  }, []);

  const openCreate = () => {
    setForm(empty);
    setEditing(false);
    setError(null);
    setOpen(true);
  };

  const openEdit = (r: Role) => {
    setForm({ id: r.id, label: r.label });
    setEditing(true);
    setError(null);
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (editing && form.id) {
        await roleService.update(form.id, { label: form.label });
      } else {
        await roleService.create({ label: form.label });
      }
      setOpen(false);
      loadRoles();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const remove = async (r: Role) => {
    if (!confirm(`Supprimer le rôle "${r.label}" ? Les utilisateurs liés perdront ce rôle.`)) return;
    try {
      await roleService.delete(r.id);
      loadRoles();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const openPermissions = async (r: Role) => {
    setPermsOpen(true);
    setPermsLoading(true);
    setActiveRole({ id: r.id, label: r.label, permissions: [] });
    try {
      const data = await roleService.getRolePermissions(r.id);
      setActiveRole(data);
    } catch (e: any) {
      alert(e.message);
      setPermsOpen(false);
    }
    setPermsLoading(false);
  };

  const togglePermission = async (perm: Permission) => {
    if (!activeRole) return;
    const has = activeRole.permissions.some(p => p.id === perm.id);
    try {
      if (has) {
        await roleService.removePermission(activeRole.id, perm.id);
        setActiveRole({
          ...activeRole,
          permissions: activeRole.permissions.filter(p => p.id !== perm.id),
        });
      } else {
        await roleService.addPermission(activeRole.id, perm.id);
        setActiveRole({
          ...activeRole,
          permissions: [...activeRole.permissions, perm],
        });
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  const filtered = roles.filter(r =>
    r.label.toLowerCase().includes(search.toLowerCase())
  );

  const roleColor = (label: string): 'red' | 'amber' | 'green' | 'slate' => {
    if (label === 'Admin') return 'red';
    if (label === 'Moderator') return 'amber';
    if (label === 'User') return 'green';
    return 'slate';
  };

  const columns: MyTableColumn<Role>[] = [
    {
      key: 'label',
      header: 'Rôle',
      render: r => <MyBadge color={roleColor(r.label)}>{r.label}</MyBadge>,
    },
    {
      key: 'permissions',
      header: 'Permissions',
      render: r => (
        <MyButton
          variant="secondary"
          size="sm"
          icon={<ShieldCheck size={14} />}
          onClick={() => openPermissions(r)}
        >
          Gérer
        </MyButton>
      ),
    },
  ];

  return (
    <DashboardLayout title="Rôles" subtitle="Gestion des rôles et de leurs permissions">
      <MyToolbar
        searchValue={search}
        onSearch={setSearch}
        searchPlaceholder="Rechercher un rôle…"
        actions={
          <MyButton variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
            Nouveau rôle
          </MyButton>
        }
      />

      <MyTable
        columns={columns}
        rows={filtered}
        rowKey={r => r.id}
        loading={loading}
        emptyMessage="Aucun rôle"
        onEdit={openEdit}
        onDelete={remove}
      />

      <MyModal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Modifier le rôle' : 'Nouveau rôle'}
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
            placeholder="Ex. Moderator"
            required
          />
        </form>
      </MyModal>

      <MyModal
        open={permsOpen}
        onClose={() => setPermsOpen(false)}
        size="lg"
        title={activeRole ? `Permissions du rôle « ${activeRole.label} »` : 'Permissions'}
        subtitle="Cliquez sur une permission pour l'activer ou la retirer"
        footer={<MyButton variant="primary" onClick={() => setPermsOpen(false)}>Fermer</MyButton>}
      >
        {permsLoading && <div className={styles.empty}>Chargement…</div>}
        {!permsLoading && allPermissions.length === 0 && (
          <MyAlert variant="info">
            Aucune permission disponible. Créez d'abord des permissions depuis la page « Permissions ».
          </MyAlert>
        )}
        {!permsLoading && allPermissions.length > 0 && activeRole && (
          <div className={styles.permList}>
            {allPermissions.map(p => {
              const active = activeRole.permissions.some(rp => rp.id === p.id);
              return (
                <div
                  key={p.id}
                  className={`${styles.permRow} ${active ? styles.active : ''}`}
                  onClick={() => togglePermission(p)}
                >
                  <div className={`${styles.checkbox} ${active ? styles.checked : ''}`}>
                    {active && <Check size={14} strokeWidth={3} />}
                  </div>
                  <div className={styles.permInfo}>
                    <div className={styles.permLabel}>{p.label}</div>
                    <span className={styles.permCode}>{p.code}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </MyModal>
    </DashboardLayout>
  );
};

export default AdminRoles;
