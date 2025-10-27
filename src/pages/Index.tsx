import { useState, useEffect } from 'react'
import HomePage from '@/components/HomePage'
import ServicesPage from '@/components/ServicesPage'
import AdminPage from '@/components/AdminPage'

const API_URL = 'https://functions.poehali.dev/1e42669b-4dde-4063-8682-1598ae18ca10'

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home')
  const [settings, setSettings] = useState({ site_name: 'GenLeveling', site_description: '' })
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchSettings = () => {
      fetch(`${API_URL}?path=settings`)
        .then(res => res.json())
        .then(data => setSettings(data))
        .catch(err => console.error('Failed to fetch settings:', err))
    }
    
    fetchSettings()
    const interval = setInterval(fetchSettings, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {settings.site_name}
          </h1>
          <div className="flex gap-6">
            <button
              onClick={() => setCurrentPage('home')}
              className={`font-medium transition-colors ${
                currentPage === 'home' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              Главная
            </button>
            <button
              onClick={() => setCurrentPage('services')}
              className={`font-medium transition-colors ${
                currentPage === 'services' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              Услуги
            </button>
            <button
              onClick={() => setCurrentPage('admin')}
              className={`font-medium transition-colors ${
                currentPage === 'admin' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              Админ-панель
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && <HomePage settings={settings} />}
        {currentPage === 'services' && <ServicesPage apiUrl={API_URL} />}
        {currentPage === 'admin' && <AdminPage apiUrl={API_URL} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />}
      </main>
    </div>
  )
}

export default Index