export interface LaravelSnippet {
  id: string;
  title: string;
  filePath: string;
  description: string;
  code: string;
}

export const LARAVEL_BLUEPRINT_SNIPPETS: LaravelSnippet[] = [
  {
    id: 'migrations',
    title: 'Database Migrations (Tanpa Tabel Kas & Iuran)',
    filePath: 'database/migrations/2026_01_01_000001_create_keanggotaan_tables.php',
    description:
      'Skema relasional MySQL/PostgreSQL untuk tabel anggota, pendaftaran_anggota, kegiatan, dan presensi tanpa modul kas atau iuran.',
    code: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('anggota', function (Blueprint $table) {
            $table->id();
            $table->string('nia', 24)->unique();
            $table->string('nama', 120);
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
            $table->string('tempat_lahir', 80);
            $table->date('tanggal_lahir');
            $table->enum('tempekan', ['Tempekan Kaja', 'Tempekan Tengah', 'Tempekan Kelod']);
            $table->string('alamat', 200);
            $table->string('no_telepon', 24);
            $table->string('pendidikan_pekerjaan', 120);
            $table->string('seksi', 80);
            $table->string('jabatan', 80)->default('Anggota');
            $table->enum('status', ['Aktif', 'Pasif', 'Purna Bakti'])->default('Aktif');
            $table->year('tahun_gabung');
            $table->string('catatan_status', 200)->nullable();
            $table->timestamps();
        });

        Schema::create('pendaftaran_anggota', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 120);
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
            $table->string('tempat_lahir', 80);
            $table->date('tanggal_lahir');
            $table->enum('tempekan', ['Tempekan Kaja', 'Tempekan Tengah', 'Tempekan Kelod']);
            $table->string('alamat', 200);
            $table->string('no_telepon', 24);
            $table->string('pendidikan_pekerjaan', 120);
            $table->string('minat_seksi', 80);
            $table->enum('status_verifikasi', ['Menunggu', 'Diterima', 'Ditolak'])->default('Menunggu');
            $table->string('catatan_pengurus', 200)->nullable();
            $table->timestamps();
        });

        Schema::create('kegiatan', function (Blueprint $table) {
            $table->id();
            $table->string('judul', 160);
            $table->enum('kategori', ['Sangkep', 'Ngayah', 'Seni & Olahraga', 'Gotong Royong']);
            $table->date('tanggal');
            $table->string('waktu', 40);
            $table->string('lokasi', 160);
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });

        Schema::create('presensi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kegiatan_id')->constrained('kegiatan')->cascadeOnDelete();
            $table->foreignId('anggota_id')->constrained('anggota')->cascadeOnDelete();
            $table->enum('status_hadir', ['Hadir', 'Izin', 'Sakit', 'Alpa']);
            $table->timestamps();
            $table->unique(['kegiatan_id', 'anggota_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('presensi');
        Schema::dropIfExists('kegiatan');
        Schema::dropIfExists('pendaftaran_anggota');
        Schema::dropIfExists('anggota');
    }
};`,
  },
  {
    id: 'model',
    title: 'Eloquent Model Anggota & Relasi Presensi',
    filePath: 'app/Models/Anggota.php',
    description:
      'Model Eloquent dengan scope filter tempekan/status, pembangkitan NIA otomatis, dan relasi ke presensi kegiatan.',
    code: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Anggota extends Model
{
    protected $table = 'anggota';

    protected $fillable = [
        'nia', 'nama', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir',
        'tempekan', 'alamat', 'no_telepon', 'pendidikan_pekerjaan',
        'seksi', 'jabatan', 'status', 'tahun_gabung', 'catatan_status',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tahun_gabung' => 'integer',
    ];

    public function presensi(): HasMany
    {
        return $this->hasMany(Presensi::class, 'anggota_id');
    }

    public static function generateNia(int $tahun): string
    {
        $count = static::where('tahun_gabung', $tahun)->count() + 1;
        return sprintf('MBS-%d-%03d', $tahun, $count);
    }
}`,
  },
  {
    id: 'controller',
    title: 'Resource Controller Keanggotaan & Verifikasi',
    filePath: 'app/Http/Controllers/AnggotaController.php',
    description:
      'Controller Laravel untuk manajemen anggota, verifikasi pendaftaran baru, serta ekspor laporan keanggotaan.',
    code: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Anggota;
use App\\Models\\PendaftaranAnggota;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;

class AnggotaController extends Controller
{
    public function index(Request $request)
    {
        $query = Anggota::query()
            ->when($request->search, fn ($q, $s) =>
                $q->where('nama', 'like', "%{$s}%")->orWhere('nia', 'like', "%{$s}%")
            )
            ->when($request->status, fn ($q, $st) => $q->where('status', $st))
            ->when($request->tempekan, fn ($q, $t) => $q->where('tempekan', $t));

        return view('anggota.index', [
            'anggota' => $query->orderBy('nia')->paginate(20),
        ]);
    }

    public function approveRegistration(PendaftaranAnggota $pendaftaran)
    {
        DB::transaction(function () use ($pendaftaran) {
            $tahun = now()->year;
            $nia = Anggota::generateNia($tahun);

            Anggota::create([
                'nia' => $nia,
                'nama' => $pendaftaran->nama,
                'jenis_kelamin' => $pendaftaran->jenis_kelamin,
                'tempat_lahir' => $pendaftaran->tempat_lahir,
                'tanggal_lahir' => $pendaftaran->tanggal_lahir,
                'tempekan' => $pendaftaran->tempekan,
                'alamat' => $pendaftaran->alamat,
                'no_telepon' => $pendaftaran->no_telepon,
                'pendidikan_pekerjaan' => $pendaftaran->pendidikan_pekerjaan,
                'seksi' => $pendaftaran->minat_seksi,
                'jabatan' => 'Anggota',
                'status' => 'Aktif',
                'tahun_gabung' => $tahun,
            ]);

            $pendaftaran->update([
                'status_verifikasi' => 'Diterima',
                'catatan_pengurus' => "Diterima dengan NIA {$nia}",
            ]);
        });

        return back()->with('success', 'Calon anggota berhasil disahkan.');
    }
}`,
  },
  {
    id: 'routes',
    title: 'Web Routes (routes/web.php)',
    filePath: 'routes/web.php',
    description:
      'Definisi routing aplikasi berbasis role (publik untuk pendaftaran calon anggota, middleware auth untuk pengurus STT).',
    code: `<?php

use App\\Http\\Controllers\\AnggotaController;
use App\\Http\\Controllers\\KegiatanController;
use App\\Http\\Controllers\\PendaftaranController;
use Illuminate\\Support\\Facades\\Route;

Route::get('/', [AnggotaController::class, 'dashboard'])->name('beranda');
Route::get('/pendaftaran', [PendaftaranController::class, 'create'])->name('pendaftaran.create');
Route::post('/pendaftaran', [PendaftaranController::class, 'store'])->name('pendaftaran.store');

Route::middleware(['auth'])->group(function () {
    Route::resource('anggota', AnggotaController::class);
    Route::post('/pendaftaran/{pendaftaran}/approve', [AnggotaController::class, 'approveRegistration'])
        ->name('pendaftaran.approve');
    Route::resource('kegiatan', KegiatanController::class);
    Route::put('/kegiatan/{kegiatan}/presensi', [KegiatanController::class, 'simpanPresensi'])
        ->name('kegiatan.presensi');
});`,
  },
];
