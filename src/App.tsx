import React, { useCallback, useEffect, useState } from 'react';
import {
  Award,
  CalendarDays,
  FileSpreadsheet,
  LayoutDashboard,
  Lock,
  LogOut,
  Menu,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { ActivitiesView } from './components/ActivitiesView';
import { AuthModal } from './components/AuthModal';
import { DashboardView } from './components/DashboardView';
import { KtaModal } from './components/KtaModal';
import { LeadershipView } from './components/LeadershipView';
import { MemberFormModal } from './components/MemberFormModal';
import { MembersView } from './components/MembersView';
import { RegistrationView } from './components/RegistrationView';
import { ReportsView } from './components/ReportsView';
import type {
  ActivityCategory,
  AttendanceStatus,
  AuthStatus,
  Member,
  Registration,
  SttAppState,
} from './types';

type TabKey =
  | 'dashboard'
  | 'members'
  | 'registration'
  | 'leadership'
  | 'activities'
  | 'reports';

const NAV_ITEMS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
  { key: 'members', label: 'Data Anggota', icon: Users },
  { key: 'registration', label: 'Pendaftaran', icon: UserPlus },
  { key: 'leadership', label: 'Kepengurusan', icon: Award },
  { key: 'activities', label: 'Kegiatan & Presensi', icon: CalendarDays },
  { key: 'reports', label: 'Laporan & Blueprint', icon: FileSpreadsheet },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [state, setState] = useState<SttAppState | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Pengurus Bearer token stored strictly in React memory (never localStorage)
  const [authToken, setAuthToken] = useState<string>('');
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    envConfigured: false,
    hasClaimedPassword: false,
    authenticated: false,
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [ktaMember, setKtaMember] = useState<Member | null>(null);
  const [emblemFailed, setEmblemFailed] = useState(false);

  const [toast, setToast] = useState<string>('');

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? '' : prev));
    }, 3200);
  }, []);

  const fetchAllData = useCallback(async (tokenOverride?: string) => {
    const activeToken = tokenOverride ?? authToken;
    try {
      const [stateRes, authRes] = await Promise.all([
        fetch('/api/state'),
        fetch('/api/auth/status', {
          headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
        }),
      ]);

      if (!stateRes.ok) {
        throw new Error('Gagal memuat data keanggotaan dari server.');
      }
      const stateData = (await stateRes.json()) as SttAppState;
      setState(stateData);

      if (authRes.ok) {
        const authData = (await authRes.json()) as AuthStatus;
        setAuthStatus(authData);
        if (!authData.authenticated && activeToken) {
          setAuthToken('');
        }
      }
      setLoadError('');
    } catch (err) {
      setLoadError(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat memuat sistem.'
      );
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    void fetchAllData();
  }, [fetchAllData]);

  const authHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    return headers;
  }, [authToken]);

  const handleAuthenticated = async (token: string) => {
    setAuthToken(token);
    await fetchAllData(token);
    showToast('Mode Pengurus aktif. Anda kini dapat mengelola data.');
  };

  const handleLogout = () => {
    setAuthToken('');
    setAuthStatus((prev) => ({ ...prev, authenticated: false }));
    showToast('Keluar dari mode pengurus.');
  };

  const handleSaveMember = async (
    payload: Partial<Member>
  ): Promise<string | null> => {
    const isEdit = Boolean(payload.id);
    const url = isEdit ? `/api/members/${payload.id}` : '/api/members';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) setAuthModalOpen(true);
        return data.error || 'Gagal menyimpan data anggota.';
      }
      await fetchAllData();
      showToast(
        isEdit
          ? `Data ${data.nama} berhasil diperbarui.`
          : `Anggota baru ${data.nama} (${data.nia}) ditambahkan.`
      );
      return null;
    } catch {
      return 'Gagal menghubungi server.';
    }
  };

  const handleDeleteMember = async (member: Member) => {
    const res = await fetch(`/api/members/${member.id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.ok) {
      await fetchAllData();
      showToast(`Data anggota ${member.nama} telah dihapus.`);
    } else if (res.status === 401) {
      setAuthModalOpen(true);
    }
  };

  const handleSubmitRegistration = async (
    payload: Omit<Registration, 'id' | 'statusVerifikasi' | 'submittedAt'>
  ): Promise<string | null> => {
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return data.error || 'Pendaftaran gagal dikirim.';
      }
      await fetchAllData();
      showToast('Pendaftaran calon anggota berhasil dikirim.');
      return null;
    } catch {
      return 'Gagal menghubungi server.';
    }
  };

  const handleApproveRegistration = async (id: string) => {
    const res = await fetch(`/api/registrations/${id}/approve`, {
      method: 'POST',
      headers: authHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      await fetchAllData();
      showToast(
        `${data.member.nama} disahkan sebagai anggota aktif (${data.member.nia}).`
      );
    } else if (res.status === 401) {
      setAuthModalOpen(true);
    }
  };

  const handleRejectRegistration = async (id: string) => {
    const res = await fetch(`/api/registrations/${id}/reject`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({}),
    });
    if (res.ok) {
      await fetchAllData();
      showToast('Pengajuan pendaftaran ditolak.');
    } else if (res.status === 401) {
      setAuthModalOpen(true);
    }
  };

  const handleCreateActivity = async (payload: {
    judul: string;
    kategori: ActivityCategory;
    tanggal: string;
    waktu: string;
    lokasi: string;
    deskripsi: string;
  }): Promise<string | null> => {
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) setAuthModalOpen(true);
        return data.error || 'Gagal membuat agenda.';
      }
      await fetchAllData();
      showToast(`Agenda "${data.judul}" berhasil ditambahkan.`);
      return null;
    } catch {
      return 'Gagal menghubungi server.';
    }
  };

  const handleMarkAttendance = async (
    activityId: string,
    memberId: string,
    status: AttendanceStatus
  ) => {
    const res = await fetch(`/api/activities/${activityId}/attendance`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ memberId, status }),
    });
    if (res.ok) {
      const updatedActivity = await res.json();
      setState((prev) =>
        prev
          ? {
              ...prev,
              activities: prev.activities.map((a) =>
                a.id === activityId ? updatedActivity : a
              ),
            }
          : prev
      );
    } else if (res.status === 401) {
      setAuthModalOpen(true);
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    const res = await fetch(`/api/activities/${activityId}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.ok) {
      await fetchAllData();
      showToast('Agenda kegiatan dihapus.');
    } else if (res.status === 401) {
      setAuthModalOpen(true);
    }
  };

  const activeNavLabel =
    NAV_ITEMS.find((n) => n.key === activeTab)?.label || 'Beranda';
  const pendingCount =
    state?.registrations.filter((r) => r.statusVerifikasi === 'Menunggu')
      .length ?? 0;

  return (
    <div className="min-h-screen bg-[#F7F8F9] text-zinc-900 lg:flex">
      {/* Desktop Sidebar */}
      <aside className="no-print hidden w-[264px] shrink-0 flex-col justify-between border-r border-zinc-200 bg-white lg:flex">
        <div>
          <div className="flex items-center gap-3 border-b border-zinc-200 px-5 py-4">
            {!emblemFailed ? (
              <img
                src="/src/assets/images/stt_emblem_1795747368051.jpg"
                alt="Lambang STT Mertha Bhuna Sari"
                referrerPolicy="no-referrer"
                onError={() => setEmblemFailed(true)}
                className="h-9 w-9 shrink-0 rounded-lg border border-zinc-200 object-contain p-0.5"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-800 text-xs font-bold text-white">
                MBS
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold text-zinc-900">
                STT Mertha Bhuna Sari
              </p>
              <p className="truncate text-xs text-zinc-500">
                Br. Mantring, Tampaksiring
              </p>
            </div>
          </div>

          <nav className="space-y-1 p-3" aria-label="Menu utama">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveTab(item.key)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-rose-800 text-white'
                      : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-zinc-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </span>
                  {item.key === 'registration' && pendingCount > 0 && (
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        isActive ? 'text-rose-100' : 'text-rose-800 font-semibold'
                      }`}
                    >
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-zinc-100 p-4 text-xs text-zinc-500">
          <p className="font-semibold text-zinc-700">Sistem Keanggotaan</p>
          <p className="mt-0.5">Fokus data anggota, seksi, & presensi.</p>
          <p className="mt-2 font-mono text-[11px] text-zinc-400">
            Desa Tampaksiring · Gianyar
          </p>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="no-print fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-zinc-950/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex w-72 max-w-[85vw] flex-col justify-between bg-white p-4 shadow-xl">
            <div>
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <span className="font-display text-sm font-bold text-zinc-900">
                  STT Mertha Bhuna Sari
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100"
                  aria-label="Tutup menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.key);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                        isActive
                          ? 'bg-rose-800 text-white'
                          : 'text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </span>
                      {item.key === 'registration' && pendingCount > 0 && (
                        <span className="font-mono text-xs tabular-nums">
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
            <p className="border-t border-zinc-100 pt-3 text-xs text-zinc-500">
              Br. Mantring, Tampaksiring, Gianyar
            </p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar Contract */}
        <header className="no-print sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-zinc-200 bg-white px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 lg:hidden"
              aria-label="Buka navigasi"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="hidden truncate font-medium text-zinc-500 sm:inline">
                STT Mertha Bhuna Sari
              </span>
              <span className="hidden text-zinc-300 sm:inline" aria-hidden="true">
                /
              </span>
              <span className="truncate font-semibold text-zinc-900">
                {activeNavLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {authStatus.authenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 whitespace-nowrap shrink-0"
              >
                <LogOut className="h-3.5 w-3.5 text-emerald-700" />
                Keluar Pengurus
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 whitespace-nowrap shrink-0"
              >
                <Lock className="h-3.5 w-3.5" />
                Masuk Pengurus
              </button>
            )}
          </div>
        </header>

        {/* Viewport Body */}
        <main className="mx-auto w-full max-w-[1200px] flex-1 p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="space-y-6">
              <div className="h-52 animate-pulse rounded-xl border border-zinc-200 bg-white" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-28 animate-pulse rounded-xl border border-zinc-200 bg-white"
                  />
                ))}
              </div>
              <div className="h-64 animate-pulse rounded-xl border border-zinc-200 bg-white" />
            </div>
          ) : loadError || !state ? (
            <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
              <h2 className="font-display text-lg font-bold text-zinc-900">
                Gagal Memuat Data Keanggotaan
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                {loadError || 'Server tidak memberikan respons.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  void fetchAllData();
                }}
                className="mt-4 rounded-lg bg-rose-800 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-900"
              >
                Muat Ulang
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  organization={state.organization}
                  members={state.members}
                  registrations={state.registrations}
                  activities={state.activities}
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'members' && (
                <MembersView
                  members={state.members}
                  isPengurus={authStatus.authenticated}
                  onRequireAuth={() => setAuthModalOpen(true)}
                  onAddMember={() => {
                    setEditingMember(null);
                    setMemberModalOpen(true);
                  }}
                  onEditMember={(m) => {
                    setEditingMember(m);
                    setMemberModalOpen(true);
                  }}
                  onViewKta={(m) => setKtaMember(m)}
                  onDeleteMember={handleDeleteMember}
                />
              )}

              {activeTab === 'registration' && (
                <RegistrationView
                  registrations={state.registrations}
                  isPengurus={authStatus.authenticated}
                  onRequireAuth={() => setAuthModalOpen(true)}
                  onSubmitRegistration={handleSubmitRegistration}
                  onApprove={handleApproveRegistration}
                  onReject={handleRejectRegistration}
                />
              )}

              {activeTab === 'leadership' && (
                <LeadershipView
                  organization={state.organization}
                  members={state.members}
                  onViewKta={(m) => setKtaMember(m)}
                />
              )}

              {activeTab === 'activities' && (
                <ActivitiesView
                  activities={state.activities}
                  members={state.members}
                  isPengurus={authStatus.authenticated}
                  onRequireAuth={() => setAuthModalOpen(true)}
                  onCreateActivity={handleCreateActivity}
                  onMarkAttendance={handleMarkAttendance}
                  onDeleteActivity={handleDeleteActivity}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsView
                  organization={state.organization}
                  members={state.members}
                  activities={state.activities}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Toast Feedback */}
      {toast && (
        <div
          role="status"
          className="no-print fixed bottom-5 right-5 z-50 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      )}

      {/* Modals */}
      <AuthModal
        open={authModalOpen}
        authStatus={authStatus}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />

      <MemberFormModal
        open={memberModalOpen}
        initialMember={editingMember}
        onClose={() => setMemberModalOpen(false)}
        onSave={handleSaveMember}
      />

      {state && (
        <KtaModal
          member={ktaMember}
          organization={state.organization}
          onClose={() => setKtaMember(null)}
        />
      )}
    </div>
  );
}
