import React, { useState } from 'react';
import { Printer, X } from 'lucide-react';
import type { Member, OrganizationInfo } from '../types';
import { formatTanggalId, getInitials } from '../utils/format';

interface KtaModalProps {
  member: Member | null;
  organization: OrganizationInfo;
  onClose: () => void;
}

export const KtaModal: React.FC<KtaModalProps> = ({
  member,
  organization,
  onClose,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [emblemFailed, setEmblemFailed] = useState(false);

  if (!member) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kta-modal-title"
    >
      <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
        <div className="no-print flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2
              id="kta-modal-title"
              className="font-display text-lg font-bold text-zinc-900"
            >
              Kartu Tanda Anggota Digital
            </h2>
            <p className="text-xs text-zinc-500">
              Pratinjau KTA Resmi · {organization.nama}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700"
            aria-label="Tutup KTA"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-900 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              {!emblemFailed ? (
                <img
                  src="/src/assets/images/stt_emblem_1795747368051.jpg"
                  alt="Lambang STT Mertha Bhuna Sari"
                  referrerPolicy="no-referrer"
                  onError={() => setEmblemFailed(true)}
                  className="h-10 w-10 rounded-lg bg-white object-contain p-0.5"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-800 text-xs font-bold text-white">
                  MBS
                </div>
              )}
              <div>
                <p className="font-display text-sm font-bold tracking-tight">
                  {organization.nama}
                </p>
                <p className="text-xs text-zinc-300">
                  {organization.banjar} · {organization.desa}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs font-medium text-rose-300 tabular-nums">
                {member.nia}
              </span>
              <p className="text-[11px] text-zinc-400">
                Periode {organization.periodeBakti}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
            <div className="shrink-0">
              {member.fotoUrl && !imgFailed ? (
                <img
                  src={member.fotoUrl}
                  alt={member.nama}
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="h-24 w-24 rounded-lg border border-zinc-200 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-100 font-display text-xl font-bold text-zinc-700">
                  {getInitials(member.nama)}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <h3 className="font-display text-base font-bold text-zinc-900">
                  {member.nama}
                </h3>
                <p className="text-xs font-medium text-rose-800">
                  {member.jabatan} · {member.seksi}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-zinc-100 pt-2.5 text-xs">
                <div>
                  <dt className="text-zinc-400">Tempekan</dt>
                  <dd className="font-medium text-zinc-800">{member.tempekan}</dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Status</dt>
                  <dd className="font-medium text-zinc-800">{member.status}</dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Tempat, Tgl Lahir</dt>
                  <dd className="font-medium text-zinc-800 tabular-nums">
                    {member.tempatLahir}, {formatTanggalId(member.tanggalLahir)}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Bergabung</dt>
                  <dd className="font-medium text-zinc-800 tabular-nums">
                    Tahun {member.tahunGabung}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50 px-5 py-2.5 text-[11px] text-zinc-500">
            <span>{organization.sekretariat}</span>
            <span className="font-mono tabular-nums">Sah sebagai identitas anggota</span>
          </div>
        </div>

        <div className="no-print mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 whitespace-nowrap shrink-0"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-900 whitespace-nowrap shrink-0"
          >
            <Printer className="h-4 w-4" />
            Cetak KTA
          </button>
        </div>
      </div>
    </div>
  );
};
