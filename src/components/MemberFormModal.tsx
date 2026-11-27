import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { Gender, Member, MemberStatus, Seksi, Tempekan } from '../types';

interface MemberFormModalProps {
  open: boolean;
  initialMember: Member | null;
  onClose: () => void;
  onSave: (payload: Partial<Member>) => Promise<string | null>;
}

const SEKSI_OPTIONS: Seksi[] = [
  'Pengurus Inti',
  'Seksi Kerohanian & Adat',
  'Seksi Seni & Budaya',
  'Seksi Olahraga & Pemuda',
  'Seksi Humas & Dokumentasi',
  'Seksi Kebersihan & Lingkungan',
  'Anggota Umum',
];

const TEMPEKAN_OPTIONS: Tempekan[] = [
  'Tempekan Kaja',
  'Tempekan Tengah',
  'Tempekan Kelod',
];

const STATUS_OPTIONS: MemberStatus[] = ['Aktif', 'Pasif', 'Purna Bakti'];

export const MemberFormModal: React.FC<MemberFormModalProps> = ({
  open,
  initialMember,
  onClose,
  onSave,
}) => {
  const [nama, setNama] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<Gender>('Laki-laki');
  const [tempatLahir, setTempatLahir] = useState('Gianyar');
  const [tanggalLahir, setTanggalLahir] = useState('2005-01-01');
  const [tempekan, setTempekan] = useState<Tempekan>('Tempekan Tengah');
  const [alamat, setAlamat] = useState('Br. Mantring, Tampaksiring');
  const [noTelepon, setNoTelepon] = useState('');
  const [pendidikanPekerjaan, setPendidikanPekerjaan] = useState('');
  const [seksi, setSeksi] = useState<Seksi>('Anggota Umum');
  const [jabatan, setJabatan] = useState('Anggota');
  const [status, setStatus] = useState<MemberStatus>('Aktif');
  const [tahunGabung, setTahunGabung] = useState(new Date().getFullYear());
  const [catatanStatus, setCatatanStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialMember) {
      setNama(initialMember.nama);
      setJenisKelamin(initialMember.jenisKelamin);
      setTempatLahir(initialMember.tempatLahir);
      setTanggalLahir(initialMember.tanggalLahir);
      setTempekan(initialMember.tempekan);
      setAlamat(initialMember.alamat);
      setNoTelepon(initialMember.noTelepon);
      setPendidikanPekerjaan(initialMember.pendidikanPekerjaan);
      setSeksi(initialMember.seksi);
      setJabatan(initialMember.jabatan);
      setStatus(initialMember.status);
      setTahunGabung(initialMember.tahunGabung);
      setCatatanStatus(initialMember.catatanStatus || '');
    } else {
      setNama('');
      setJenisKelamin('Laki-laki');
      setTempatLahir('Gianyar');
      setTanggalLahir('2006-01-15');
      setTempekan('Tempekan Tengah');
      setAlamat('Br. Mantring, Tampaksiring');
      setNoTelepon('');
      setPendidikanPekerjaan('');
      setSeksi('Anggota Umum');
      setJabatan('Anggota');
      setStatus('Aktif');
      setTahunGabung(new Date().getFullYear());
      setCatatanStatus('');
    }
    setError('');
  }, [initialMember, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const err = await onSave({
      id: initialMember?.id,
      nama,
      jenisKelamin,
      tempatLahir,
      tanggalLahir,
      tempekan,
      alamat,
      noTelepon,
      pendidikanPekerjaan,
      seksi,
      jabatan,
      status,
      tahunGabung,
      catatanStatus,
    });
    setSaving(false);
    if (err) {
      setError(err);
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-form-title"
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2
              id="member-form-title"
              className="font-display text-lg font-bold text-zinc-900"
            >
              {initialMember ? 'Perbarui Data Anggota' : 'Tambah Anggota Baru'}
            </h2>
            <p className="text-xs text-zinc-500">
              {initialMember
                ? `NIA: ${initialMember.nia} · STT Mertha Bhuna Sari`
                : 'Nomor Induk Anggota (NIA) akan diterbitkan otomatis'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Tutup formulir"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: I Wayan Adi Putra"
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Jenis Kelamin
              </label>
              <select
                value={jenisKelamin}
                onChange={(e) => setJenisKelamin(e.target.value as Gender)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Tempekan Wilayah
              </label>
              <select
                value={tempekan}
                onChange={(e) => setTempekan(e.target.value as Tempekan)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
              >
                {TEMPEKAN_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Tempat Lahir
              </label>
              <input
                type="text"
                required
                value={tempatLahir}
                onChange={(e) => setTempatLahir(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Tanggal Lahir
              </label>
              <input
                type="date"
                required
                value={tanggalLahir}
                onChange={(e) => setTanggalLahir(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 tabular-nums focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                No. Telepon / WhatsApp
              </label>
              <input
                type="text"
                required
                value={noTelepon}
                onChange={(e) => setNoTelepon(e.target.value)}
                placeholder="0819xxxxxxxx"
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 tabular-nums focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Pendidikan / Pekerjaan
              </label>
              <input
                type="text"
                required
                value={pendidikanPekerjaan}
                onChange={(e) => setPendidikanPekerjaan(e.target.value)}
                placeholder="Contoh: Mahasiswa / Wiraswasta"
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Alamat Lengkap
              </label>
              <input
                type="text"
                required
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Seksi / Bidang
              </label>
              <select
                value={seksi}
                onChange={(e) => setSeksi(e.target.value as Seksi)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
              >
                {SEKSI_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Jabatan dalam STT
              </label>
              <input
                type="text"
                required
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                placeholder="Anggota / Koordinator Seksi / Sekretaris"
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Status Keanggotaan
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MemberStatus)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Tahun Bergabung
              </label>
              <input
                type="number"
                min={2005}
                max={2035}
                required
                value={tahunGabung}
                onChange={(e) => setTahunGabung(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 tabular-nums focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Catatan Mutasi / Keterangan (Opsional)
              </label>
              <input
                type="text"
                value={catatanStatus}
                onChange={(e) => setCatatanStatus(e.target.value)}
                placeholder="Contoh: Purna bakti karena menikah atau sedang bekerja di luar daerah"
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-zinc-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 whitespace-nowrap shrink-0"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-rose-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-900 disabled:opacity-60 whitespace-nowrap shrink-0"
            >
              {saving ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
