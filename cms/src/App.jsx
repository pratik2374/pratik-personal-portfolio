import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuthContext } from './context/AuthContext'
import CmsLayout from './components/layout/CmsLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import BlogCollection from './pages/collections/BlogCollection'
import ProjectsCollection from './pages/collections/ProjectsCollection'
import ToolsCollection from './pages/collections/ToolsCollection'
import ExperienceCollection from './pages/collections/ExperienceCollection'
import Settings from './pages/Settings'
import BlogForm from './components/forms/BlogForm'
import ProjectForm from './components/forms/ProjectForm'
import ToolForm from './components/forms/ToolForm'
import ExperienceForm from './components/forms/ExperienceForm'

function ProtectedRoute({ children }) {
  const user = useAuthContext()
  if (user === undefined) return <div className="min-h-screen bg-bg flex items-center justify-center text-gray-mid">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <CmsLayout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="blog" element={<BlogCollection />} />
                  <Route path="blog/new" element={<BlogForm />} />
                  <Route path="blog/:id" element={<BlogForm isEdit />} />
                  <Route path="projects" element={<ProjectsCollection />} />
                  <Route path="projects/new" element={<ProjectForm />} />
                  <Route path="projects/:id" element={<ProjectForm isEdit />} />
                  <Route path="tools" element={<ToolsCollection />} />
                  <Route path="tools/new" element={<ToolForm />} />
                  <Route path="tools/:id" element={<ToolForm isEdit />} />
                  <Route path="experience" element={<ExperienceCollection />} />
                  <Route path="experience/new" element={<ExperienceForm />} />
                  <Route path="experience/:id" element={<ExperienceForm isEdit />} />
                  <Route path="settings" element={<Settings />} />
                </Routes>
              </CmsLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
