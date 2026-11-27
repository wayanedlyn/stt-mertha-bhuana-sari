import React, { useMemo, useState } from 'react';
import { Calendar, Plus, Trash2, X } from 'lucide-react';
import type {
  Activity,
  ActivityCategory,
  AttendanceStatus,
  Member,
} from '../types';
import { formatTanggalId } from '../utils/format';

interface ActivitiesViewProps {
  activities: Activity[];
  members: Member[];
  isPengurus: boolean;
  onRequireAuth: () => void;
  onCreateActivity: (payload: {
    judul: string;
    kategori: ActivityCategory;
    tanggal: string;
    waktu: string;
    lokasi: string;
    deskripsi: string;
  }) => Promise<string | null>;
  onMarkAttendance: (
    activityId: string,
    memberId: string,
    status: AttendanceStatus
  ) => Promise<void>;
  onDeleteActivity: (activityId: string) => Promise<void>;
}

const ATTENDANCE_OPTIONS: AttendanceStatus[] = ['Hadir', 'Izin', 'Sakit', 'Alpa'];

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  activities,
  members,
  isPengurus,
  onRequireAuth,
  onCreateActivity,
  onMarkAttendance,
  onDeleteActivity,
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    activities[0]?.id || ''
  );
  const [modalOpen, setModalOpen] = useState(false);

  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState<ActivityCategory>('Sangkep');
  const [tanggal, setTanggal] = useState('2026-12-27');
  const [waktu, setWaktu] = useState('18:30 WITA');
  const [lokasi, setLokasi] = useState('Bale Banjar Mantring, Tampaksiring');
  const [deskripsi, setDeskripsi] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const activeMembers = useMemo(
    () => members.filter((m) => m.status !== 'Purna Bakti'),
    [members]
  );

  const selectedActivity =
    activities.find((a) => a.id === selectedId) || activities[0] || null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    const err = await onCreateActivity({
      judul,
      kategori,
      tanggal,
      waktu,
      lokasi,
      deskripsi,
    });
    setSaving(false);
    if (err) {
      setFormError(err);
    } else {
      setJudul('');
      setDeskripsi('');
      setModalOpen(false);
    }
  };

  const countStatus = (act: Activity, st: AttendanceStatus) =>
    Object.values(act.presensi).filter((v) => v === st).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-900">
            Agenda Kegiatan & Presensi
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Pencatatan jadwal sangkep, ngayah, latihan seni, dan daftar hadir
            anggota aktif
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!isPengurus) {
              onRequireAuth();
            } else {
              setModalOpen(true);
            }
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-rose-800 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-900 whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4" />
          Buat Agenda Baru
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Activity List */}
        <section className="rounded-xl border border-zinc-200 bg-white p-4 lg:col-span-5">
          <h2 className="px-2 pb-3 font-display text-sm font-bold text-zinc-900">
            Daftar Kegiatan ({activities.length})
          </h2>
          {activities.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              Belum ada agenda kegiatan terdaftar.
            </div>
          ) : (
            <div className="space-y-2">
              {activities.map((act) => {
                const isSelected = selectedActivity?.id === act.id;
                const hadir = countStatus(act, 'Hadir');
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setSelectedId(act.id)}
                    className={`w-full rounded-lg border p-3.5 text-left transition-colors ${
                      isSelected
                        ? 'border-rose-800 bg-rose-50/50'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="font-semibold text-rose-800">
                        {act.kategori}
                      </span>
                      <span className="font-mono tabular-nums">
                        {formatTanggalId(act.tanggal)}
                      </span>
                    </div>
                    <h3 className="mt-1 font-display text-sm font-bold text-zinc-900">
                      {act.judul}
                    </h3>
                    <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
                      <span className="truncate">{act.lokasi}</span>
                      <span className="font-mono font-medium text-zinc-700 tabular-nums shrink-0 pl-2">
                        {hadir}/{activeMembers.length} hadir
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Attendance Matrix */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 lg:col-span-7">
          {!selectedActivity ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500">
              <Calendar className="h-8 w-8 text-zinc-300" />
              <p className="mt-2 text-sm">Pilih agenda di sebelah kiri untuk melihat presensi.</p>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span className="font-semibold text-rose-800">
                      {selectedActivity.kategori}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {formatTanggalId(selectedActivity.tanggal)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedActivity.waktu}</span>
                  </div>
                  <h2 className="mt-1 font-display text-lg font-bold text-zinc-900">
                    {selectedActivity.judul}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-600">
                    {selectedActivity.deskripsi}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isPengurus) {
                      onRequireAuth();
                    } else {
                      onDeleteActivity(selectedActivity.id);
                    }
                  }}
                  title="Hapus Agenda"
                  className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Summary Strip */}
              <div className="mt-4 grid grid-cols-4 gap-3 border-b border-zinc-100 pb-4 text-center">
                <div>
                  <p className="text-[11px] text-zinc-500">Hadir</p>
                  <p className="font-mono text-base font-bold text-emerald-700 tabular-nums">
                    {countStatus(selectedActivity, 'Hadir')}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-500">Izin</p>
                  <p className="font-mono text-base font-bold text-amber-700 tabular-nums">
                    {countStatus(selectedActivity, 'Izin')}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-500">Sakit</p>
                  <p className="font-mono text-base font-bold text-zinc-700 tabular-nums">
                    {countStatus(selectedActivity, 'Sakit')}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-zinc-500">Alpa</p>
                  <p className="font-mono text-base font-bold text-red-700 tabular-nums">
                    {countStatus(selectedActivity, 'Alpa')}
                  </p>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-500">
                      <th className="py-2.5 pr-3 font-semibold">Anggota</th>
                      <th className="py-2.5 pr-3 font-semibold">Tempekan</th>
                      <th className="py-2.5 text-right font-semibold">
                        Status Kehadiran
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {activeMembers.map((m) => {
                      const current = selectedActivity.presensi[m.id];
                      return (
                        <tr key={m.id}>
                          <td className="py-2.5 pr-3">
                            <p className="font-semibold text-zinc-900">
                              {m.nama}
                            </p>
                            <p className="font-mono text-[11px] text-zinc-400 tabular-nums">
                              {m.nia}
                            </p>
                          </td>
                          <td className="py-2.5 pr-3 text-zinc-600">
                            {m.tempekan}
                          </td>
                          <td className="py-2.5 text-right">
                            <div className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 p-0.5">
                              {ATTENDANCE_OPTIONS.map((opt) => {
                                const active = current === opt;
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                      if (!isPengurus) {
                                        onRequireAuth();
                                      } else {
                                        onMarkAttendance(
                                          selectedActivity.id,
                                          m.id,
                                          opt
                                        );
                                      }
                                    }}
                                    className={`rounded-md px-2 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                                      active
                                        ? opt === 'Hadir'
                                          ? 'bg-emerald-700 text-white shadow-xs'
                                          : opt === 'Izin'
                                            ? 'bg-amber-600 text-white shadow-xs'
                                            : opt === 'Sakit'
                                              ? 'bg-zinc-700 text-white shadow-xs'
                                              : 'bg-red-700 text-white shadow-xs'
                                        : 'text-zinc-600 hover:text-zinc-900'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Create Activity Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h2 className="font-display text-lg font-bold text-zinc-900">
                Tambah Agenda Kegiatan
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                  Nama Kegiatan
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Sangkep Rutin Purnama"
                  className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                    Kategori
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) =>
                      setKategori(e.target.value as ActivityCategory)
                    }
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none"
                  >
                    <option value="Sangkep">Sangkep</option>
                    <option value="Ngayah">Ngayah</option>
                    <option value="Seni & Olahraga">Seni & Olahraga</option>
                    <option value="Gotong Royong">Gotong Royong</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 tabular-nums focus:border-rose-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                    Waktu
                  </label>
                  <input
                    type="text"
                    required
                    value={waktu}
                    onChange={(e) => setWaktu(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                    Lokasi
                  </label>
                  <input
                    type="text"
                    required
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                  Keterangan Kegiatan
                </label>
                <textarea
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Agenda pembahasan atau perlengkapan yang dibawa..."
                  className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none"
                />
              </div>

              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2 text-xs text-red-700">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-rose-800 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-900 disabled:opacity-60"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
