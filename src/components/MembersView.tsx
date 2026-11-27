import React, { useMemo, useState } from 'react';
import {
  Download,
  IdCard,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import type { Member, MemberStatus, Seksi, Tempekan } from '../types';
import { exportMembersCsv, formatTanggalId, hitungUsia } from '../utils/format';

interface MembersViewProps {
  members: Member[];
  isPengurus: boolean;
  onRequireAuth: () => void;
  onAddMember: () => void;
  onEditMember: (member: Member) => void;
  onViewKta: (member: Member) => void;
  onDeleteMember: (member: Member) => Promise<void>;
}

export const MembersView: React.FC<MembersViewProps> = ({
  members,
  isPengurus,
  onRequireAuth,
  onAddMember,
  onEditMember,
  onViewKta,
  onDeleteMember,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | MemberStatus>('Semua');
  const [tempekanFilter, setTempekanFilter] = useState<'Semua' | Tempekan>('Semua');
  const [seksiFilter, setSeksiFilter] = useState<'Semua' | Seksi>('Semua');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      if (statusFilter !== 'Semua' && m.status !== statusFilter) return false;
      if (tempekanFilter !== 'Semua' && m.tempekan !== tempekanFilter) return false;
      if (seksiFilter !== 'Semua' && m.seksi !== seksiFilter) return false;
      if (!q) return true;
      return (
        m.nama.toLowerCase().includes(q) ||
        m.nia.toLowerCase().includes(q) ||
        m.jabatan.toLowerCase().includes(q) ||
        m.pendidikanPekerjaan.toLowerCase().includes(q)
      );
    });
  }, [members, search, statusFilter, tempekanFilter, seksiFilter]);

  const statusTone = (status: MemberStatus) => {
    if (status === 'Aktif') return 'text-emerald-700 font-semibold';
    if (status === 'Pasif') return 'text-amber-700 font-semibold';
    return 'text-zinc-500 font-medium';
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-900">
            Direktori & Manajemen Anggota
          </h1>
          <p className="mt-1 text-sm text-zinc-500 tabular-nums">
            Menampilkan {filteredMembers.length} dari {members.length} anggota terdaftar
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => exportMembersCsv(filteredMembers)}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 whitespace-nowrap shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            Unduh CSV
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isPengurus) {
                onRequireAuth();
              } else {
                onAddMember();
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-800 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-900 whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4" />
            Tambah Anggota
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="relative md:col-span-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, NIA, jabatan, atau pekerjaan..."
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-800/15"
            />
          </div>

          <div className="md:col-span-2">
            <select
              aria-label="Filter Status Keanggotaan"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'Semua' | MemberStatus)
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-rose-800 focus:outline-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Pasif">Pasif</option>
              <option value="Purna Bakti">Purna Bakti</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              aria-label="Filter Tempekan"
              value={tempekanFilter}
              onChange={(e) =>
                setTempekanFilter(e.target.value as 'Semua' | Tempekan)
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-rose-800 focus:outline-none"
            >
              <option value="Semua">Semua Tempekan</option>
              <option value="Tempekan Kaja">Tempekan Kaja</option>
              <option value="Tempekan Tengah">Tempekan Tengah</option>
              <option value="Tempekan Kelod">Tempekan Kelod</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              aria-label="Filter Seksi"
              value={seksiFilter}
              onChange={(e) =>
                setSeksiFilter(e.target.value as 'Semua' | Seksi)
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-rose-800 focus:outline-none"
            >
              <option value="Semua">Semua Seksi / Bidang</option>
              <option value="Pengurus Inti">Pengurus Inti</option>
              <option value="Seksi Kerohanian & Adat">Seksi Kerohanian & Adat</option>
              <option value="Seksi Seni & Budaya">Seksi Seni & Budaya</option>
              <option value="Seksi Olahraga & Pemuda">Seksi Olahraga & Pemuda</option>
              <option value="Seksi Humas & Dokumentasi">Seksi Humas & Dokumentasi</option>
              <option value="Seksi Kebersihan & Lingkungan">
                Seksi Kebersihan & Lingkungan
              </option>
              <option value="Anggota Umum">Anggota Umum</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {filteredMembers.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Users className="h-8 w-8 text-zinc-300" />
            <p className="mt-3 font-display text-base font-semibold text-zinc-900">
              Tidak ada data anggota yang cocok
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Ubah kata kunci pencarian atau atur ulang filter wilayah dan status.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatusFilter('Semua');
                setTempekanFilter('Semua');
                setSeksiFilter('Semua');
              }}
              className="mt-4 rounded-lg border border-zinc-200 px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Atur Ulang Filter
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/70 text-xs font-semibold text-zinc-600">
                  <th className="px-4 py-3 whitespace-nowrap">NIA</th>
                  <th className="px-4 py-3">Nama & Usia</th>
                  <th className="px-4 py-3">Tempekan</th>
                  <th className="px-4 py-3">Seksi & Jabatan</th>
                  <th className="px-4 py-3 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredMembers.map((m) => (
                  <tr
                    key={m.id}
                    className="transition-colors hover:bg-zinc-50/80"
                  >
                    <td className="px-4 py-3 font-mono text-xs font-medium text-zinc-700 tabular-nums whitespace-nowrap">
                      {m.nia}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-zinc-900">{m.nama}</p>
                      <p className="text-xs text-zinc-500 tabular-nums">
                        {m.jenisKelamin} · {hitungUsia(m.tanggalLahir)} th ·{' '}
                        {m.noTelepon}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700">
                      <p className="font-medium text-zinc-800">{m.tempekan}</p>
                      <p className="text-zinc-500">{m.pendidikanPekerjaan}</p>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <p className="font-medium text-zinc-800">{m.jabatan}</p>
                      <p className="text-zinc-500">{m.seksi}</p>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      <span className={statusTone(m.status)}>{m.status}</span>
                      <p className="text-[11px] text-zinc-400 tabular-nums">
                        Masuk {m.tahunGabung}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onViewKta(m)}
                          title="Lihat & Cetak KTA"
                          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                        >
                          <IdCard className="h-3.5 w-3.5" />
                          KTA
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!isPengurus) {
                              onRequireAuth();
                            } else {
                              onEditMember(m);
                            }
                          }}
                          title="Edit Data Anggota"
                          className="rounded-md p-1.5 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        {confirmDeleteId === m.id ? (
                          <div className="inline-flex items-center gap-1 pl-1">
                            <button
                              type="button"
                              onClick={async () => {
                                await onDeleteMember(m);
                                setConfirmDeleteId(null);
                              }}
                              className="rounded bg-red-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-red-700"
                            >
                              Hapus
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded border border-zinc-200 px-2 py-1 text-[11px] font-medium text-zinc-600 hover:bg-zinc-50"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              if (!isPengurus) {
                                onRequireAuth();
                              } else {
                                setConfirmDeleteId(m.id);
                              }
                            }}
                            title="Hapus Anggota"
                            className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
