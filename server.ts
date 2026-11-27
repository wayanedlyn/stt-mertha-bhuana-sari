import crypto from 'crypto';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type {
  Activity,
  ActivityCategory,
  AttendanceStatus,
  Gender,
  Member,
  MemberStatus,
  OrganizationInfo,
  Registration,
  Seksi,
  Tempekan,
} from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'stt-db.json');

const SESSION_SECRET =
  process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 16
    ? process.env.SESSION_SECRET
    : crypto.randomBytes(32).toString('hex');

interface DbSchema {
  adminCredentialHash?: string;
  organization: OrganizationInfo;
  members: Member[];
  registrations: Registration[];
  activities: Activity[];
}

const VALID_GENDERS: Gender[] = ['Laki-laki', 'Perempuan'];
const VALID_TEMPEKAN: Tempekan[] = [
  'Tempekan Kaja',
  'Tempekan Tengah',
  'Tempekan Kelod',
];
const VALID_SEKSI: Seksi[] = [
  'Pengurus Inti',
  'Seksi Kerohanian & Adat',
  'Seksi Seni & Budaya',
  'Seksi Olahraga & Pemuda',
  'Seksi Humas & Dokumentasi',
  'Seksi Kebersihan & Lingkungan',
  'Anggota Umum',
];
const VALID_STATUS: MemberStatus[] = ['Aktif', 'Pasif', 'Purna Bakti'];
const VALID_ATTENDANCE: AttendanceStatus[] = ['Hadir', 'Izin', 'Sakit', 'Alpa'];
const VALID_CATEGORIES: ActivityCategory[] = [
  'Sangkep',
  'Ngayah',
  'Seni & Olahraga',
  'Gotong Royong',
];

