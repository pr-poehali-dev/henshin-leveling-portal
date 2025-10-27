import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Icon from '@/components/ui/icon'

interface HomePageProps {
  settings: {
    site_name: string
    site_description: string
  }
}

export default function HomePage({ settings }: HomePageProps) {
  return (
    <div className="space-y-12">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          {settings.site_name}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {settings.site_description || 'Профессиональная прокачка аккаунтов Henshin Impact'}
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow bg-white/70 backdrop-blur">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mb-4">
              <Icon name="Zap" size={24} className="text-white" />
            </div>
            <CardTitle className="text-blue-900">Быстрая прокачка</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Профессиональная команда выполнит прокачку вашего аккаунта в кратчайшие сроки
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow bg-white/70 backdrop-blur">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mb-4">
              <Icon name="Shield" size={24} className="text-white" />
            </div>
            <CardTitle className="text-blue-900">Безопасность</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Гарантируем безопасность вашего аккаунта. Все данные строго конфиденциальны
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow bg-white/70 backdrop-blur">
          <CardHeader>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center mb-4">
              <Icon name="HeadphonesIcon" size={24} className="text-white" />
            </div>
            <CardTitle className="text-blue-900">Поддержка 24/7</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Наша служба поддержки всегда на связи и готова ответить на ваши вопросы
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-12 text-center text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
        <p className="text-lg mb-6 opacity-90">
          Выберите подходящий пакет прокачки и оставьте заявку
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105">
          Смотреть услуги
        </button>
      </section>
    </div>
  )
}
