import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'

interface AdminPageProps {
  apiUrl: string
  isAdmin: boolean
  setIsAdmin: (value: boolean) => void
}

interface Order {
  id: number
  service_title: string
  phone: string
  game_uid: string
  telegram: string
  status: string
}

interface Service {
  id: number
  title: string
  description: string
  requirements: string
  price: string
  is_active: boolean
}

export default function AdminPage({ apiUrl, isAdmin, setIsAdmin }: AdminPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [settings, setSettings] = useState({ site_name: '', site_description: '' })
  const [orders, setOrders] = useState<Order[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [newService, setNewService] = useState({ title: '', description: '', requirements: '', price: '' })
  const [editingService, setEditingService] = useState<Service | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isAdmin) {
      const fetchOrders = () => {
        fetch(`${apiUrl}?path=orders`, {
          headers: { 'X-Admin-Auth': 'skzry:568876Qqq' }
        })
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch orders')
            return res.json()
          })
          .then(data => {
            if (Array.isArray(data)) {
              setOrders(data)
            }
          })
          .catch(err => console.error('Failed to fetch orders:', err))
      }
      
      const fetchServices = () => {
        fetch(`${apiUrl}?path=services/all`, {
          headers: { 'X-Admin-Auth': 'skzry:568876Qqq' }
        })
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch services')
            return res.json()
          })
          .then(data => {
            if (Array.isArray(data)) {
              setServices(data)
            }
          })
          .catch(err => console.error('Failed to fetch services:', err))
      }
      
      fetch(`${apiUrl}?path=settings`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch settings')
          return res.json()
        })
        .then(data => setSettings(data))
        .catch(err => console.error('Failed to fetch settings:', err))
      
      fetchOrders()
      fetchServices()
      const interval = setInterval(() => {
        fetchOrders()
        fetchServices()
      }, 3000)
      
      return () => clearInterval(interval)
    }
  }, [isAdmin, apiUrl])

  const handleLogin = () => {
    if (username === 'skzry' && password === '568876Qqq') {
      setIsAdmin(true)
      toast({ title: 'Успешный вход', description: 'Добро пожаловать в админ-панель' })
    } else {
      toast({ title: 'Ошибка', description: 'Неверный логин или пароль', variant: 'destructive' })
    }
  }

  const handleUpdateSettings = async () => {
    try {
      const response = await fetch(`${apiUrl}?path=settings`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Auth': 'skzry:568876Qqq'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Настройки сайта обновлены' })
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить настройки', variant: 'destructive' })
    }
  }

  const handleCreateService = async () => {
    if (!newService.title || !newService.description || !newService.requirements || !newService.price) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' })
      return
    }

    try {
      const response = await fetch(`${apiUrl}?path=services`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Auth': 'skzry:568876Qqq'
        },
        body: JSON.stringify(newService)
      })

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Услуга создана' })
        setNewService({ title: '', description: '', requirements: '', price: '' })
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось создать услугу', variant: 'destructive' })
    }
  }

  const handleUpdateService = async () => {
    if (!editingService || !editingService.title || !editingService.description || !editingService.requirements || !editingService.price) {
      toast({ title: 'Ошибка', description: 'Заполните все поля', variant: 'destructive' })
      return
    }

    try {
      const response = await fetch(`${apiUrl}?path=services/update`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Auth': 'skzry:568876Qqq'
        },
        body: JSON.stringify(editingService)
      })

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Услуга обновлена' })
        setEditingService(null)
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить услугу', variant: 'destructive' })
    }
  }

  const handleDeleteService = async (serviceId: number) => {
    try {
      const response = await fetch(`${apiUrl}?path=services/delete`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Auth': 'skzry:568876Qqq'
        },
        body: JSON.stringify({ id: serviceId })
      })

      if (response.ok) {
        toast({ title: 'Успешно', description: 'Услуга удалена' })
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось удалить услугу', variant: 'destructive' })
    }
  }

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`${apiUrl}?path=orders/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Auth': 'skzry:568876Qqq'
        },
        body: JSON.stringify({ order_id: orderId, status: newStatus })
      })

      if (response.ok) {
        toast({ title: 'Статус обновлен', description: `Заявка переведена в статус: ${newStatus}` })
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить статус', variant: 'destructive' })
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Ожидает',
      accepted: 'Принято',
      rejected: 'Отклонено',
      completed: 'Выполнено',
      cancelled: 'Отменено'
    }
    return texts[status] || status
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md border-blue-200 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-blue-900">Вход в админ-панель</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите логин"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500"
            >
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
        <h1 className="text-3xl font-bold text-blue-900">Панель администратора</h1>
        <Button 
          variant="outline" 
          onClick={() => setIsAdmin(false)}
          className="border-blue-300"
        >
          Выйти
        </Button>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Заявки</TabsTrigger>
          <TabsTrigger value="services">Услуги</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Заявки клиентов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Заявок пока нет</p>
                ) : (
                  orders.map(order => (
                    <Card key={order.id} className="border-blue-100">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-blue-900">{order.service_title}</h3>
                            <div className="text-sm text-gray-600 space-y-1 mt-2">
                              <p><Icon name="Phone" size={14} className="inline mr-2" />{order.phone}</p>
                              <p><Icon name="Gamepad2" size={14} className="inline mr-2" />UID: {order.game_uid}</p>
                              <p><Icon name="Send" size={14} className="inline mr-2" />{order.telegram}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        
                        {order.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateOrderStatus(order.id, 'accepted')}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              Принять
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleUpdateOrderStatus(order.id, 'rejected')}
                              className="flex-1"
                            >
                              Отклонить
                            </Button>
                          </div>
                        )}
                        
                        {order.status === 'accepted' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                              className="flex-1 bg-blue-600 hover:bg-blue-700"
                            >
                              Выполнено
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                              className="flex-1"
                            >
                              Отменено
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Создать новую услугу</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  placeholder="Прокачка до AR 60"
                />
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
              <div className="space-y-2">
                <Label>Цена</Label>
                <Input
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  placeholder="1500 ₽"
                />
              </div>
              <Button 
                onClick={handleCreateService}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500"
              >
                Создать услугу
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Все услуги</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Услуг пока нет</p>
                ) : (
                  services.map(service => (
                    <Card key={service.id} className={`border-blue-100 ${!service.is_active && 'opacity-50'}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-blue-900">{service.title}</h3>
                              <Badge variant={service.is_active ? 'default' : 'secondary'}>
                                {service.is_active ? 'Активна' : 'Удалена'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                            <p className="text-xs text-gray-500 mb-2">
                              <strong>Требования:</strong> {service.requirements}
                            </p>
                            <p className="text-lg font-bold text-blue-600">{service.price}</p>
                          </div>
                        </div>
                        
                        {service.is_active && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingService(service)}
                              className="flex-1"
                            >
                              <Icon name="Edit" size={16} className="mr-2" />
                              Редактировать
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteService(service.id)}
                              className="flex-1"
                            >
                              <Icon name="Trash2" size={16} className="mr-2" />
                              Удалить
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Настройки сайта</CardTitle>
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
                  placeholder="Профессиональная прокачка аккаунтов"
                />
              </div>
              <Button 
                onClick={handleUpdateSettings}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500"
              >
                Сохранить изменения
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!editingService} onOpenChange={(open) => !open && setEditingService(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Редактировать услугу</DialogTitle>
            <DialogDescription>
              Измените данные услуги и сохраните изменения
            </DialogDescription>
          </DialogHeader>
          {editingService && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="Прокачка до AR 60"
                />
              </div>
              <div className="space-y-2">
                <Label>Описание</Label>
                <Textarea
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  placeholder="Подробное описание услуги"
                />
              </div>
              <div className="space-y-2">
                <Label>Требования</Label>
                <Textarea
                  value={editingService.requirements}
                  onChange={(e) => setEditingService({ ...editingService, requirements: e.target.value })}
                  placeholder="AR уровень, доступы и т.д."
                />
              </div>
              <div className="space-y-2">
                <Label>Цена</Label>
                <Input
                  value={editingService.price}
                  onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                  placeholder="1500 ₽"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              onClick={handleUpdateService}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500"
            >
              Сохранить изменения
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}