function createSeedData(): DbSchema {
  const members: Member[] = [
    {
      id: 'm-001',
      nia: 'MBS-2021-001',
      nama: 'I Putu Agus Mahendra',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Gianyar',
      tanggalLahir: '2002-04-14',
      tempekan: 'Tempekan Kaja',
      alamat: 'Br. Mantring, Tampaksiring',
      noTelepon: '081936401122',
      pendidikanPekerjaan: 'Mahasiswa S1 Teknik Informatika',
      seksi: 'Pengurus Inti',
      jabatan: 'Ketua STT',
      status: 'Aktif',
      tahunGabung: 2021,
      fotoUrl: '/src/assets/images/avatar_ketua_1795747368324.jpg',
      updatedAt: '2026-11-10T09:00:00.000Z',
    },
    {
      id: 'm-002',
      nia: 'MBS-2021-002',
      nama: 'I Made Bagus Pratama',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Gianyar',
      tanggalLahir: '2002-09-23',
      tempekan: 'Tempekan Tengah',
      alamat: 'Br. Mantring, Tampaksiring',
      noTelepon: '081936401189',
      pendidikanPekerjaan: 'Karyawan Pariwisata Ubud',
      seksi: 'Pengurus Inti',
      jabatan: 'Wakil Ketua',
      status: 'Aktif',
      tahunGabung: 2021,
      updatedAt: '2026-11-10T09:00:00.000Z',
    },
    {
      id: 'm-003',
      nia: 'MBS-2022-003',
      nama: 'Ni Luh Putu Ayu Saraswati',
      jenisKelamin: 'Perempuan',
      tempatLahir: 'Gianyar',
      tanggalLahir: '2003-06-18',
      tempekan: 'Tempekan Kelod',
      alamat: 'Br. Mantring, Tampaksiring',
      noTelepon: '085738120045',
      pendidikanPekerjaan: 'Mahasiswi Manajemen',
      seksi: 'Pengurus Inti',
      jabatan: 'Sekretaris I',
      status: 'Aktif',
      tahunGabung: 2022,
      fotoUrl: '/src/assets/images/avatar_sekretaris_1795747369575.jpg',
      updatedAt: '2026-11-10T09:00:00.000Z',
    },
    {
      id: 'm-004',
      nia: 'MBS-2022-004',
      nama: 'Ni Made Dwi Lestari',
      jenisKelamin: 'Perempuan',
      tempatLahir: 'Tampaksiring',
      tanggalLahir: '2004-02-11',
      tempekan: 'Tempekan Kaja',
      alamat: 'Br. Mantring, Tampaksiring',
      noTelepon: '081239871144',
      pendidikanPekerjaan: 'Mahasiswi Pendidikan Bahasa Bali',
      seksi: 'Pengurus Inti',
      jabatan: 'Sekretaris II',
      status: 'Aktif',
      tahunGabung: 2022,
      updatedAt: '2026-11-10T09:00:00.000Z',
    },
    {
      id: 'm-005',
      nia: 'MBS-2021-005',
      nama: 'I Komang Adi Wirawan',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Gianyar',
      tanggalLahir: '2001-11-05',
      tempekan: 'Tempekan Tengah',
      alamat: 'Br. Mantring, Tampaksiring',
      noTelepon: '081999310421',
      pendidikanPekerjaan: 'Pengrajin Ukiran Kayu',
      seksi: 'Seksi Kerohanian & Adat',
      jabatan: 'Koordinator Seksi',
      status: 'Aktif',
      tahunGabung: 2021,
      updatedAt: '2026-11-10T09:00:00.000Z',
    },
    {
      id: 'm-006',
      nia: 'MBS-2022-006',
      nama: 'I Wayan Yoga Permana',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Gianyar',
      tanggalLahir: '2003-01-29',
      tempekan: 'Tempekan Kelod',
      alamat: 'Br. Mantring, Tampaksiring',
      noTelepon: '087861224510',
      pendidikanPekerjaan: 'Seniman Tabuh & Tari',
      seksi: 'Seksi Seni & Budaya',
      jabatan: 'Koordinator Seksi',
      status: 'Aktif',
      tahunGabung: 2022,
      updatedAt: '2026-11-10T09:00:00.000Z',
    },
    {
      id: 'm-007',
      nia: 'MBS-2023-007',
      nama: 'I Kadek Arya Kusuma',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Gianyar',
      tanggalLahir: '2005-07-08',
      tempekan: 'Tempekan Kaja',
      alamat: 'Br. Mantring, Tampaksiring',
      noTelepon: '085857234102',
      pendidikanPekerjaan: 'Mahasiswa Keolahragaan',
      seksi: 'Seksi Olahraga & Pemuda',
      jabatan: 'Koordinator Seksi',
      status: 'Aktif',
      tahunGabung: 2023,
      updatedAt: '2026-11-10T09:00:00.000Z',
    },
    {
      id: 'm-008',
      nia: 'MBS-2023-008',
      nama: 'Ni Ketut Sri Wahyuni',
      jenisKelamin: 'Perempuan',
      tempatLahir: 'Gianyar',
      tanggalLahir: '2004-10-19',
      tempekan: 'Tempekan Tengah',
      alamat: 'Br. Mantring, Tampaksiring',
      noTelepon: '081337901234',
      pendidikanPekerjaan: 'Desainer Grafis Freelance',
      seksi: 'Seksi Humas & Dokumentasi',
      jabatan: 'Koordinator Seksi',
      status: 'Aktif',
      tahunGabung: 2023,
      updatedAt: '2026-11-10T09:00:00.000Z',
    },
    {
      id: 'm-009',
      nia: 'MBS-2024-009',
      nama: 'I Putu Gede Surya Dinata',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Tampaksiring',
      tanggalLahir: '2006-03-12',
      tempekan: 'Tempekan Kelod',
      alamat: 'Br. Mantring, Tampaksiring',
      noTelepon: '081936782210',
      pendidikanPekerjaan: 'Siswa SMK Negeri Tampaksiring',
      seksi: 'Seksi Kebersihan & Lingkungan',
      jabatan: 'Koordinator Seksi',
      status: 'Aktif',
      tahunGabung: 2024,
      updatedAt: '2026-11-10T09:00:00.000Z',
    },
    {
      id: 'm-010',
      nia: 'MBS-2024-010',
      nama: 'Ni Wayan Melati Putri',
      jenisKelamin: 'Perempuan',
      tempatLahir: 'Gianyar',
      tanggalLahir: '2006-08-27',
      tempekan: 'Tempekan Kaja',
      alamat: 'Br. Mantring, Tampaksiring',
      noTelepon: '085739001822',
      pendidikanPekerjaan: 'Siswi SMA Negeri 1 Tampaksiring',
      seksi: 'Seksi Seni & Budaya',
      jabatan: 'Anggota',
      status: 'Aktif',
      tahunGabung: 2024,
      updatedAt: '2026-11-10T09:00:00.000Z',
    },
    {
      id: 'm-011',
      nia: 'MBS-2025-011',
      nama: 'I Made Bayu Saputra',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Gianyar',
      tanggalLahir: '2007-05-03',
      tempekan: 'Tempekan Tengah',
      alamat: 'Br. Mantring, Tampaksiring',
      noTelepon: '081246778899',
      pendidikanPekerjaan: 'Siswa SMK Pariwisata',
      seksi: 'Seksi Olahraga & Pemuda',
      jabatan: 'Anggota',
      status: 'Aktif',
      tahunGabung: 2025,
      updatedAt: '2026-11-10T09:00:00.000Z',
    },
    {
      id: 'm-012',
      nia: 'MBS-2022-012',
      nama: 'I Nyoman Krisna Wiguna',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Gianyar',
      tanggalLahir: '2003-12-16',
      tempekan: 'Tempekan Kelod',
      alamat: 'Br. Mantring, Tampaksiring',
      noTelepon: '087761123098',
      pendidikanPekerjaan: 'Bekerja di Kapal Pesiar (Cuti)',
      seksi: 'Anggota Umum',
      jabatan: 'Anggota',
      status: 'Pasif',
      tahunGabung: 2022,
      catatanStatus: 'Bekerja di luar negeri (kontrak berlayar)',
      updatedAt: '2026-11-10T09:00:00.000Z',
    },
    {
      id: 'm-013',
      nia: 'MBS-2020-013',
      nama: 'Ni Luh Komang Indah Permatasari',
      jenisKelamin: 'Perempuan',
      tempatLahir: 'Gianyar',
      tanggalLahir: '2000-02-20',
      tempekan: 'Tempekan Tengah',
      alamat: 'Br. Mantring, Tampaksiring',
      noTelepon: '081805442100',
      pendidikanPekerjaan: 'Staf Administrasi',
      seksi: 'Seksi Kerohanian & Adat',
      jabatan: 'Anggota',
      status: 'Purna Bakti',
      tahunGabung: 2020,
      catatanStatus: 'Purna bakti karena menikah (Nganten) Agustus 2026',
      updatedAt: '2026-11-10T09:00:00.000Z',
    },
    {
      id: 'm-014',
      nia: 'MBS-2025-014',
      nama: 'Ni Kadek Cintya Dewi',
      jenisKelamin: 'Perempuan',
      tempatLahir: 'Gianyar',
      tanggalLahir: '2007-09-14',
      tempekan: 'Tempekan Kaja',
      alamat: 'Br. Mantring, Tampaksiring',
      noTelepon: '085941220391',
      pendidikanPekerjaan: 'Siswi SMA Negeri 1 Tampaksiring',
      seksi: 'Seksi Humas & Dokumentasi',
      jabatan: 'Anggota',
      status: 'Aktif',
      tahunGabung: 2025,
      updatedAt: '2026-11-10T09:00:00.000Z',
    },
  ];

  const registrations: Registration[] = [
    {
      id: 'reg-001',
      nama: 'I Komang Wahyu Darmawan',
      jenisKelamin: 'Laki-laki',
      tempatLahir: 'Gianyar',
      tanggalLahir: '2008-03-19',
      tempekan: 'Tempekan Tengah',
      alamat: 'Jl. Raya Mantring No. 18, Br. Mantring, Tampaksiring',
      noTelepon: '081938884412',
      pendidikanPekerjaan: 'Siswa SMA Negeri 1 Tampaksiring',
      minatSeksi: 'Seksi Seni & Budaya',
      statusVerifikasi: 'Menunggu',
      submittedAt: '2026-11-24T10:15:00.000Z',
    },
    {
      id: 'reg-002',
      nama: 'Ni Putu Anggita Maharani',
      jenisKelamin: 'Perempuan',
      tempatLahir: 'Gianyar',
      tanggalLahir: '2008-07-02',
      tempekan: 'Tempekan Kelod',
      alamat: 'Br. Mantring Kelod, Tampaksiring',
      noTelepon: '085792114088',
      pendidikanPekerjaan: 'Siswi SMK Kesehatan Gianyar',
      minatSeksi: 'Seksi Kerohanian & Adat',
      statusVerifikasi: 'Menunggu',
      submittedAt: '2026-11-25T14:40:00.000Z',
    },
  ];

  const activities: Activity[] = [
    {
      id: 'act-001',
      judul: 'Sangkep Rutin Sasih Kanem & Pendataan Anggota Baru',
      kategori: 'Sangkep',
      tanggal: '2026-11-29',
      waktu: '18:30 WITA',
      lokasi: 'Bale Banjar Mantring, Tampaksiring',
      deskripsi:
        'Rapat bulanan membahas persiapan agenda akhir tahun, pembagian tugas ngayah, dan pengukuhan calon anggota baru STT Mertha Bhuna Sari.',
      presensi: {
        'm-001': 'Hadir',
        'm-002': 'Hadir',
        'm-003': 'Hadir',
        'm-004': 'Hadir',
        'm-005': 'Hadir',
        'm-006': 'Hadir',
        'm-007': 'Izin',
        'm-008': 'Hadir',
        'm-009': 'Hadir',
        'm-010': 'Hadir',
        'm-011': 'Hadir',
        'm-014': 'Sakit',
      },
    },
    {
      id: 'act-002',
      judul: 'Ngayah Persiapan Odalan Pura Dalem Mantring',
      kategori: 'Ngayah',
      tanggal: '2026-12-06',
      waktu: '07:30 WITA',
      lokasi: 'Pura Dalem Banjar Mantring',
      deskripsi:
        'Gotong royong penjor, pemasangan wastra, dan penataan sarana upacara bersama krama adat Banjar Mantring.',
      presensi: {
        'm-001': 'Hadir',
        'm-002': 'Hadir',
        'm-003': 'Hadir',
        'm-004': 'Hadir',
        'm-005': 'Hadir',
        'm-006': 'Hadir',
        'm-007': 'Hadir',
        'm-008': 'Hadir',
        'm-009': 'Hadir',
        'm-010': 'Hadir',
        'm-011': 'Izin',
        'm-014': 'Hadir',
      },
    },
    {
      id: 'act-003',
      judul: 'Latihan Tabuh Bleganjur & Tari Rejang',
      kategori: 'Seni & Olahraga',
      tanggal: '2026-12-12',
      waktu: '17:00 WITA',
      lokasi: 'Wantilan Banjar Mantring',
      deskripsi:
        'Latihan rutin seksi seni budaya untuk persiapan pementasan seni desa adat Tampaksiring.',
      presensi: {
        'm-001': 'Hadir',
        'm-003': 'Hadir',
        'm-006': 'Hadir',
        'm-010': 'Hadir',
        'm-014': 'Hadir',
      },
    },
    {
      id: 'act-004',
      judul: 'Gotong Royong Kebersihan Telajakan & Bale Banjar',
      kategori: 'Gotong Royong',
      tanggal: '2026-12-20',
      waktu: '07:00 WITA',
      lokasi: 'Lingkungan Br. Mantring, Tampaksiring',
      deskripsi:
        'Kerja bakti pembersihan saluran air, telajakan jalan banjar, dan penataan halaman Balai Banjar Mantring.',
      presensi: {},
    },
  ];

  return {
    organization: {
      nama: 'STT Mertha Bhuna Sari',
      banjar: 'Banjar Mantring',
      desa: 'Desa Tampaksiring',
      kecamatan: 'Kecamatan Tampaksiring',
      kabupaten: 'Kabupaten Gianyar, Bali',
      periodeBakti: '2024 – 2027',
      sekretariat: 'Bale Banjar Mantring, Jl. Raya Tampaksiring, Gianyar',
    },
    members,
    registrations,
    activities,
  };
}

