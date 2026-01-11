'use client'

import { useState, FormEvent, useMemo, useEffect } from 'react'
import { Plus, Mail, User, Shield, Eye, EyeOff, Trash2, Edit3, Target, Search, Users } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { GenericRankTable } from '@/components/ui/table'
import { IRankColumn } from '@/lib/types'

// Types

interface UserManagementProps {
  users?: IUser[]
  onAddUser?: (data: IRegisterUserInput) => void
  isPending?: boolean
  onUpdateUser?: (data: Partial<IRegisterUserInput>) => void
}

// Role badge styling
const roleBadgeStyles: Record<UserRole, string> = {
  ADMIN: 'bg-rose-50 text-rose-700 border-rose-200',
  PARTICIPANT: 'bg-blue-50 text-blue-700 border-blue-200',
  REFREE: 'bg-amber-50 text-amber-700 border-amber-200',
  PENDAF: 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

const roleLabels: Record<UserRole, string> = {
  ADMIN: 'Administrator',
  PARTICIPANT: 'Peserta',
  REFREE: 'Wasit',
  PENDAF: 'Pendaftar',
}

const refereeCategoryLabels: Record<RefreeCategory, string> = {
  SUMO: 'Sumo',
  SOCCER: 'Soccer',
}

// User List Columns
// const userColumns: IRankColumn<IUser>[] = [
//   {
//     header: '#',
//     colSpan: 1,
//     className: 'text-center',
//     accessor: (_: IUser, idx: number) => <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-100 rounded-full text-xs font-bold text-slate-600">{idx + 1}</span>,
//   },
//   {
//     header: 'Nama',
//     colSpan: 3,
//     accessor: (user: IUser) => (
//       <div className="flex items-center gap-3">
//         <div className="w-9 h-9 rounded-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
//           <User className="w-4 h-4 text-slate-500" />
//         </div>
//         <span className="font-semibold text-slate-800">{user.name}</span>
//       </div>
//     ),
//   },
//   {
//     header: 'Email',
//     colSpan: 4,
//     accessor: (user: IUser) => (
//       <div className="flex items-center gap-2 text-slate-600">
//         <Mail className="w-4 h-4 text-slate-400" />
//         <span className="truncate">{user.email}</span>
//       </div>
//     ),
//   },
//   {
//     header: 'Role',
//     colSpan: 2,
//     className: 'text-center',
//     accessor: (user: IUser) => (
//       <div className="flex flex-col items-center gap-1">
//         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleBadgeStyles[user.role]}`}>
//           <Shield className="w-3 h-3" />
//           {roleLabels[user.role]}
//         </span>
//         {user.role === 'REFREE' && user.refereeCategory && <span className="text-[10px] text-slate-500 font-medium">{refereeCategoryLabels[user.refereeCategory]}</span>}
//       </div>
//     ),
//   },
//   {
//     header: 'Aksi',
//     colSpan: 2,
//     className: 'text-center',
//     accessor: () => (
//       <div className="flex items-center justify-center gap-1">
//         <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
//           <Edit3 className="w-4 h-4" onClick={() => {}} />
//         </button>
//         <button className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
//           <Trash2 className="w-4 h-4" />
//         </button>
//       </div>
//     ),
//   },
// ]

// Add User Form Component
const AddUserForm = ({
  onSubmit,
  isPending,
  onClose,
  initialData,
}: {
  onSubmit: (data: IRegisterUserInput) => void
  isPending?: boolean
  onClose: () => void
  initialData?: IUser | null // Tambahan prop untuk data edit
}) => {
  // Initialize state based on initialData (Edit Mode) or Default (Add Mode)
  const [formData, setFormData] = useState<IRegisterUserInput>({
    email: initialData?.email || '',
    name: initialData?.name || '',
    password: '', // Password kosongkan defaultnya saat edit (kecuali mau diganti)
    role: initialData?.role || 'PARTICIPANT',
    refereeCategory: initialData?.refereeCategory || undefined,
  })

  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email,
        name: initialData.name,
        password: '',
        role: initialData.role,
        refereeCategory: initialData.refereeCategory,
      })
    } else {
      setFormData({ email: '', name: '', password: '', role: 'PARTICIPANT' })
    }
  }, [initialData])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData.role === 'REFREE' && !formData.refereeCategory) {
      alert('Kategori wasit harus dipilih untuk role Wasit')
      return
    }
    // Jika edit mode dan password kosong, jangan kirim password (tergantung backend handle partial update)
    // Disini saya kirim apa adanya sesuai request
    onSubmit(formData)
  }

  const inputClasses =
    'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-[#FBFF00]/40 transition-all'

  const isEditMode = !!initialData

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6">
      {/* Name Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <User className="w-4 h-4 text-slate-400" />
          Nama Lengkap <span className="text-red-400">*</span>
        </label>
        <input type="text" required value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} className={inputClasses} />
      </div>

      {/* Email Field - Disabled on Edit usually, but kept editable per logic */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Mail className="w-4 h-4 text-slate-400" />
          Email <span className="text-red-400">*</span>
        </label>
        <input type="email" required value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))} className={inputClasses} />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Shield className="w-4 h-4 text-slate-400" />
          Password
          {/* Password wajib hanya jika Add User */}
          {!isEditMode && <span className="text-red-400">*</span>}
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            // Required only if NOT editing
            required={!isEditMode}
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            placeholder={isEditMode ? 'Kosongkan jika tidak diubah' : 'Minimal 8 karakter'}
            minLength={8}
            className={`${inputClasses} pr-12`}
          />
          <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Role Field Logic (Same as before) */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          Role <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(roleLabels) as UserRole[]).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, role, refereeCategory: role === 'REFREE' ? prev.refereeCategory : undefined }))}
              className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                formData.role === role ? 'border-[#FBFF00] bg-[#FBFF00]/10 text-slate-900' : 'border-slate-200 bg-white text-slate-600'
              }`}>
              <div className="flex items-center justify-center gap-2">{roleLabels[role]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Referee Category Field (Same as before) */}
      {formData.role === 'REFREE' && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Target className="w-4 h-4 text-slate-400" />
            Kategori Wasit
            <span className="text-red-400">*</span>
          </label>

          <div className="grid grid-cols-3 gap-3">
            {(['SUMO', 'SOCCER'] as RefreeCategory[]).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, refereeCategory: category }))}
                className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  formData.refereeCategory === category ? 'border-amber-400 bg-amber-50 text-slate-900' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}>
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-3 h-3 rounded-full border-2 transition-all ${formData.refereeCategory === category ? 'border-amber-400 bg-amber-400' : 'border-slate-300'}`} />

                  {refereeCategoryLabels[category]}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50">
          Batal
        </button>
        <button type="submit" disabled={isPending} className="flex-1 px-4 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2">
          {isPending ? 'Menyimpan...' : isEditMode ? 'Simpan Perubahan' : 'Tambah User'}
        </button>
      </div>
    </form>
  )
}

