import { createContext, useContext } from "react"
import { LMSDashboard } from "./components/apps/lms-dashboard"
import { WindowFrameContext } from "./components/system/window-frame"

// Tetap export AppContext agar space.tsx / system/app.tsx tidak error TypeScript
interface AppContextValue {
  apps: never[]
  openApp: () => void
  closeApp: () => void
}
const AppContext = createContext<AppContextValue>({} as AppContextValue)
const useAppContext = () => useContext(AppContext)

const noop = () => {}

const App = () => (
  <WindowFrameContext.Provider value={{
    setMinimize: noop,
    setFullscreen: noop,
    close: noop,
    focused: false,
    canFullscreen: false,
    canMinimize: false,
  }}>
    <div className="h-dvh w-full overflow-hidden">
      <LMSDashboard isWindow />
    </div>
  </WindowFrameContext.Provider>
)

export { App, useAppContext }
