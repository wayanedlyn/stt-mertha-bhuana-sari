import React, { useState } from 'react';
import { Check, Copy, Download, Printer } from 'lucide-react';
import { LARAVEL_BLUEPRINT_SNIPPETS } from '../data/laravelBlueprint';
import type { Activity, Member, OrganizationInfo } from '../types';
import { exportMembersCsv, formatTanggalId } from '../utils/format';

interface ReportsViewProps {
  organization: OrganizationInfo;
  members: Member[];
  activities: Activity[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  organization,
  members,
  activities,
}) => {
  const [subTab, setSubTab] = useState<'laporan' | 'laravel'>('laporan');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tempekanRows = (
    ['Tempekan Kaja', 'Tempekan Tengah', 'Tempekan Kelod'] as const
  ).map((t) => {
    const list = members.filter((m) => m.tempekan === t);
    return {
      tempekan: t,
      laki: list.filter((m) => m.jenisKelamin === 'Laki-laki' && m.status !== 'Purna Bakti').length,
      perempuan: list.filter((m) => m.jenisKelamin === 'Perempuan' && m.status !== 'Purna Bakti').length,
      aktif: list.filter((m) => m.status === 'Aktif').length,
      pasif: list.filter((m) => m.status === 'Pasif').length,
      purna: list.filter((m) => m.status === 'Purna Bakti').length,
      total: list.length,
    };
  });

  const handleCopy = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard may be blocked in restricted contexts
    }
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-900">
            Laporan & Blueprint Sistem
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Rekapitulasi data keanggotaan, kehadiran kegiatan, dan referensi
            arsitektur MVC Laravel
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-zinc-200/70 p-1">
          <button
            type="button"
            onClick={() => setSubTab('laporan')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'laporan'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Laporan Keanggotaan
          </button>
          <button
            type="button"
            onClick={() => setSubTab('laravel')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'laravel'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Blueprint Laravel MVC
          </button>
        </div>
      </div>

      {subTab === 'laporan' ? (
        <div className="space-y-6">
          <div className="no-print flex flex-wrap items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => exportMembersCsv(members)}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 whitespace-nowrap shrink-0"
            >
              <Download className="h-3.5 w-3.5" />
              Ekspor CSV Lengkap
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-800 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-900 whitespace-nowrap shrink-0"
            >
              <Printer className="h-3.5 w-3.5" />
              Cetak Laporan
            </button>
          </div>

          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="border-b border-zinc-200 pb-4">
              <h2 className="font-display text-lg font-bold text-zinc-900">
                Rekapitulasi Anggota per Tempekan
              </h2>
              <p className="text-xs text-zinc-500">
                {organization.nama} · {organization.banjar}, {organization.desa}{' '}
                · Periode {organization.periodeBakti}
              </p>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-600">
                    <th className="px-4 py-3">Tempekan</th>
                    <th className="px-4 py-3 text-right">Teruna (L)</th>
                    <th className="px-4 py-3 text-right">Teruni (P)</th>
                    <th className="px-4 py-3 text-right">Aktif</th>
                    <th className="px-4 py-3 text-right">Pasif</th>
                    <th className="px-4 py-3 text-right">Purna Bakti</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 tabular-nums">
                  {tempekanRows.map((row) => (
                    <tr key={row.tempekan}>
                      <td className="px-4 py-3 font-semibold text-zinc-900">
                        {row.tempekan}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-zinc-700">
                        {row.laki}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-zinc-700">
                        {row.perempuan}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-700">
                        {row.aktif}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-amber-700">
                        {row.pasif}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-zinc-500">
                        {row.purna}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-zinc-900">
                        {row.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-6">
            <div className="border-b border-zinc-200 pb-4">
              <h2 className="font-display text-lg font-bold text-zinc-900">
                Rekapitulasi Kehadiran Sangkep & Ngayah
              </h2>
              <p className="text-xs text-zinc-500">
                Ringkasan partisipasi anggota pada agenda resmi organisasi
              </p>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-600">
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Agenda Kegiatan</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3 text-right">Hadir</th>
                    <th className="px-4 py-3 text-right">Izin / Sakit</th>
                    <th className="px-4 py-3 text-right">Alpa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 tabular-nums">
                  {activities.map((act) => {
                    const vals = Object.values(act.presensi);
                    const hadir = vals.filter((v) => v === 'Hadir').length;
                    const izinSakit = vals.filter(
                      (v) => v === 'Izin' || v === 'Sakit'
                    ).length;
                    const alpa = vals.filter((v) => v === 'Alpa').length;
                    return (
                      <tr key={act.id}>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-600 whitespace-nowrap">
                          {formatTanggalId(act.tanggal)}
                        </td>
                        <td className="px-4 py-3 font-medium text-zinc-900">
                          {act.judul}
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-600">
                          {act.kategori}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-700">
                          {hadir}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-amber-700">
                          {izinSakit}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-red-700">
                          {alpa}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="font-display text-base font-bold text-zinc-900">
              Referensi Struktur Kode Laravel 11 (Khusus Keanggotaan)
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Rancangan skema database, Eloquent model, controller, dan routes
              Laravel untuk sistem informasi keanggotaan STT Mertha Bhuna Sari
              yang selaras dengan modul pada aplikasi ini (tanpa tabel kas atau
              iuran).
            </p>
          </div>

          {LARAVEL_BLUEPRINT_SNIPPETS.map((item) => (
            <section
              key={item.id}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
            >
              <div className="flex flex-col justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-5 py-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-display text-sm font-bold text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="font-mono text-xs text-zinc-500">
                    {item.filePath}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600">{item.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(item.id, item.code)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 whitespace-nowrap shrink-0"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-700" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Salin Kode
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto bg-zinc-950 p-5 font-mono text-xs leading-relaxed text-zinc-100">
                <code>{item.code}</code>
              </pre>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
