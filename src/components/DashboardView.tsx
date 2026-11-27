import React, { useState } from 'react';
import { ArrowRight, Calendar, UserCheck, UserPlus, Users } from 'lucide-react';
import type { Activity, Member, OrganizationInfo, Registration } from '../types';
import { formatTanggalId } from '../utils/format';

interface DashboardViewProps {
  organization: OrganizationInfo;
  members: Member[];
  registrations: Registration[];
  activities: Activity[];
  onNavigate: (
    tab: 'dashboard' | 'members' | 'registration' | 'leadership' | 'activities' | 'reports'
  ) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  organization,
  members,
  registrations,
  activities,
  onNavigate,
}) => {
  const [bannerFailed, setBannerFailed] = useState(false);

  const totalMembers = members.length;
  const activeMembers = members.filter((m) => m.status === 'Aktif').length;
  const purnaMembers = members.filter((m) => m.status === 'Purna Bakti').length;
  const pendingRegs = registrations.filter(
    (r) => r.statusVerifikasi === 'Menunggu'
  );

  const maleCount = members.filter(
    (m) => m.status !== 'Purna Bakti' && m.jenisKelamin === 'Laki-laki'
  ).length;
  const femaleCount = members.filter(
    (m) => m.status !== 'Purna Bakti' && m.jenisKelamin === 'Perempuan'
  ).length;

  const tempekanCounts = (
    ['Tempekan Kaja', 'Tempekan Tengah', 'Tempekan Kelod'] as const
  ).map((name) => ({
    name,
    count: members.filter((m) => m.tempekan === name && m.status === 'Aktif').length,
  }));

  const seksiList = Array.from(new Set(members.map((m) => m.seksi)));
  const seksiCounts = seksiList
    .map((name) => ({
      name,
      count: members.filter((m) => m.seksi === name && m.status !== 'Purna Bakti')
        .length,
    }))
    .sort((a, b) => b.count - a.count);

  const upcomingActivities = [...activities]
    .sort((a, b) => a.tanggal.localeCompare(b.tanggal))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Hero Banner Split */}
      <section className="grid grid-cols-1 items-stretch overflow-hidden rounded-xl border border-zinc-200 bg-white lg:grid-cols-12">
        <div className="flex flex-col justify-between p-6 lg:col-span-7 lg:p-8">
          <div>
            <p className="text-xs font-medium text-rose-800">
              {organization.banjar} · {organization.desa} · {organization.kabupaten}
            </p>
            <h1 className="mt-2 max-w-xl font-display text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl [text-wrap:balance]">
              Pusat Data Keanggotaan {organization.nama}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600">
              Pengelolaan terpadu identitas teruna-teruni, struktur kepengurusan
              seksi, pendaftaran anggota baru, serta agenda dan presensi kegiatan
              sangkep maupun ngayah di Banjar Mantring.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('members')}
              className="inline-flex items-center gap-2 rounded-lg bg-rose-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-900 whitespace-nowrap shrink-0"
            >
              Lihat Direktori Anggota
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('registration')}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 whitespace-nowrap shrink-0"
            >
              Formulir Anggota Baru
            </button>
          </div>
        </div>

        <div className="relative min-h-[220px] bg-zinc-900 lg:col-span-5">
          {!bannerFailed ? (
            <img
              src="/src/assets/images/br_mantring_banner_1795747368625.jpg"
              alt="Kegiatan Sekaa Teruna Teruni di Bale Banjar Mantring, Tampaksiring"
              referrerPolicy="no-referrer"
              onError={() => setBannerFailed(true)}
              className="h-full w-full object-cover lg:h-full"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 p-6 text-center text-white">
              <Users className="h-8 w-8 text-rose-400" />
              <p className="mt-2 font-display text-sm font-semibold">
                Bale Banjar Mantring
              </p>
              <p className="text-xs text-zinc-400">Periode Bakti {organization.periodeBakti}</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
            <div>
              <p className="text-xs text-zinc-200">Sekretariat Organisasi</p>
              <p className="text-sm font-semibold">{organization.sekretariat}</p>
            </div>
            <span className="font-mono text-xs text-zinc-200 tabular-nums">
              {organization.periodeBakti}
            </span>
          </div>
        </div>
      </section>

      {/* 4-Column KPI Strip */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Total Terdaftar</span>
            <Users className="h-4 w-4 text-zinc-400" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-zinc-900 tabular-nums">
            {totalMembers}
          </p>
          <p className="mt-1 text-xs text-zinc-500 tabular-nums">
            {maleCount} Teruna · {femaleCount} Teruni (Aktif/Pasif)
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Anggota Aktif</span>
            <UserCheck className="h-4 w-4 text-emerald-700" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-zinc-900 tabular-nums">
            {activeMembers}
          </p>
          <p className="mt-1 text-xs text-emerald-700 tabular-nums">
            {totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0}% dari seluruh data
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Pendaftar Menunggu</span>
            <UserPlus className="h-4 w-4 text-amber-700" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-zinc-900 tabular-nums">
            {pendingRegs.length}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {pendingRegs.length > 0
              ? 'Perlu verifikasi pengurus'
              : 'Semua pendaftaran telah diproses'}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Purna Bakti & Agenda</span>
            <Calendar className="h-4 w-4 text-zinc-400" />
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-zinc-900 tabular-nums">
            {activities.length}
          </p>
          <p className="mt-1 text-xs text-zinc-500 tabular-nums">
            Agenda tercatat · {purnaMembers} anggota purna bakti
          </p>
        </div>
      </section>

      {/* Distribution & Agenda Split */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h2 className="font-display text-base font-bold text-zinc-900">
                Sebaran Wilayah Tempekan
              </h2>
              <p className="text-xs text-zinc-500">
                Anggota aktif berdasarkan tempekan Br. Mantring
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {tempekanCounts.map((item) => {
              const pct =
                activeMembers > 0 ? Math.round((item.count / activeMembers) * 100) : 0;
              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-zinc-800">{item.name}</span>
                    <span className="font-mono text-xs text-zinc-600 tabular-nums">
                      {item.count} anggota ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-rose-800 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-zinc-100 pt-5">
            <h3 className="text-xs font-semibold text-zinc-700">
              Komposisi Seksi Kepengurusan
            </h3>
            <dl className="mt-3 divide-y divide-zinc-100 text-sm">
              {seksiCounts.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between py-2 text-xs"
                >
                  <dt className="text-zinc-600">{s.name}</dt>
                  <dd className="font-mono font-medium text-zinc-900 tabular-nums">
                    {s.count}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <div>
              <h2 className="font-display text-base font-bold text-zinc-900">
                Agenda Kegiatan & Presensi Terdekat
              </h2>
              <p className="text-xs text-zinc-500">
                Jadwal sangkep, ngayah, latihan seni, dan gotong royong
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('activities')}
              className="text-xs font-semibold text-rose-800 hover:text-rose-900 whitespace-nowrap shrink-0"
            >
              Kelola Agenda
            </button>
          </div>

          <div className="divide-y divide-zinc-100">
            {upcomingActivities.map((act) => {
              const hadirCount = Object.values(act.presensi).filter(
                (v) => v === 'Hadir'
              ).length;
              const recordedCount = Object.keys(act.presensi).length;
              return (
                <div
                  key={act.id}
                  className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span className="font-medium text-rose-800">{act.kategori}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {formatTanggalId(act.tanggal)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{act.waktu}</span>
                    </div>
                    <h3 className="mt-1 font-display text-sm font-semibold text-zinc-900">
                      {act.judul}
                    </h3>
                    <p className="mt-0.5 text-xs text-zinc-500">{act.lokasi}</p>
                  </div>

                  <div className="shrink-0 text-left sm:text-right">
                    <p className="font-mono text-sm font-semibold text-zinc-900 tabular-nums">
                      {hadirCount} Hadir
                    </p>
                    <p className="text-xs text-zinc-500 tabular-nums">
                      {recordedCount > 0
                        ? `dari ${recordedCount} tercatat`
                        : 'Presensi belum diisi'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {pendingRegs.length > 0 && (
            <div className="mt-4 flex flex-col justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {pendingRegs.length} Calon Anggota Menunggu Verifikasi
                </p>
                <p className="text-xs text-zinc-600">
                  {pendingRegs.map((r) => r.nama).join(', ')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('registration')}
                className="rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 whitespace-nowrap shrink-0"
              >
                Tinjau Pendaftar
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
