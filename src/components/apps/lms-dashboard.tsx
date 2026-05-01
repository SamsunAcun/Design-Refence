import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../utils/cn"
import {
  IconBook2, IconChartBar, IconCheckbox, IconClock,
  IconHome2, IconSearch, IconTrophy, IconSchool,
  IconBell, IconChevronRight, IconPlayerPlay,
  IconUsers, IconCalendar, IconFlame, IconStar,
  IconBookmark, IconSettings, IconLogout,
  IconLayoutSidebar, IconSun, IconMoon, IconDroplet,
  IconUser, IconLock, IconWorld, IconBellRinging, IconPencil, IconCamera,
} from "@tabler/icons-react"
import PerfectScrollbar from "react-perfect-scrollbar"
import { Button } from "../apps/settings/components/button"
import { SettingsItemIcon } from "../apps/settings/components/settings-item-icon"
import { useWindowFrameContext } from "../system/window-frame"
import { useSettingStore } from "../../stores/settings"

// ─── Data ────────────────────────────────────────────────────────────────────

const courses = [
  { id: 1, name: "React & TypeScript Mastery",     progress: 78, lessons: 24, completed: 19, instructor: "Sarah Chen",  category: "Frontend",      nextLesson: "Custom Hooks Deep Dive", emoji: "⚛️" },
  { id: 2, name: "Advanced TypeScript Patterns",   progress: 45, lessons: 18, completed: 8,  instructor: "Mark Rivers", category: "Language",      nextLesson: "Conditional Types",      emoji: "🔷" },
  { id: 3, name: "System Design Fundamentals",     progress: 92, lessons: 30, completed: 28, instructor: "Priya Sharma",category: "Architecture",  nextLesson: "Database Sharding",      emoji: "🏗️" },
  { id: 4, name: "UX Design Principles",           progress: 22, lessons: 20, completed: 4,  instructor: "Lena Müller", category: "Design",        nextLesson: "Color Theory",           emoji: "🎨" },
]

const assignments = [
  { id: 1, title: "Build a Custom Hook Library",    course: "React & TypeScript", due: "Hari ini",    urgent: true  },
  { id: 2, title: "Type-safe API Client",           course: "Advanced TypeScript", due: "Besok",      urgent: false },
  { id: 3, title: "Design a Scalable Cache Layer",  course: "System Design",       due: "Jum, 2 Mei", urgent: false },
  { id: 4, title: "Wireframe Redesign Exercise",    course: "UX Design",           due: "Sen, 5 Mei", urgent: false },
]

const stats = [
  { label: "Kursus Aktif", value: "4",   sub: "+1 bulan ini",   icon: IconBook2  },
  { label: "Jam Belajar",  value: "47",  sub: "Bulan ini",      icon: IconClock  },
  { label: "Streak",       value: "7",   sub: "Hari berturut",  icon: IconFlame  },
  { label: "XP Earned",    value: "2.4k",sub: "Total poin",     icon: IconTrophy },
]

const navItems = [
  { key: "home",         label: "Beranda",    icon: IconHome2    },
  { key: "courses",      label: "Kursus Saya",icon: IconBook2    },
  { key: "assignments",  label: "Tugas",      icon: IconCheckbox, badge: 2 },
  { key: "grades",       label: "Nilai",      icon: IconChartBar },
  { key: "calendar",     label: "Kalender",   icon: IconCalendar },
  { key: "community",    label: "Komunitas",  icon: IconUsers    },
  { key: "achievements", label: "Pencapaian", icon: IconTrophy   },
  { key: "settings",    label: "Pengaturan", icon: IconSettings  },
]

const weekData = [60, 85, 45, 100, 70, 30, 0]
const weekDays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

// ─── Shared sub-components ────────────────────────────────────────────────────

const ProgressRing = ({ progress, size = 44 }: { progress: number; size?: number }) => {
  const stroke = 3.5
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={stroke} className="stroke-os-foreground/10" />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (progress / 100) * circ }}
        transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
        className="stroke-os-accent"
      />
    </svg>
  )
}

const applyThemeColors = (t: 'light' | 'dark') => {
  const root = document.documentElement
  if (t === 'dark') {
    root.style.setProperty('--os-foreground', '0 0% 100%')
    root.style.setProperty('--os-surface', '0 0% 7%')
    root.style.setProperty('--os-surface-accessible', '0 0% 5%')
    root.style.setProperty('--os-tone', '0 0% 15%')
    root.style.setProperty('--os-black', '0 0% 2%')
  } else {
    root.style.setProperty('--os-foreground', '0 0% 0%')
    root.style.setProperty('--os-surface', '0 0% 98%')
    root.style.setProperty('--os-surface-accessible', '0 0% 94%')
    root.style.setProperty('--os-tone', '0 0% 88%')
    root.style.setProperty('--os-black', '0 0% 2%')
  }
}

const SidebarNav = ({
  activeNav, setActiveNav, onNavSelect
}: {
  activeNav: string
  setActiveNav: (k: string) => void
  onNavSelect?: () => void
}) => (
  <>
    <div className="mx-3 mb-3 p-3 rounded-xl bg-os-foreground/[0.06] border border-os-foreground/[0.08] shrink-0">
      <div className="flex items-center gap-2.5">
        <div className="size-8 rounded-full bg-gradient-to-br from-os-accent to-purple-light flex items-center justify-center shrink-0">
          <span className="text-[11px] font-bold text-white">SA</span>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-os-foreground truncate">Samsun A.</p>
          <p className="text-[10px] text-os-foreground/40 truncate">Student · Level 12</p>
        </div>
      </div>
    </div>

    <PerfectScrollbar className="flex-1 px-2">
      <p className="text-[9px] font-bold uppercase tracking-widest text-os-foreground/30 px-3 pb-1.5 pt-1">Menu</p>
      <div className="space-y-0.5">
        {navItems.map((item) => {
          const active = activeNav === item.key
          return (
            <button
              key={item.key}
              onClick={() => { setActiveNav(item.key); onNavSelect?.() }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150",
                active
                  ? "bg-os-accent/15 text-os-accent"
                  : "text-os-foreground/60 hover:text-os-foreground hover:bg-os-foreground/[0.06]"
              )}
            >
              <SettingsItemIcon
                icon={item.icon} size={13}
                className={cn("shrink-0", active ? "bg-os-accent text-white" : "bg-os-foreground/10 text-os-foreground/60")}
              />
              <span className="text-xs font-medium flex-1 whitespace-nowrap">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-bold bg-red-light text-white rounded-full min-w-4 h-4 flex items-center justify-center px-1 shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </PerfectScrollbar>

    <div className="px-2 pb-2 pt-1.5 border-t border-os-foreground/[0.07] shrink-0">
      <Button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-light text-xs font-medium">
        <SettingsItemIcon icon={IconLogout} size={12} className="bg-red-light/10 text-red-light" />
        Keluar
      </Button>
    </div>
  </>
)

// Konten utama (dashboard body) yang sama untuk kedua mode
const DashboardBody = () => (
  <div className="max-w-6xl mx-auto px-3 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">

    {/* Welcome banner */}
    <motion.div
      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-os-accent/85 via-os-accent/70 to-purple-light/60 border border-white/10"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-8 -right-8 size-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-32 size-24 rounded-full bg-white/10 blur-2xl" />
      </div>
      <div className="relative flex items-center justify-between gap-6">
        <div>
          <p className="text-white/70 text-sm mb-1">Selamat datang kembali 👋</p>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Semangat belajar, Samsun!</h1>
          <p className="text-white/60 text-sm mt-1.5">Kamu punya 2 tugas yang segera jatuh tempo. Jaga terus streak-mu!</p>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
            <Button className="flex items-center gap-2 bg-white/25 text-white text-sm font-semibold px-4 py-2 rounded-xl">
              <IconPlayerPlay size={14} /> Lanjut Belajar
            </Button>
            <Button className="flex items-center gap-2 bg-white/10 text-white/80 text-sm px-4 py-2 rounded-xl">
              Lihat Tugas
            </Button>
          </div>
        </div>
        <div className="hidden md:flex flex-col items-center gap-1 shrink-0">
          <div className="text-4xl font-black text-white">78%</div>
          <p className="text-white/60 text-xs text-center">Rata-rata<br />progress kursus</p>
        </div>
      </div>
    </motion.div>

    {/* Stats */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 + i * 0.06, duration: 0.35 }}
          className="flex flex-col gap-2 p-3 sm:p-4 rounded-2xl bg-os-surface border border-os-foreground/[0.08] shadow-[0px_2px_8px_0px_hsl(var(--os-black)/.08)] hover:border-os-foreground/15 transition-all"
        >
          <div className="flex items-center justify-between">
            <SettingsItemIcon icon={stat.icon} size={13} className="bg-os-accent/15 text-os-accent" />
            <span className="text-[10px] text-os-foreground/40 font-medium truncate">{stat.sub}</span>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-os-foreground">{stat.value}</p>
          <p className="text-xs text-os-foreground/50">{stat.label}</p>
        </motion.div>
      ))}
    </div>

    {/* Main grid */}
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">

      {/* Courses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-os-foreground">Kursus Aktif</h2>
          <Button className="flex items-center gap-1 text-xs text-os-accent font-medium px-2 py-1 rounded-lg">
            Lihat semua <IconChevronRight size={13} />
          </Button>
        </div>
        <div className="grid gap-3">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
              className="group flex items-center gap-4 p-4 rounded-2xl bg-os-surface border border-os-foreground/[0.08] shadow-[0px_2px_8px_0px_hsl(var(--os-black)/.08)] hover:border-os-foreground/15 hover:bg-os-surface-accessible transition-all cursor-pointer"
            >
              <div className="relative shrink-0">
                <ProgressRing progress={course.progress} size={48} />
                <span className="absolute inset-0 flex items-center justify-center text-lg">{course.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-os-foreground truncate">{course.name}</p>
                    <p className="text-xs text-os-foreground/45 mt-0.5">{course.instructor} · {course.category}</p>
                  </div>
                  <span className="text-[10px] shrink-0 font-medium px-2 py-0.5 rounded-full bg-os-foreground/[0.07] text-os-foreground/50 border border-os-foreground/[0.08]">
                    {course.completed}/{course.lessons} pelajaran
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-os-foreground/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-os-accent"
                    initial={{ width: 0 }} animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.15 + i * 0.07 }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-[10px] text-os-foreground/35">Selanjutnya: {course.nextLesson}</p>
                  <div className="flex items-center gap-1 text-os-accent opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-medium">
                    <IconPlayerPlay size={11} /> Lanjutkan
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4">

        {/* Assignments */}
        <div className="rounded-2xl bg-os-surface border border-os-foreground/[0.08] shadow-[0px_2px_8px_0px_hsl(var(--os-black)/.08)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-os-foreground">Tugas</h2>
            <span className="text-[10px] font-bold bg-red-light/10 text-red-light border border-red-light/20 rounded-full px-2 py-0.5">
              {assignments.filter(a => a.urgent).length} hari ini
            </span>
          </div>
          <div className="space-y-0.5">
            {assignments.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.06 }}
                className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-os-foreground/[0.04] transition-colors cursor-pointer"
              >
                <div className={cn("size-2 rounded-full shrink-0", item.urgent ? "bg-red-light" : "bg-os-foreground/20")} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-os-foreground truncate">{item.title}</p>
                  <p className="text-[10px] text-os-foreground/40 mt-0.5 truncate">{item.course}</p>
                </div>
                <span className={cn(
                  "text-[10px] font-semibold shrink-0 px-2 py-0.5 rounded-full",
                  item.urgent ? "bg-red-light/10 text-red-light border border-red-light/20" : "bg-os-foreground/[0.06] text-os-foreground/50"
                )}>
                  {item.due}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Weekly chart */}
        <div className="rounded-2xl bg-os-surface border border-os-foreground/[0.08] shadow-[0px_2px_8px_0px_hsl(var(--os-black)/.08)] p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-os-foreground">Aktivitas Minggu Ini</h2>
            <span className="text-[10px] text-os-foreground/40">4j 20m / target 6j</span>
          </div>
          <div className="flex items-end gap-2 h-20">
            {weekDays.map((day, i) => {
              const h = weekData[i]
              const isToday = i === 3
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <motion.div
                    initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                    transition={{ delay: 0.15 + i * 0.04, duration: 0.4, ease: "easeOut" }}
                    style={{ height: `${h || 8}%` }}
                    className={cn("w-full rounded-t-md origin-bottom min-h-[3px]",
                      h === 0 ? "bg-os-foreground/[0.06]" : isToday ? "bg-os-accent" : "bg-os-foreground/20"
                    )}
                  />
                  <span className={cn("text-[9px] font-medium", isToday ? "text-os-accent font-bold" : "text-os-foreground/30")}>
                    {day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recommended */}
        <div className="rounded-2xl bg-os-surface border border-os-foreground/[0.08] shadow-[0px_2px_8px_0px_hsl(var(--os-black)/.08)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-os-foreground">Rekomendasi</h2>
            <IconStar size={13} className="text-yellow-light" />
          </div>
          <div className="space-y-2">
            {[
              { title: "Node.js Fundamentals", lessons: 22, emoji: "🟢" },
              { title: "CSS Grid Mastery",     lessons: 14, emoji: "🎨" },
              { title: "Docker & Kubernetes",  lessons: 18, emoji: "🐳" },
            ].map((rec, i) => (
              <motion.div
                key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.07 }}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-os-foreground/[0.04] transition-colors cursor-pointer group"
              >
                <div className="size-9 rounded-xl bg-os-foreground/[0.06] flex items-center justify-center text-base shrink-0">{rec.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-os-foreground truncate">{rec.title}</p>
                  <p className="text-[10px] text-os-foreground/40">{rec.lessons} pelajaran</p>
                </div>
                <IconBookmark size={13} className="text-os-foreground/20 group-hover:text-os-accent transition-colors shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  </div>
)

// ─── Settings body ────────────────────────────────────────────────────────────

type GlassSettings = { outer: number; sidebar: number; content: number; toolbar: number }
const DEFAULT_GLASS: GlassSettings = { outer: 60, sidebar: 25, content: 0, toolbar: 45 }

const SettingsBody = ({ glass, setGlass }: { glass: GlassSettings; setGlass: (v: GlassSettings) => void }) => {
  const { theme, setTheme } = useSettingStore()
  const handleTheme = (t: 'light' | 'dark') => { applyThemeColors(t); setTheme(t) }
  const glassSliders: { key: keyof GlassSettings; label: string; sub: string }[] = [
    { key: 'outer',   label: 'Latar Utama',   sub: 'Lapisan glass keseluruhan UI'   },
    { key: 'sidebar', label: 'Sidebar',        sub: 'Panel navigasi kiri'            },
    { key: 'content', label: 'Area Konten',    sub: 'Latar di belakang card'         },
    { key: 'toolbar', label: 'Toolbar',        sub: 'Bar atas dengan pencarian'      },
  ]

  const notifItems = [
    { label: "Pengingat Tugas",    sub: "Notifikasi sebelum deadline",       on: true  },
    { label: "Update Kursus",      sub: "Pelajaran baru dari instruktur",     on: true  },
    { label: "Pencapaian",         sub: "Badge & milestone baru",             on: true  },
    { label: "Pesan Komunitas",    sub: "Balasan & mention di forum",         on: false },
    { label: "Email Mingguan",     sub: "Ringkasan aktivitas belajar",        on: false },
  ]

  return (
    <div className="max-w-6xl mx-auto px-3 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">

      {/* ── Profil hero card ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="rounded-2xl bg-os-surface border border-os-foreground/[0.08] shadow-[0px_2px_8px_0px_hsl(var(--os-black)/.08)] overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-br from-os-accent/85 via-os-accent/70 to-purple-light/60 relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-8 -right-8 size-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 right-32 size-24 rounded-full bg-white/10 blur-2xl" />
          </div>
          <button className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/20 text-white text-[10px] font-semibold backdrop-blur-sm hover:bg-white/30 transition-colors">
            <IconCamera size={11} /> Ganti Banner
          </button>
        </div>
        {/* Info */}
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between -mt-7 mb-4">
            <div className="relative">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-os-accent to-purple-light flex items-center justify-center border-[3px] border-os-surface shadow-lg">
                <span className="text-base font-bold text-white">SA</span>
              </div>
              <button className="absolute -bottom-1 -right-1 size-5 rounded-full bg-os-accent flex items-center justify-center border-2 border-os-surface">
                <IconCamera size={9} className="text-white" />
              </button>
            </div>
            <Button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-os-foreground/[0.06] border border-os-foreground/[0.08] text-os-foreground/70 hover:bg-os-foreground/10 transition-colors">
              <IconPencil size={12} /> Edit Profil
            </Button>
          </div>
          <h2 className="text-base font-bold text-os-foreground">Samsun Asyari</h2>
          <p className="text-xs text-os-foreground/50 mt-0.5">samsunasyari@gmail.com · Student · Level 12</p>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: "Kursus Selesai", value: "12" },
              { label: "Sertifikat",     value: "4"  },
              { label: "Total XP",       value: "2.4k" },
            ].map((s) => (
              <div key={s.label} className="text-center py-2.5 px-2 rounded-xl bg-os-foreground/[0.04] border border-os-foreground/[0.06]">
                <p className="text-base font-bold text-os-foreground">{s.value}</p>
                <p className="text-[10px] text-os-foreground/45 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Grid setting cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Akun */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.35 }}
          className="rounded-2xl bg-os-surface border border-os-foreground/[0.08] shadow-[0px_2px_8px_0px_hsl(var(--os-black)/.08)] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <SettingsItemIcon icon={IconUser} size={12} className="bg-os-accent/15 text-os-accent" />
              <h3 className="text-sm font-bold text-os-foreground">Akun</h3>
            </div>
            <Button className="text-[10px] text-os-accent font-semibold px-2 py-1 rounded-lg hover:bg-os-accent/10 transition-colors">Ubah Semua</Button>
          </div>
          <div className="space-y-0">
            {[
              { label: "Nama Lengkap", value: "Samsun Asyari" },
              { label: "Email",        value: "samsunasyari@gmail.com" },
              { label: "Password",     value: "••••••••" },
              { label: "Nomor HP",     value: "+62 812-xxxx-xxxx" },
              { label: "Tanggal Lahir",value: "1 Januari 1998" },
              { label: "Institusi",    value: "Universitas Contoh" },
            ].map((field, i) => (
              <div key={i} className="group flex items-center justify-between py-2.5 border-b border-os-foreground/[0.05] last:border-0">
                <span className="text-xs text-os-foreground/50 w-28 shrink-0">{field.label}</span>
                <span className="text-xs font-medium text-os-foreground flex-1 truncate">{field.value}</span>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-os-accent font-semibold ml-2 shrink-0">Ubah</button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Kolom kanan */}
        <div className="space-y-4">

          {/* Tema & Tampilan */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.35 }}
            className="rounded-2xl bg-os-surface border border-os-foreground/[0.08] shadow-[0px_2px_8px_0px_hsl(var(--os-black)/.08)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsItemIcon icon={IconSun} size={12} className="bg-yellow-light/15 text-yellow-light" />
              <h3 className="text-sm font-bold text-os-foreground">Tema & Tampilan</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleTheme('light')}
                className={cn("flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                  theme === 'light' ? "border-os-accent bg-os-accent/10" : "border-os-foreground/[0.08] hover:bg-os-foreground/[0.04]"
                )}>
                <div className="size-8 rounded-lg bg-white border border-os-foreground/10 flex items-center justify-center shadow-sm">
                  <IconSun size={14} className="text-yellow-light" />
                </div>
                <span className={cn("text-[11px] font-semibold", theme === 'light' ? "text-os-accent" : "text-os-foreground/60")}>Terang</span>
              </button>
              <button onClick={() => handleTheme('dark')}
                className={cn("flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border transition-all",
                  theme === 'dark' ? "border-os-accent bg-os-accent/10" : "border-os-foreground/[0.08] hover:bg-os-foreground/[0.04]"
                )}>
                <div className="size-8 rounded-lg bg-os-black/80 flex items-center justify-center shadow-sm">
                  <IconMoon size={14} className="text-os-foreground/70" />
                </div>
                <span className={cn("text-[11px] font-semibold", theme === 'dark' ? "text-os-accent" : "text-os-foreground/60")}>Gelap</span>
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-os-foreground/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SettingsItemIcon icon={IconDroplet} size={12} className="bg-os-foreground/10 text-os-foreground/60" />
                  <p className="text-xs font-semibold text-os-foreground">Transparansi</p>
                </div>
                <button
                  onClick={() => setGlass(DEFAULT_GLASS)}
                  className="text-[10px] font-semibold text-os-accent px-2 py-1 rounded-lg hover:bg-os-accent/10 transition-colors"
                >
                  Reset Default
                </button>
              </div>
              {glassSliders.map(({ key, label, sub }) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="text-xs font-medium text-os-foreground">{label}</p>
                      <p className="text-[9px] text-os-foreground/40">{sub}</p>
                    </div>
                    <span className="text-xs font-bold text-os-accent tabular-nums w-8 text-right">{glass[key]}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100" value={glass[key]}
                    onChange={e => setGlass({ ...glass, [key]: Number(e.target.value) })}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-os-foreground/10"
                    style={{ accentColor: 'hsl(var(--os-accent))' }}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Notifikasi */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.35 }}
            className="rounded-2xl bg-os-surface border border-os-foreground/[0.08] shadow-[0px_2px_8px_0px_hsl(var(--os-black)/.08)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsItemIcon icon={IconBellRinging} size={12} className="bg-red-light/10 text-red-light" />
              <h3 className="text-sm font-bold text-os-foreground">Notifikasi</h3>
            </div>
            <div className="space-y-0">
              {notifItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-os-foreground/[0.05] last:border-0">
                  <div className="min-w-0 mr-3">
                    <p className="text-xs font-medium text-os-foreground">{item.label}</p>
                    <p className="text-[10px] text-os-foreground/40 mt-0.5 truncate">{item.sub}</p>
                  </div>
                  <div className={cn("w-8 h-[18px] rounded-full relative transition-colors duration-200 shrink-0 cursor-pointer",
                    item.on ? "bg-os-accent" : "bg-os-foreground/20")}>
                    <span className={cn("absolute top-0.5 size-3.5 rounded-full bg-white shadow-sm transition-all duration-200",
                      item.on ? "left-[calc(100%-18px)]" : "left-0.5")} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Privasi & Keamanan */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}
            className="rounded-2xl bg-os-surface border border-os-foreground/[0.08] shadow-[0px_2px_8px_0px_hsl(var(--os-black)/.08)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsItemIcon icon={IconLock} size={12} className="bg-green-light/10 text-green-light" />
              <h3 className="text-sm font-bold text-os-foreground">Privasi & Keamanan</h3>
            </div>
            <div className="space-y-0">
              {[
                { label: "Autentikasi Dua Faktor", sub: "Nonaktif", action: "Aktifkan", accent: true },
                { label: "Sesi Aktif",              sub: "2 perangkat",  action: "Kelola",   accent: false },
                { label: "Hapus Akun",              sub: "Permanen",     action: "Hapus",    accent: false, danger: true },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-os-foreground/[0.05] last:border-0">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-os-foreground">{row.label}</p>
                    <p className="text-[10px] text-os-foreground/40 mt-0.5">{row.sub}</p>
                  </div>
                  <button className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-colors shrink-0 ml-3",
                    row.danger ? "text-red-light hover:bg-red-light/10" :
                    row.accent ? "text-os-accent hover:bg-os-accent/10" : "text-os-foreground/60 hover:bg-os-foreground/[0.06]"
                  )}>{row.action}</button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bahasa */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.35 }}
            className="rounded-2xl bg-os-surface border border-os-foreground/[0.08] shadow-[0px_2px_8px_0px_hsl(var(--os-black)/.08)] p-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsItemIcon icon={IconWorld} size={12} className="bg-blue-light/10 text-blue-light" />
              <h3 className="text-sm font-bold text-os-foreground">Bahasa & Region</h3>
            </div>
            <div className="space-y-0">
              {[
                { label: "Bahasa Antarmuka", value: "Bahasa Indonesia" },
                { label: "Zona Waktu",       value: "WIB (UTC+7)" },
                { label: "Format Tanggal",   value: "DD/MM/YYYY" },
              ].map((row, i) => (
                <div key={i} className="group flex items-center justify-between py-2.5 border-b border-os-foreground/[0.05] last:border-0">
                  <span className="text-xs text-os-foreground/50">{row.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-os-foreground">{row.value}</span>
                    <IconChevronRight size={12} className="text-os-foreground/25" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

const LMSDashboard = ({ isWindow = false }: { isWindow?: boolean }) => {
  const [activeNav, setActiveNav]     = useState("home")
  const [isMobile, setIsMobile]       = useState(() => window.innerWidth < 768)
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768)
  const [searchQuery, setSearchQuery] = useState("")
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [glass, setGlass] = useState<GlassSettings>(DEFAULT_GLASS)

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setSidebarOpen(false)
      else setSidebarOpen(true)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── macOS Window mode ─────────────────────────────────────────────────────
  if (isWindow) {
    return (
      <div
        className="flex h-full font-semibold relative transition-all duration-300"
        style={{
          backgroundColor: `hsl(var(--os-surface) / ${glass.outer / 100})`,
          backdropFilter: `blur(${glass.outer * 0.4}px)`,
        }}
      >

        {/* Backdrop — hanya di mobile saat sidebar terbuka */}
        <AnimatePresence>
          {sidebarOpen && isMobile && (
            <motion.div
              key="win-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar — inline di desktop, overlay di mobile */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              key="win-sidebar"
              initial={isMobile ? { x: -215 } : { width: 0 }}
              animate={isMobile ? { x: 0 } : { width: 215 }}
              exit={isMobile ? { x: -215 } : { width: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={cn(
                "shrink-0 flex flex-col h-full overflow-hidden",
                isMobile
                  ? "absolute left-0 top-0 w-[215px] z-50 bg-os-surface border-r border-os-foreground/10"
                  : "border-r border-os-foreground/10"
              )}
              style={isMobile ? undefined : {
                backgroundColor: `hsl(var(--os-surface) / ${glass.sidebar / 100})`,
                backdropFilter: `blur(${glass.sidebar * 0.4}px)`,
              }}
            >
              <div className="flex px-4 h-14 min-h-14 items-center gap-2.5 wfd min-w-[215px]">
                <SettingsItemIcon icon={IconSchool} size={13} className="bg-os-accent text-white" />
                <span className="text-xs font-bold text-os-foreground whitespace-nowrap">LearnSpace</span>
              </div>
              <SidebarNav
                activeNav={activeNav}
                setActiveNav={setActiveNav}
                onNavSelect={isMobile ? () => setSidebarOpen(false) : undefined}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content — selalu full width, tidak tergeser sidebar */}
        <div
          className={cn("flex flex-col min-h-full shadow-os-window-frame-content w-full overflow-hidden transition-all duration-300", !isMobile && sidebarOpen ? "border-l border-l-os-foreground/10 dark:border-l-black" : "")}
          style={{
            backgroundColor: `hsl(var(--os-surface) / ${glass.content / 100})`,
            backdropFilter: `blur(${glass.content * 0.4}px)`,
          }}
        >
          {/* Toolbar */}
          <div
            className={cn("h-14 min-h-14 flex items-center px-2 sm:px-4 gap-1.5 sm:gap-2.5 wfd transition-all duration-300", headerScrolled && "border-b border-b-os-foreground/5")}
            style={{
              backgroundColor: `hsl(var(--os-surface-accessible) / ${glass.toolbar / 100})`,
              backdropFilter: `blur(${glass.toolbar * 0.12}px)`,
            }}
          >
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="opacity-60 hover:opacity-100 transition-opacity shrink-0"
            >
              <IconLayoutSidebar size={18} />
            </button>

            <div className="flex items-center gap-2 bg-os-foreground/[0.06] border border-os-foreground/[0.08] rounded-lg px-2.5 py-1.5 flex-1 min-w-0 max-w-xs sm:max-w-sm">
              <IconSearch size={13} className="text-os-foreground/40 shrink-0" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.stopPropagation()}
                placeholder="Cari kursus..."
                className="bg-transparent text-xs text-os-foreground placeholder:text-os-foreground/30 outline-none w-full min-w-0 caret-os-accent"
              />
            </div>
            <div className="flex items-center gap-1.5 ml-auto shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-light/10 border border-orange-light/20">
                <IconFlame size={12} className="text-orange-light" />
                <span className="text-xs font-bold text-orange-light">7</span>
              </div>
              <Button className="size-7 rounded-lg flex items-center justify-center text-os-foreground/60 relative">
                <IconBell size={15} />
                <span className="absolute top-1 right-1 size-1.5 bg-red-light rounded-full" />
              </Button>
              <div className="size-7 rounded-full bg-gradient-to-br from-os-accent to-purple-light flex items-center justify-center shrink-0 cursor-pointer">
                <span className="text-[10px] font-bold text-white">SA</span>
              </div>
            </div>
          </div>

          {/* Scroll content — identik Settings PerfectScrollbar */}
          <PerfectScrollbar onScrollY={e => setHeaderScrolled(e.scrollTop >= 10)}>
            {activeNav === 'settings' ? <SettingsBody glass={glass} setGlass={setGlass} /> : <DashboardBody />}
          </PerfectScrollbar>

        </div>
      </div>
    )
  }

}

function LMSDashboardWindow() {
  const { setFullscreen } = useWindowFrameContext()
  useEffect(() => { setFullscreen() }, [setFullscreen])
  return <LMSDashboard isWindow />
}

export { LMSDashboard, LMSDashboardWindow }
