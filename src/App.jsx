import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import Dashboard from "@/components/pages/Dashboard"
import NewProject from "@/components/pages/NewProject"
import ProjectAnalyzer from "@/components/pages/ProjectAnalyzer"
import ContentEditor from "@/components/pages/ContentEditor"
import SEOReports from "@/components/pages/SEOReports"

function App() {
  return (
    <div className="h-full bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="new-project" element={<NewProject />} />
          <Route path="project/:id/analyzer" element={<ProjectAnalyzer />} />
          <Route path="project/:id/editor" element={<ContentEditor />} />
          <Route path="reports" element={<SEOReports />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App