import React, { useState } from 'react';
import { Check, CheckCircle2, UserPlus, X } from 'lucide-react';
import type { Gender, Registration, Seksi, Tempekan } from '../types';
import { formatTanggalId } from '../utils/format';

interface RegistrationViewProps {
  registrations: Registration[];
  isPengurus: boolean;
  onRequireAuth: () => void;
  onSubmitRegistration: (
    payload: Omit<Registration, 'id' | 'statusVerifikasi' | 'submittedAt'>
  ) => Promise<string | null>;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

const SEKSI_PILIHAN: Seksi[] = [
  'Seksi Kerohanian & Adat',
  'Seksi Seni & Budaya',
  'Seksi Olahraga & Pemuda',
  'Seksi Humas & Dokumentasi',
  'Seksi Kebersihan & Lingkungan',
  'Anggota Umum',
];

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  registrations,
  isPengurus,
  onRequireAuth,
  onSubmitRegistration,
  onApprove,
  onReject,
}) => {
  const [nama, setNama] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState<Gender>('Laki-laki');
  const [tempatLahir, setTempatLahir] = useState('Gianyar');
  const [tanggalLahir, setTanggalLahir] = useState('2008-01-10');
  const [tempekan, setTempekan] = useState<Tempekan>('Tempekan Kaja');
  const [alamat, setAlamat] = useState('Br. Mantring, Tampaksiring');
  const [noTelepon, setNoTelepon] = useState('');
  const [pendidikanPekerjaan, setPendidikanPekerjaan] = useState('');
  const [minatSeksi, setMinatSeksi] = useState<Seksi>('Seksi Seni & Budaya');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);
    const err = await onSubmitRegistration({
      nama,
      jenisKelamin,
      tempatLahir,
      tanggalLahir,
      tempekan,
      alamat,
      noTelepon,
      pendidikanPekerjaan,
      minatSeksi,
    });
    setSubmitting(false);
    if (err) {
      setError(err);
    } else {
      setSuccessMsg(
        `Pendaftaran atas nama ${nama} berhasil dikirim dan menunggu verifikasi pengurus.`
      );
      setNama('');
      setNoTelepon('');
      setPendidikanPekerjaan('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-zinc-900">
          Pendaftaran Anggota Baru
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Pendaftaran terbuka untuk pemuda-pemudi Banjar Mantring yang belum
          menikah (menginjak usia STT) tanpa biaya pendaftaran maupun iuran.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Registration Form */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 lg:col-span-6">
          <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-4">
            <UserPlus className="h-5 w-5 text-rose-800" />
            <div>
              <h2 className="font-display text-base font-bold text-zinc-900">
                Formulir Calon Anggota
              </h2>
              <p className="text-xs text-zinc-500">
                Data akan diverifikasi oleh Sekretaris STT pada sangkep berikutnya
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama lengkap sesuai identitas"
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                  Jenis Kelamin
                </label>
                <select
                  value={jenisKelamin}
                  onChange={(e) => setJenisKelamin(e.target.value as Gender)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                  Tempekan
                </label>
                <select
                  value={tempekan}
                  onChange={(e) => setTempekan(e.target.value as Tempekan)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none"
                >
                  <option value="Tempekan Kaja">Tempekan Kaja</option>
                  <option value="Tempekan Tengah">Tempekan Tengah</option>
                  <option value="Tempekan Kelod">Tempekan Kelod</option>
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
                  className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none"
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
                  className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 tabular-nums focus:border-rose-800 focus:outline-none"
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
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 tabular-nums focus:border-rose-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                  Minat Seksi / Bidang
                </label>
                <select
                  value={minatSeksi}
                  onChange={(e) => setMinatSeksi(e.target.value as Seksi)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none"
                >
                  {SEKSI_PILIHAN.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Pendidikan / Pekerjaan Saat Ini
              </label>
              <input
                type="text"
                required
                value={pendidikanPekerjaan}
                onChange={(e) => setPendidikanPekerjaan(e.target.value)}
                placeholder="Contoh: Siswa SMA N 1 Tampaksiring"
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Alamat Tinggal di Banjar Mantring
              </label>
              <input
                type="text"
                required
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-rose-800 focus:outline-none"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-rose-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-900 disabled:opacity-60"
            >
              {submitting ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran Anggota'}
            </button>
          </form>
        </section>

        {/* Verification Queue */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 lg:col-span-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h2 className="font-display text-base font-bold text-zinc-900">
                Antrean Verifikasi Pengurus
              </h2>
              <p className="text-xs text-zinc-500">
                Daftar calon anggota yang telah mengajukan pendaftaran
              </p>
            </div>
            {!isPengurus && (
              <button
                type="button"
                onClick={onRequireAuth}
                className="text-xs font-semibold text-rose-800 hover:text-rose-900 whitespace-nowrap shrink-0"
              >
                Masuk untuk Verifikasi
              </button>
            )}
          </div>

          {registrations.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              Belum ada pengajuan pendaftaran calon anggota.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {registrations.map((reg) => (
                <div key={reg.id} className="py-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-sm font-bold text-zinc-900">
                        {reg.nama}
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-500 tabular-nums">
                        {reg.jenisKelamin} · {reg.tempekan} ·{' '}
                        {formatTanggalId(reg.tanggalLahir)}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        reg.statusVerifikasi === 'Diterima'
                          ? 'text-emerald-700'
                          : reg.statusVerifikasi === 'Ditolak'
                            ? 'text-red-700'
                            : 'text-amber-700'
                      }`}
                    >
                      {reg.statusVerifikasi}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-zinc-600">
                    {reg.pendidikanPekerjaan} · Minat: {reg.minatSeksi} · WA{' '}
                    <span className="font-mono tabular-nums">{reg.noTelepon}</span>
                  </p>

                  {reg.catatanPengurus && (
                    <p className="mt-1.5 text-xs font-medium text-zinc-700">
                      Catatan: {reg.catatanPengurus}
                    </p>
                  )}

                  {reg.statusVerifikasi === 'Menunggu' && (
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (!isPengurus) {
                            onRequireAuth();
                          } else {
                            onApprove(reg.id);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-800 whitespace-nowrap shrink-0"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Terima & Terbitkan NIA
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!isPengurus) {
                            onRequireAuth();
                          } else {
                            onReject(reg.id);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 whitespace-nowrap shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                        Tolak
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