function loadDb(): DbSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const seed = createSeedData();
    saveDb(seed);
    return seed;
  }
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(raw) as DbSchema;
}

function saveDb(db: DbSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
}

function hashPasscode(passcode: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(passcode, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPasscodeHash(passcode: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  const derived = crypto.scryptSync(passcode, salt, 64);
  const storedKey = Buffer.from(keyHex, 'hex');
  if (derived.length !== storedKey.length) return false;
  return crypto.timingSafeEqual(derived, storedKey);
}

function verifyEnvPasscode(input: string, envPasscode: string): boolean {
  const a = Buffer.from(input, 'utf-8');
  const b = Buffer.from(envPasscode, 'utf-8');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function signToken(): string {
  const payload = Buffer.from(
    JSON.stringify({
      role: 'pengurus',
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60 * 12,
    }),
    'utf-8'
  ).toString('base64url');
  const sig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${sig}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  const a = Buffer.from(sig, 'utf-8');
  const b = Buffer.from(expectedSig, 'utf-8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const parsed = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf-8')
    ) as { exp?: number; role?: string };
    return (
      parsed.role === 'pengurus' &&
      typeof parsed.exp === 'number' &&
      parsed.exp > Date.now()
    );
  } catch {
    return false;
  }
}

function extractBearer(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return undefined;
  return header.slice(7).trim();
}

function requirePengurusAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = extractBearer(req);
  if (!verifyToken(token)) {
    res.status(401).json({
      error:
        'Akses pengurus diperlukan. Silakan masuk sebagai Pengurus terlebih dahulu.',
    });
    return;
  }
  next();
}

