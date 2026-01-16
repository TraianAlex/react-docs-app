import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import DocPage from './pages/DocPage'
import ExamplePage from './pages/ExamplePage'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { defaultDocSlug } from './docs/docs'

function App() {
  return (
    <BrowserRouter>
      <div className="container-fluid min-vh-100 bg-light">
        <div className="row min-vh-100">
          <aside className="col-12 col-lg-3 col-xl-2 bg-dark text-light p-4">
            <Sidebar />
          </aside>
          <main className="col-12 col-lg-9 col-xl-10 p-4 p-lg-5">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/docs"
                element={<Navigate to={`/docs/${defaultDocSlug}`} replace />}
              />
              <Route path="/docs/:slug" element={<DocPage />} />
              <Route path="/examples/:slug" element={<ExamplePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
