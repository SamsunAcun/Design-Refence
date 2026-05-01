import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from "react"
import { Space } from "./components/system/space"
import { AppKey, AppValue } from "./data/app-key"
import { useAppStore } from "./stores/app"
import { customAlphabet } from "nanoid"
import { apps as appsData } from "./data/app"

// ─── App Context ──────────────────────────────────────────────────────────────

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

// ─── macOS Shell ──────────────────────────────────────────────────────────────

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

// ─── App Root ─────────────────────────────────────────────────────────────────

const App = () => (
  <div className="h-dvh w-full">
    <MacOSShell />
  </div>
)

export { App, useAppContext }
