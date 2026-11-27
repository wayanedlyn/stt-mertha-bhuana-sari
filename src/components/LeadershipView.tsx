import React, { useState } from 'react';
import { IdCard } from 'lucide-react';
import type { Member, OrganizationInfo, Seksi } from '../types';
import { getInitials } from '../utils/format';

interface LeadershipViewProps {
  organization: OrganizationInfo;
  members: Member[];
  onViewKta: (member: Member) => void;
}

const SEKSI_ORDER: Seksi[] = [
  'Seksi Kerohanian & Adat',
  'Seksi Seni & Budaya',
  'Seksi Olahraga & Pemuda',
  'Seksi Humas & Dokumentasi',
  'Seksi Kebersihan & Lingkungan',
  'Anggota Umum',
];

const SEKSI_DESCRIPTIONS: Record<Seksi, string> = {
  'Pengurus Inti':
    'Koordinasi organisasi, pelaksanaan sangkep banjar, serta administrasi kesekretariatan.',
  'Seksi Kerohanian & Adat':
    'Pengelolaan jadwal ngayah pura, sarana upacara adat, dan kegiatan keagamaan.',
  'Seksi Seni & Budaya':
    'Pembinaan tabuh bleganjur, tari tradisional, serta karya kreatif ogoh-ogoh.',
  'Seksi Olahraga & Pemuda':
    'Pelatihan olahraga kepemudaan, turnamen antar-banjar, dan kegiatan rekreasi.',
  'Seksi Humas & Dokumentasi':
    'Publikasi agenda banjar, dokumentasi kegiatan, serta komunikasi antar-lembaga.',
  'Seksi Kebersihan & Lingkungan':
    'Pelaksanaan gotong royong kebersihan telajakan, balai banjar, dan lingkungan.',
  'Anggota Umum':
    'Anggota teruna-teruni aktif dalam setiap kegiatan gotong royong dan sangkep.',
};

export const LeadershipView: React.FC<LeadershipViewProps> = ({
  organization,
  members,
  onViewKta,
}) => {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const pengurusInti = members.filter(
    (m) => m.seksi === 'Pengurus Inti' && m.status !== 'Purna Bakti'
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-bold text-zinc-900">
            Struktur Kepengurusan & Seksi
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Susunan Pengurus Inti dan Koordinator Seksi {organization.nama} ·
            Periode {organization.periodeBakti}
          </p>
        </div>
        <p className="font-mono text-xs text-zinc-500 tabular-nums">
          {members.filter((m) => m.status === 'Aktif').length} Anggota Aktif
        </p>
      </div>

      {/* Pengurus Inti */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="border-b border-zinc-100 pb-4">
          <h2 className="font-display text-base font-bold text-zinc-900">
            Pengurus Inti
          </h2>
          <p className="text-xs text-zinc-500">
            {SEKSI_DESCRIPTIONS['Pengurus Inti']}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pengurusInti.map((leader) => (
            <div
              key={leader.id}
              className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50/40 p-4"
            >
              <div>
                <div className="flex items-center gap-3">
                  {leader.fotoUrl && !failedImages[leader.id] ? (
                    <img
                      src={leader.fotoUrl}
                      alt={leader.nama}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedImages((prev) => ({ ...prev, [leader.id]: true }))
                      }
                      className="h-12 w-12 rounded-lg border border-zinc-200 object-cover shrink-0"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white font-display text-sm font-bold text-zinc-700">
                      {getInitials(leader.nama)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-rose-800">
                      {leader.jabatan}
                    </p>
                    <h3 className="truncate font-display text-sm font-bold text-zinc-900">
                      {leader.nama}
                    </h3>
                  </div>
                </div>

                <div className="mt-3 space-y-1 border-t border-zinc-200/70 pt-3 text-xs text-zinc-600">
                  <p className="font-mono text-zinc-500 tabular-nums">
                    {leader.nia}
                  </p>
                  <p>{leader.tempekan}</p>
                  <p className="truncate">{leader.pendidikanPekerjaan}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onViewKta(leader)}
                className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                <IdCard className="h-3.5 w-3.5" />
                Lihat KTA
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Seksi / Bidang */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SEKSI_ORDER.map((seksiName) => {
          const seksiMembers = members.filter(
            (m) => m.seksi === seksiName && m.status !== 'Purna Bakti'
          );
          const coordinator = seksiMembers.find((m) =>
            m.jabatan.toLowerCase().includes('koordinator')
          );

          return (
            <div
              key={seksiName}
              className="rounded-xl border border-zinc-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-3">
                <div>
                  <h3 className="font-display text-base font-bold text-zinc-900">
                    {seksiName}
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {SEKSI_DESCRIPTIONS[seksiName]}
                  </p>
                </div>
                <span className="font-mono text-xs font-semibold text-zinc-700 tabular-nums whitespace-nowrap shrink-0">
                  {seksiMembers.length} orang
                </span>
              </div>

              {coordinator && (
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Koordinator Seksi</span>
                  <span className="font-semibold text-rose-800">
                    {coordinator.nama}
                  </span>
                </div>
              )}

              <ul className="mt-3 divide-y divide-zinc-100 text-xs">
                {seksiMembers.length === 0 ? (
                  <li className="py-3 text-zinc-400">
                    Belum ada anggota pada seksi ini.
                  </li>
                ) : (
                  seksiMembers.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <span className="font-medium text-zinc-800">
                          {m.nama}
                        </span>
                        <span className="ml-2 text-zinc-400">
                          · {m.tempekan}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onViewKta(m)}
                        className="font-mono text-[11px] text-zinc-500 hover:text-rose-800 tabular-nums"
                      >
                        {m.nia}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          );
        })}
      </section>
    </div>
  );
};
