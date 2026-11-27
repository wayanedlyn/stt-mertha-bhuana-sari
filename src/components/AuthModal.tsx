import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';
import type { AuthStatus } from '../types';

interface AuthModalProps {
  open: boolean;
  authStatus: AuthStatus;
  onClose: () => void;
  onAuthenticated: (token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  authStatus,
  onClose,
  onAuthenticated,
}) => {
  const needsSetup = !authStatus.envConfigured && !authStatus.hasClaimedPassword;
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (needsSetup && passcode !== confirmPasscode) {
      setError('Konfirmasi sandi tidak cocok.');
      return;
    }
    if (passcode.trim().length < 6 && needsSetup) {
      setError('Sandi pengurus minimal terdiri dari 6 karakter.');
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = needsSetup ? '/api/auth/setup' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal memverifikasi sandi pengurus.');
        return;
      }
      setPasscode('');
      setConfirmPasscode('');
      onAuthenticated(data.token);
      onClose();
    } catch {
      setError('Terjadi gangguan jaringan saat menghubungi server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-800">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="auth-modal-title"
                className="font-display text-lg font-bold text-zinc-900"
              >
                {needsSetup ? 'Atur Sandi Pengurus Awal' : 'Masuk Mode Pengurus'}
              </h2>
              <p className="text-xs text-zinc-500">
                STT Mertha Bhuna Sari · Br. Mantring
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Tutup jendela"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <p className="text-sm leading-relaxed text-zinc-600">
            {needsSetup
              ? 'Belum ada sandi pengurus yang ditetapkan. Buat sandi awal untuk mengelola data anggota, verifikasi pendaftaran, dan presensi kegiatan.'
              : 'Masukkan sandi pengurus untuk menambah, mengubah, atau memverifikasi data keanggotaan.'}
          </p>

          <div>
            <label
              htmlFor="pengurus-passcode"
              className="mb-1.5 block text-xs font-semibold text-zinc-700"
            >
              {needsSetup ? 'Sandi Pengurus Baru' : 'Sandi Pengurus'}
            </label>
            <input
              id="pengurus-passcode"
              type="password"
              required
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder={needsSetup ? 'Minimal 6 karakter' : 'Masukkan sandi'}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
            />
          </div>

          {needsSetup && (
            <div>
              <label
                htmlFor="pengurus-passcode-confirm"
                className="mb-1.5 block text-xs font-semibold text-zinc-700"
              >
                Konfirmasi Sandi Pengurus
              </label>
              <input
                id="pengurus-passcode-confirm"
                type="password"
                required
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                placeholder="Ulangi sandi pengurus"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-800/15"
              />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 whitespace-nowrap shrink-0"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-rose-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-900 disabled:opacity-60 whitespace-nowrap shrink-0"
            >
              {submitting
                ? 'Memproses...'
                : needsSetup
                  ? 'Simpan & Masuk'
                  : 'Masuk Pengurus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
