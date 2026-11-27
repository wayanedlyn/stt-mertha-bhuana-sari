export type Gender = 'Laki-laki' | 'Perempuan';

export type Tempekan =
  | 'Tempekan Kaja'
  | 'Tempekan Tengah'
  | 'Tempekan Kelod';

export type Seksi =
  | 'Pengurus Inti'
  | 'Seksi Kerohanian & Adat'
  | 'Seksi Seni & Budaya'
  | 'Seksi Olahraga & Pemuda'
  | 'Seksi Humas & Dokumentasi'
  | 'Seksi Kebersihan & Lingkungan'
  | 'Anggota Umum';

export type MemberStatus = 'Aktif' | 'Pasif' | 'Purna Bakti';

export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';

export type ActivityCategory =
  | 'Sangkep'
  | 'Ngayah'
  | 'Seni & Olahraga'
  | 'Gotong Royong';

export interface Member {
  id: string;
  nia: string;
  nama: string;
  jenisKelamin: Gender;
  tempatLahir: string;
  tanggalLahir: string;
  tempekan: Tempekan;
  alamat: string;
  noTelepon: string;
  pendidikanPekerjaan: string;
  seksi: Seksi;
  jabatan: string;
  status: MemberStatus;
  tahunGabung: number;
  catatanStatus?: string;
  fotoUrl?: string;
  updatedAt: string;
}

export interface Registration {
  id: string;
  nama: string;
  jenisKelamin: Gender;
  tempatLahir: string;
  tanggalLahir: string;
  tempekan: Tempekan;
  alamat: string;
  noTelepon: string;
  pendidikanPekerjaan: string;
  minatSeksi: Seksi;
  statusVerifikasi: 'Menunggu' | 'Diterima' | 'Ditolak';
  submittedAt: string;
  catatanPengurus?: string;
}

export interface Activity {
  id: string;
  judul: string;
  kategori: ActivityCategory;
  tanggal: string;
  waktu: string;
  lokasi: string;
  deskripsi: string;
  presensi: Record<string, AttendanceStatus>;
}

export interface OrganizationInfo {
  nama: string;
  banjar: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  periodeBakti: string;
  sekretariat: string;
}

export interface AuthStatus {
  envConfigured: boolean;
  hasClaimedPassword: boolean;
  authenticated: boolean;
}

export interface SttAppState {
  organization: OrganizationInfo;
  members: Member[];
  registrations: Registration[];
  activities: Activity[];
}