function cleanString(value: unknown, maxLen = 160): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

function generateNextNia(members: Member[], year: number): string {
  const prefix = `MBS-${year}-`;
  let maxSeq = members.length;
  for (const m of members) {
    const parts = m.nia.split('-');
    const last = Number.parseInt(parts[parts.length - 1] || '0', 10);
    if (!Number.isNaN(last) && last > maxSeq) {
      maxSeq = last;
    }
  }
  return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  // Ensure DB is initialized on startup
  loadDb();

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/auth/status', (req, res) => {
    const db = loadDb();
    const envPass = process.env.PENGURUS_PASSCODE?.trim() || '';
    const token = extractBearer(req);
    res.json({
      envConfigured: envPass.length > 0,
      hasClaimedPassword: Boolean(db.adminCredentialHash),
      authenticated: verifyToken(token),
    });
  });

  app.post('/api/auth/setup', (req, res) => {
    const envPass = process.env.PENGURUS_PASSCODE?.trim() || '';
    if (envPass.length > 0) {
      res.status(403).json({
        error:
          'Sandi pengurus sudah dikonfigurasi melalui pengaturan lingkungan server.',
      });
      return;
    }
    const db = loadDb();
    if (db.adminCredentialHash) {
      res.status(409).json({
        error: 'Sandi pengurus awal sudah pernah dibuat. Silakan gunakan menu Masuk.',
      });
      return;
    }
    const passcode = cleanString(req.body?.passcode, 100);
    if (passcode.length < 6) {
      res.status(400).json({
        error: 'Sandi pengurus minimal terdiri dari 6 karakter.',
      });
      return;
    }
    db.adminCredentialHash = hashPasscode(passcode);
    saveDb(db);
    res.status(201).json({ token: signToken(), authenticated: true });
  });

  app.post('/api/auth/login', (req, res) => {
    const passcode = cleanString(req.body?.passcode, 100);
    if (!passcode) {
      res.status(400).json({ error: 'Sandi pengurus wajib diisi.' });
      return;
    }
    const envPass = process.env.PENGURUS_PASSCODE?.trim() || '';
    if (envPass.length > 0) {
      if (!verifyEnvPasscode(passcode, envPass)) {
        res.status(401).json({ error: 'Sandi pengurus tidak sesuai.' });
        return;
      }
      res.json({ token: signToken(), authenticated: true });
      return;
    }
    const db = loadDb();
    if (!db.adminCredentialHash) {
      res.status(409).json({
        error: 'Sandi pengurus awal belum dibuat.',
        needsSetup: true,
      });
      return;
    }
    if (!verifyPasscodeHash(passcode, db.adminCredentialHash)) {
      res.status(401).json({ error: 'Sandi pengurus tidak sesuai.' });
      return;
    }
    res.json({ token: signToken(), authenticated: true });
  });

  app.get('/api/state', (_req, res) => {
    const db = loadDb();
    res.json({
      organization: db.organization,
      members: db.members,
      registrations: db.registrations,
      activities: db.activities,
    });
  });

  // Public self-registration for new youth in Br. Mantring
  app.post('/api/registrations', (req, res) => {
    const nama = cleanString(req.body?.nama, 120);
    const jenisKelamin = req.body?.jenisKelamin as Gender;
    const tempatLahir = cleanString(req.body?.tempatLahir, 80);
    const tanggalLahir = cleanString(req.body?.tanggalLahir, 20);
    const tempekan = req.body?.tempekan as Tempekan;
    const alamat = cleanString(req.body?.alamat, 200);
    const noTelepon = cleanString(req.body?.noTelepon, 30);
    const pendidikanPekerjaan = cleanString(req.body?.pendidikanPekerjaan, 120);
    const minatSeksi = req.body?.minatSeksi as Seksi;

    if (
      !nama ||
      !VALID_GENDERS.includes(jenisKelamin) ||
      !tempatLahir ||
      !/^\d{4}-\d{2}-\d{2}$/.test(tanggalLahir) ||
      !VALID_TEMPEKAN.includes(tempekan) ||
      !alamat ||
      !noTelepon ||
      !pendidikanPekerjaan ||
      !VALID_SEKSI.includes(minatSeksi)
    ) {
      res.status(400).json({
        error: 'Lengkapi seluruh data pendaftaran calon anggota dengan format yang valid.',
      });
      return;
    }

    const db = loadDb();
    const newReg: Registration = {
      id: `reg-${crypto.randomUUID().slice(0, 8)}`,
      nama,
      jenisKelamin,
      tempatLahir,
      tanggalLahir,
      tempekan,
      alamat,
      noTelepon,
      pendidikanPekerjaan,
      minatSeksi,
      statusVerifikasi: 'Menunggu',
      submittedAt: new Date().toISOString(),
    };
    db.registrations.unshift(newReg);
    saveDb(db);
    res.status(201).json(newReg);
  });

  // Protected Pengurus Member CRUD
  app.post('/api/members', requirePengurusAuth, (req, res) => {
    const nama = cleanString(req.body?.nama, 120);
    const jenisKelamin = req.body?.jenisKelamin as Gender;
    const tempatLahir = cleanString(req.body?.tempatLahir, 80);
    const tanggalLahir = cleanString(req.body?.tanggalLahir, 20);
    const tempekan = req.body?.tempekan as Tempekan;
    const alamat = cleanString(req.body?.alamat, 200);
    const noTelepon = cleanString(req.body?.noTelepon, 30);
    const pendidikanPekerjaan = cleanString(req.body?.pendidikanPekerjaan, 120);
    const seksi = req.body?.seksi as Seksi;
    const jabatan = cleanString(req.body?.jabatan, 80) || 'Anggota';
    const status = (req.body?.status as MemberStatus) || 'Aktif';
    const tahunGabungRaw = Number(req.body?.tahunGabung);
    const tahunGabung =
      Number.isInteger(tahunGabungRaw) && tahunGabungRaw >= 2000 && tahunGabungRaw <= 2035
        ? tahunGabungRaw
        : new Date().getFullYear();
    const catatanStatus = cleanString(req.body?.catatanStatus, 200);

    if (
      !nama ||
      !VALID_GENDERS.includes(jenisKelamin) ||
      !tempatLahir ||
      !/^\d{4}-\d{2}-\d{2}$/.test(tanggalLahir) ||
      !VALID_TEMPEKAN.includes(tempekan) ||
      !alamat ||
      !noTelepon ||
      !pendidikanPekerjaan ||
      !VALID_SEKSI.includes(seksi) ||
      !VALID_STATUS.includes(status)
    ) {
      res.status(400).json({
        error: 'Data anggota tidak lengkap atau tidak valid.',
      });
      return;
    }

    const db = loadDb();
    const nia =
      cleanString(req.body?.nia, 32) || generateNextNia(db.members, tahunGabung);

    const newMember: Member = {
      id: `m-${crypto.randomUUID().slice(0, 8)}`,
      nia,
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
      catatanStatus: catatanStatus || undefined,
      updatedAt: new Date().toISOString(),
    };

    db.members.push(newMember);
    saveDb(db);
    res.status(201).json(newMember);
  });

  app.put('/api/members/:id', requirePengurusAuth, (req, res) => {
    const db = loadDb();
    const idx = db.members.findIndex((m) => m.id === req.params.id);
    if (idx === -1) {
      res.status(404).json({ error: 'Data anggota tidak ditemukan.' });
      return;
    }

    const existing = db.members[idx];
    const nama = cleanString(req.body?.nama, 120) || existing.nama;
    const jenisKelamin = VALID_GENDERS.includes(req.body?.jenisKelamin)
      ? (req.body.jenisKelamin as Gender)
      : existing.jenisKelamin;
    const tempatLahir =
      cleanString(req.body?.tempatLahir, 80) || existing.tempatLahir;
    const tanggalLahir = /^\d{4}-\d{2}-\d{2}$/.test(req.body?.tanggalLahir || '')
      ? String(req.body.tanggalLahir)
      : existing.tanggalLahir;
    const tempekan = VALID_TEMPEKAN.includes(req.body?.tempekan)
      ? (req.body.tempekan as Tempekan)
      : existing.tempekan;
    const alamat = cleanString(req.body?.alamat, 200) || existing.alamat;
    const noTelepon = cleanString(req.body?.noTelepon, 30) || existing.noTelepon;
    const pendidikanPekerjaan =
      cleanString(req.body?.pendidikanPekerjaan, 120) ||
      existing.pendidikanPekerjaan;
    const seksi = VALID_SEKSI.includes(req.body?.seksi)
      ? (req.body.seksi as Seksi)
      : existing.seksi;
    const jabatan = cleanString(req.body?.jabatan, 80) || existing.jabatan;
    const status = VALID_STATUS.includes(req.body?.status)
      ? (req.body.status as MemberStatus)
      : existing.status;
    const tahunGabungRaw = Number(req.body?.tahunGabung);
    const tahunGabung =
      Number.isInteger(tahunGabungRaw) && tahunGabungRaw >= 2000 && tahunGabungRaw <= 2035
        ? tahunGabungRaw
        : existing.tahunGabung;
    const catatanStatus =
      req.body?.catatanStatus !== undefined
        ? cleanString(req.body.catatanStatus, 200)
        : existing.catatanStatus;

    const updated: Member = {
      ...existing,
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
      catatanStatus: catatanStatus || undefined,
      updatedAt: new Date().toISOString(),
    };

    db.members[idx] = updated;
    saveDb(db);
    res.json(updated);
  });

  app.delete('/api/members/:id', requirePengurusAuth, (req, res) => {
    const db = loadDb();
    const before = db.members.length;
    db.members = db.members.filter((m) => m.id !== req.params.id);
    if (db.members.length === before) {
      res.status(404).json({ error: 'Data anggota tidak ditemukan.' });
      return;
    }
    for (const act of db.activities) {
      delete act.presensi[req.params.id];
    }
    saveDb(db);
    res.json({ deleted: true });
  });

  // Approve or reject pending registration
  app.post('/api/registrations/:id/approve', requirePengurusAuth, (req, res) => {
    const db = loadDb();
    const reg = db.registrations.find((r) => r.id === req.params.id);
    if (!reg) {
      res.status(404).json({ error: 'Pendaftaran tidak ditemukan.' });
      return;
    }
    if (reg.statusVerifikasi !== 'Menunggu') {
      res.status(400).json({ error: 'Pendaftaran ini sudah diproses sebelumnya.' });
      return;
    }

    const currentYear = new Date().getFullYear();
    const newMember: Member = {
      id: `m-${crypto.randomUUID().slice(0, 8)}`,
      nia: generateNextNia(db.members, currentYear),
      nama: reg.nama,
      jenisKelamin: reg.jenisKelamin,
      tempatLahir: reg.tempatLahir,
      tanggalLahir: reg.tanggalLahir,
      tempekan: reg.tempekan,
      alamat: reg.alamat,
      noTelepon: reg.noTelepon,
      pendidikanPekerjaan: reg.pendidikanPekerjaan,
      seksi: reg.minatSeksi,
      jabatan: 'Anggota',
      status: 'Aktif',
      tahunGabung: currentYear,
      updatedAt: new Date().toISOString(),
    };

    reg.statusVerifikasi = 'Diterima';
    reg.catatanPengurus = `Diterima dengan NIA ${newMember.nia}`;
    db.members.push(newMember);
    saveDb(db);
    res.json({ registration: reg, member: newMember });
  });

  app.post('/api/registrations/:id/reject', requirePengurusAuth, (req, res) => {
    const db = loadDb();
    const reg = db.registrations.find((r) => r.id === req.params.id);
    if (!reg) {
      res.status(404).json({ error: 'Pendaftaran tidak ditemukan.' });
      return;
    }
    if (reg.statusVerifikasi !== 'Menunggu') {
      res.status(400).json({ error: 'Pendaftaran ini sudah diproses sebelumnya.' });
      return;
    }
    reg.statusVerifikasi = 'Ditolak';
    reg.catatanPengurus =
      cleanString(req.body?.catatanPengurus, 200) || 'Belum memenuhi syarat banjar.';
    saveDb(db);
    res.json({ registration: reg });
  });

  // Activities & Attendance
  app.post('/api/activities', requirePengurusAuth, (req, res) => {
    const judul = cleanString(req.body?.judul, 160);
    const kategori = req.body?.kategori as ActivityCategory;
    const tanggal = cleanString(req.body?.tanggal, 20);
    const waktu = cleanString(req.body?.waktu, 40) || '18:00 WITA';
    const lokasi =
      cleanString(req.body?.lokasi, 160) || 'Bale Banjar Mantring, Tampaksiring';
    const deskripsi = cleanString(req.body?.deskripsi, 400);

    if (
      !judul ||
      !VALID_CATEGORIES.includes(kategori) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(tanggal)
    ) {
      res.status(400).json({ error: 'Data kegiatan tidak valid.' });
      return;
    }

    const db = loadDb();
    const newAct: Activity = {
      id: `act-${crypto.randomUUID().slice(0, 8)}`,
      judul,
      kategori,
      tanggal,
      waktu,
      lokasi,
      deskripsi: deskripsi || 'Kegiatan resmi STT Mertha Bhuna Sari.',
      presensi: {},
    };
    db.activities.unshift(newAct);
    saveDb(db);
    res.status(201).json(newAct);
  });

  app.put('/api/activities/:id/attendance', requirePengurusAuth, (req, res) => {
    const db = loadDb();
    const act = db.activities.find((a) => a.id === req.params.id);
    if (!act) {
      res.status(404).json({ error: 'Agenda kegiatan tidak ditemukan.' });
      return;
    }
    const memberId = cleanString(req.body?.memberId, 40);
    const status = req.body?.status as AttendanceStatus;
    if (
      !memberId ||
      !db.members.some((m) => m.id === memberId) ||
      !VALID_ATTENDANCE.includes(status)
    ) {
      res.status(400).json({ error: 'Data presensi tidak valid.' });
      return;
    }
    act.presensi[memberId] = status;
    saveDb(db);
    res.json(act);
  });

  app.delete('/api/activities/:id', requirePengurusAuth, (req, res) => {
    const db = loadDb();
    const before = db.activities.length;
    db.activities = db.activities.filter((a) => a.id !== req.params.id);
    if (db.activities.length === before) {
      res.status(404).json({ error: 'Agenda kegiatan tidak ditemukan.' });
      return;
    }
    saveDb(db);
    res.json({ deleted: true });
  });

  // Vite dev middleware or static dist serving
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  const PORT = Number(process.env.PORT || 3000);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`STT Mertha Bhuna Sari server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
