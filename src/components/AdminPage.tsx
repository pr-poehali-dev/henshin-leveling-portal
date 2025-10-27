import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'

interface Service {
  id: number
  title: string
  description: string
  requirements: string
  price: string
  is_active: boolean
  created_at?: string
}

interface Order {
  id: number
  service_id: number
  service_title: string
  phone: string
  game_uid: string
  telegram: string
  status: string
}

interface Settings {
  site_name: string
  site_description: string
}

interface AdminPageProps {
  apiUrl: string
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
}

const AdminPage = ({ apiUrl, isAdmin, setIsAdmin }: AdminPageProps) => {
  const [adminPassword, setAdminPassword] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [settings, setSettings] = useState<Settings>({ site_name: '', site_description: '' })
  const [newService, setNewService] = useState({ title: '', description: '', requirements: '', price: '' })
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  useEffect(() => {
    if (!isAdmin) return

    const fetchData = () => {
      fetch(`${apiUrl}?path=orders`, {
        headers: { 'X-Admin-Auth': 'skzry:568876Qqq' }
      })
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.error('Failed to fetch orders:', err))

      fetch(`${apiUrl}?path=services/all`, {
        headers: { 'X-Admin-Auth': 'skzry:568876Qqq' }
      })
        .then(res => res.json())
        .then(data => setServices(data))
        .catch(err => console.error('Failed to fetch services:', err))

      fetch(`${apiUrl}?path=settings`)
        .then(res => res.json())
        .then(data => setSettings(data))
        .catch(err => console.error('Failed to fetch settings:', err))
    }

    fetchData()
    const interval = setInterval(fetchData, 3000)

    return () => clearInterval(interval)
  }, [apiUrl, isAdmin])

  const handleLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true)
    }
  }

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    await fetch(`${apiUrl}?path=orders/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Auth': 'skzry:568876Qqq' },
      body: JSON.stringify({ order_id: orderId, status })
    })
  }

  const handleCreateService = async () => {
    if (!newService.title || !newService.price) return

    await fetch(`${apiUrl}?path=services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Auth': 'skzry:568876Qqq' },
      body: JSON.stringify(newService)
    })

    setNewService({ title: '', description: '', requirements: '', price: '' })
  }

  const handleUpdateService = async () => {
    if (!editingService) return

    await fetch(`${apiUrl}?path=services/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Auth': 'skzry:568876Qqq' },
      body: JSON.stringify(editingService)
    })

    setShowEditDialog(false)
    setEditingService(null)
  }

  const handleDeleteService = async (serviceId: number) => {
    await fetch(`${apiUrl}?path=services/delete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Auth': 'skzry:568876Qqq' },
      body: JSON.stringify({ service_id: serviceId })
    })
  }

  const handleUpdateSettings = async () => {
    await fetch(`${apiUrl}?path=settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Auth': 'skzry:568876Qqq' },
      body: JSON.stringify(settings)
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pending: { variant: 'outline', label: 'Новая' },
      accepted: { variant: 'default', label: 'Принята' },
      completed: { variant: 'secondary', label: 'Выполнена' },
      rejected: { variant: 'destructive', label: 'Отклонена' }
    }
    const config = variants[status] || variants.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md border-blue-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              <Icon name="Lock" size={48} className="mx-auto mb-4" />
              Вход в админ-панель
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Введите пароль"
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-blue-600 to-cyan-500">
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Панель управления
        </h1>
        <Button variant="outline" onClick={() => setIsAdmin(false)}>
          <Icon name="LogOut" size={16} className="mr-2" />
          Выйти
        </Button>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-blue-50">
          <TabsTrigger value="orders" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all">
            <Icon name="ShoppingCart" size={16} className="mr-2" />
            Заявки ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="services" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all">
            <Icon name="Package" size={16} className="mr-2" />
            Услуги ({services.filter(s => s.is_active).length})
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white transition-all">
            <Icon name="Settings" size={16} className="mr-2" />
            Настройки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {orders.length === 0 ? (
            <Card className="border-blue-200">
              <CardContent className="text-center py-12">
                <Icon name="Inbox" size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Заявок пока нет</p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-blue-900">{order.service_title}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">Заявка #{order.id}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="Phone" size={16} className="text-blue-500" />
                      <span className="font-medium">Телефон:</span>
                      <span className="text-gray-700">{order.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Gamepad2" size={16} className="text-cyan-500" />
                      <span className="font-medium">UID:</span>
                      <span className="text-gray-700">{order.game_uid}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="MessageCircle" size={16} className="text-blue-500" />
                      <span className="font-medium">Telegram:</span>
                      <span className="text-gray-700">{order.telegram}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    {order.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => handleUpdateOrderStatus(order.id, 'accepted')}
                          className="flex-1 bg-green-600 hover:bg-green-700 transition-all"
                        >
                          <Icon name="Check" size={16} className="mr-2" />
                          Принять
                        </Button>
                        <Button
                          onClick={() => handleUpdateOrderStatus(order.id, 'rejected')}
                          variant="destructive"
                          className="flex-1 transition-all"
                        >
                          <Icon name="X" size={16} className="mr-2" />
                          Отклонить
                        </Button>
                      </>
                    )}
                    {order.status === 'accepted' && (
                      <>
                        <Button
                          onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 transition-all"
                        >
                          <Icon name="CheckCircle" size={16} className="mr-2" />
                          Выполнено
                        </Button>
                        <Button
                          onClick={() => handleUpdateOrderStatus(order.id, 'rejected')}
                          variant="outline"
                          className="flex-1 transition-all"
                        >
                          <Icon name="Ban" size={16} className="mr-2" />
                          Отменить
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Icon name="Plus" size={20} />
                Создать новую услугу
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Название</Label>
                  <Input
                    value={newService.title}
                    onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                    placeholder="Прокачка до AR 60"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Цена</Label>
                  <Input
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    placeholder="1500 ₽"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Подробное описание услуги"
                />
              </div>
              <div className="space-y-2">
                <Label>Требования</Label>
                <Textarea
                  value={newService.requirements}
                  onChange={(e) => setNewService({ ...newService, requirements: e.target.value })}
                  placeholder="AR уровень, доступы и т.д."
                />
              </div>
              <Button
                onClick={handleCreateService}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all"
              >
                <Icon name="Plus" size={16} className="mr-2" />
                Создать услугу
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {services.map((service) => (
              <Card key={service.id} className="border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-blue-900">{service.title}</CardTitle>
                      <p className="text-2xl font-bold text-cyan-600 mt-2">{service.price}</p>
                    </div>
                    <Badge variant={service.is_active ? 'default' : 'secondary'}>
                      {service.is_active ? 'Активна' : 'Неактивна'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Описание:</p>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Требования:</p>
                    <p className="text-sm text-gray-600">{service.requirements}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => {
                        setEditingService(service)
                        setShowEditDialog(true)
                      }}
                      variant="outline"
                      className="flex-1 transition-all"
                    >
                      <Icon name="Edit" size={16} className="mr-2" />
                      Редактировать
                    </Button>
                    <Button
                      onClick={() => handleDeleteService(service.id)}
                      variant="destructive"
                      className="flex-1 transition-all"
                    >
                      <Icon name="Trash2" size={16} className="mr-2" />
                      Удалить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Icon name="Settings" size={20} />
                Настройки сайта
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Название сайта</Label>
                <Input
                  value={settings.site_name}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  placeholder="GenLeveling"
                />
              </div>
              <div className="space-y-2">
                <Label>Описание сайта</Label>
                <Textarea
                  value={settings.site_description}
                  onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                  placeholder="Описание вашего сайта"
                />
              </div>
              <Button
                onClick={handleUpdateSettings}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all"
              >
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Редактировать услугу</DialogTitle>
          </DialogHeader>
          {editingService && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Название</Label>
                  <Input
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Цена</Label>
                  <Input
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Требования</Label>
                <Textarea
                  value={editingService.requirements}
                  onChange={(e) => setEditingService({ ...editingService, requirements: e.target.value })}
                />
              </div>
              <Button
                onClick={handleUpdateService}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 transition-all"
              >
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить изменения
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminPage