import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Space } from "./components/system/space"
import { AppKey, AppValue } from "./data/app-key"
import { useAppStore } from "./stores/app"
import { customAlphabet } from "nanoid"
import { apps as appsData } from "./data/app"
import { LMSDashboard } from "./components/apps/lms-dashboard"
import { IconDeviceDesktop, IconBrowser } from "@tabler/icons-react"

// ─── App Context (untuk mode macOS) ──────────────────────────────────────────

interface AppContextValue {
  apps: AppValue[]
  setApps: Dispatch<SetStateAction<AppValue[]>>
  openApp: (appKey: AppKey) => void
  closeApp: (id: string) => void
}

const AppContext = createContext<AppContextValue>({} as AppContextValue)

const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error("useAppContext must use in AppContext.Provider")
  return context
}

// ─── Mode macOS: shell lengkap ────────────────────────────────────────────────

const lmsMainApp: AppValue = { appKey: AppKey.LMS, id: 'lms-main' }

const MacOSShell = () => {
  const [apps, setApps] = useState<AppValue[]>([lmsMainApp])
  const setFocused = useAppStore(store => store.setFocused)

  useEffect(() => { setFocused(lmsMainApp) }, [])

  const openApp = useCallback((appKey: AppKey) => {
    const allowMany = appsData.find(ad => ad.key == appKey)?.allowMany != false
    const running = apps.find(a => a.appKey == appKey)
    if (running && !allowMany) {
      setFocused(running)
    } else {
      const appValue = { appKey, id: customAlphabet('0123456789', 10)() }
      setApps([...apps, appValue])
      setFocused(appValue)
    }
  }, [apps])

  const closeApp = useCallback((id: string) => {
    setApps([...apps.filter(a => a.id != id)])
  }, [apps])

  return (
    <AppContext.Provider value={{ apps, setApps, openApp, closeApp }}>
      <div className="h-dvh">
        <Space />
      </div>
    </AppContext.Provider>
  )
}

// ─── Toggle Pill ──────────────────────────────────────────────────────────────

const VersionToggle = ({ mode, onToggle }: { mode: 'web' | 'macos'; onToggle: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6, duration: 0.35 }}
    className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[9999]"
  >
    <div className="flex items-center gap-1 p-1 rounded-2xl
                    bg-os-surface/80 backdrop-blur-2xl
                    border border-os-foreground/[0.12]
                    shadow-[0px_8px_30px_0px_hsl(var(--os-black)/.35)]">
      <button
        onClick={() => mode !== 'web' && onToggle()}
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
          mode === 'web'
            ? 'bg-os-accent text-white shadow-[0px_2px_8px_0px_hsl(var(--os-black)/.3)]'
            : 'text-os-foreground/50 hover:text-os-foreground hover:bg-os-foreground/[0.06]'
        }`}
      >
        <IconBrowser size={14} />
        <span className="hidden sm:inline">Web Dashboard</span>
      </button>
      <button
        onClick={() => mode !== 'macos' && onToggle()}
        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
          mode === 'macos'
            ? 'bg-os-accent text-white shadow-[0px_2px_8px_0px_hsl(var(--os-black)/.3)]'
            : 'text-os-foreground/50 hover:text-os-foreground hover:bg-os-foreground/[0.06]'
        }`}
      >
        <IconDeviceDesktop size={14} />
        <span className="hidden sm:inline">macOS Window</span>
      </button>
    </div>
  </motion.div>
)

// ─── App Root ─────────────────────────────────────────────────────────────────

const App = () => {
  const [mode, setMode] = useState<'web' | 'macos'>('web')

  return (
    <>
      <AnimatePresence mode="wait">
        {mode === 'web' ? (
          <motion.div
            key="web"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="h-dvh w-full"
          >
            <LMSDashboard />
          </motion.div>
        ) : (
          <motion.div
            key="macos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="h-dvh w-full"
          >
            <MacOSShell />
          </motion.div>
        )}
      </AnimatePresence>

      <VersionToggle mode={mode} onToggle={() => setMode(m => m === 'web' ? 'macos' : 'web')} />
    </>
  )
}

export { App, useAppContext }