// Main Component
export function UserManagement({ users = [], onAddUser, onUpdateUser, isPending }: UserManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null) // TRACK WHO IS BEING EDITED
  const [searchQuery, setSearchQuery] = useState('')

  // 1. OPEN MODAL FOR ADD
  const handleOpenAdd = () => {
    setSelectedUser(null) // Reset selected user
    setIsDialogOpen(true)
  }

  // 2. OPEN MODAL FOR EDIT
  const handleOpenEdit = (user: IUser) => {
    setSelectedUser(user) // Set target user
    setIsDialogOpen(true)
  }

  console.log(selectedUser?.uid)

  // 3. HANDLE SUBMIT (ROUTING LOGIC)
  const handleFormSubmit = (data: IRegisterUserInput) => {
    if (selectedUser) {
      onUpdateUser?.({ uid: selectedUser.uid, ...data })
    } else {
      onAddUser?.(data)
    }
    setIsDialogOpen(false)
  }

  // 4. MEMOIZED COLUMNS (Inside component to access handlers)
  const columns = useMemo<IRankColumn<IUser>[]>(
    () => [
      // ... Kolom lain sama (Copy paste #, Nama, Email, Role dari code lama) ...
      {
        header: '#',
        colSpan: 1,
        className: 'text-center',
        accessor: (_: IUser, idx: number) => <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-100 rounded-full text-xs font-bold text-slate-600">{idx + 1}</span>,
      },
      {
        header: 'Nama',
        colSpan: 3,
        accessor: (user: IUser) => <span className="font-semibold text-slate-800">{user.name}</span>,
      },
      {
        header: 'Email',
        colSpan: 4,
        accessor: (user: IUser) => <span className="truncate text-slate-600">{user.email}</span>,
      },
      {
        header: 'Role',
        colSpan: 2,
        className: 'text-center',
        accessor: (user: IUser) => (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleBadgeStyles[user.role]}`}>{roleLabels[user.role]}</span>
        ),
      },
      {
        header: 'Aksi',
        colSpan: 2,
        className: 'text-center',
        accessor: (user: IUser) => (
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={() => handleOpenEdit(user)} // INI KUNCINYA
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [],
  ) // Dependencies kosong atau [handleOpenEdit] jika perlu

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users

    const query = searchQuery.toLowerCase()

    return users.filter((user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query) || roleLabels[user.role].toLowerCase().includes(query))
  }, [users, searchQuery])

  return (
    <div className="w-full max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-[#FBFF00] rounded-xl">
            <Users className="w-5 h-5 text-slate-900" />
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight text-slate-900">User Management</h1>
        </div>

        <p className="text-slate-500 text-sm ml-14">Kelola pengguna turnamen dengan mudah</p>
      </div>

      {/* Toolbar */}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        {/* Search */}

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari user..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:ring-2 focus:ring-[#FBFF00]/40 transition-all"
          />
        </div>

        {/* Add Button */}

        <button
          onClick={() => handleOpenAdd()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />

          <span className="hidden sm:inline">Tambah User</span>

          <span className="sm:hidden">Tambah</span>
        </button>
      </div>

      {/* Stats Cards */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {(Object.keys(roleLabels) as UserRole[]).map((role) => {
          const count = users.filter((u) => u.role === role).length

          return (
            <div key={role} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
              <div className={`p-2 rounded-lg border ${roleBadgeStyles[role]}`}>
                <Shield className="w-4 h-4" />
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">{count}</p>

                <p className="text-xs text-slate-500">{roleLabels[role]}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Table */}
      <GenericRankTable data={filteredUsers} columns={columns} subtitle={`${filteredUsers.length} users`} />

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white p-0 gap-0 overflow-hidden rounded-2xl border-slate-200">
          <DialogHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <div className="p-2 bg-[#FBFF00] rounded-lg">
                <Plus className="w-4 h-4 text-slate-900" />
              </div>
              {/* Dynamic Title */}
              {selectedUser ? 'Edit Data User' : 'Tambah User Baru'}
            </DialogTitle>
            <DialogDescription className="text-slate-500">{selectedUser ? 'Perbarui informasi user di bawah ini.' : 'Isi detail informasi user di bawah ini.'}</DialogDescription>
          </DialogHeader>

          <AddUserForm
            onSubmit={handleFormSubmit}
            isPending={isPending}
            onClose={() => setIsDialogOpen(false)}
            initialData={selectedUser} // Pass data user yang diedit
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
