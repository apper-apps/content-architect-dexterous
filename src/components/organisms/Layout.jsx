import { Outlet } from "react-router-dom"
import Sidebar from "@/components/organisms/Sidebar"

const Layout = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout