import type { Member } from '../types';

const BULAN_ID = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

export function formatTanggalId(isoDate: string): string {
  if (!isoDate) return '-';
  const parts = isoDate.split('T')[0].split('-');
  if (parts.length !== 3) return isoDate;
  const year = parts[0];
  const monthIdx = Number.parseInt(parts[1], 10) - 1;
  const day = Number.parseInt(parts[2], 10);
  if (Number.isNaN(monthIdx) || monthIdx < 0 || monthIdx > 11 || Number.isNaN(day)) {
    return isoDate;
  }
  return `${day} ${BULAN_ID[monthIdx]} ${year}`;
}

export function hitungUsia(tanggalLahir: string): number {
  const dob = new Date(tanggalLahir);
  if (Number.isNaN(dob.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

export function getInitials(name: string): string {
  const cleaned = name
    .replace(/^(I|Ni)\s+(Putu|Wayan|Made|Nyoman|Komang|Ketut|Kadek|Luh|Gede)\s+/i, '')
    .trim();
  const words = (cleaned || name).split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'ST';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export function exportMembersCsv(members: Member[], filename = 'data-anggota-stt-mertha-bhuna-sari.csv'): void {
  const headers = [
    'NIA',
    'Nama Lengkap',
    'Jenis Kelamin',
    'Tempat Lahir',
    'Tanggal Lahir',
    'Tempekan',
    'Alamat',
    'No. Telepon',
    'Pendidikan / Pekerjaan',
    'Seksi / Bidang',
    'Jabatan',
    'Status Keanggotaan',
    'Tahun Bergabung',
    'Catatan',
  ];

  const escapeCsv = (val: string | number | undefined) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = members.map((m) =>
    [
      m.nia,
      m.nama,
      m.jenisKelamin,
      m.tempatLahir,
      m.tanggalLahir,
      m.tempekan,
      m.alamat,
      m.noTelepon,
      m.pendidikanPekerjaan,
      m.seksi,
      m.jabatan,
      m.status,
      m.tahunGabung,
      m.catatanStatus ?? '',
    ]
      .map(escapeCsv)
      .join(',')
  );

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
