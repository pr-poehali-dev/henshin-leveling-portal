import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import Icon from '@/components/ui/icon'

interface Service {
  id: number
  title: string
  description: string
  requirements: string
  price: string
}

interface ServicesPageProps {
  apiUrl: string
}

export default function ServicesPage({ apiUrl }: ServicesPageProps) {
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({ phone: '', game_uid: '', telegram: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchServices = () => {
      fetch(`${apiUrl}?path=services`)
        .then(res => res.json())
        .then(data => setServices(data))
        .catch(err => console.error('Failed to fetch services:', err))
    }
    
    fetchServices()
    const interval = setInterval(fetchServices, 3000)
    
    return () => clearInterval(interval)
  }, [apiUrl])

  const handleSubmitOrder = async () => {
    if (!selectedService || !formData.phone || !formData.game_uid || !formData.telegram) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)
    
    toast({
      title: 'Обработка...',
      description: 'Ваша заявка обрабатывается'
    })

    setTimeout(async () => {
      try {
        const response = await fetch(`${apiUrl}?path=orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: selectedService.id,
            phone: formData.phone,
            game_uid: formData.game_uid,
            telegram: formData.telegram
          })
        })

        if (response.ok) {
          toast({
            title: 'Заявка отправлена!',
            description: 'Ожидайте, скоро с вами свяжутся',
            variant: 'default'
          })
          setIsDialogOpen(false)
          setFormData({ phone: '', game_uid: '', telegram: '' })
        } else {
          throw new Error('Failed to submit order')
        }
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось отправить заявку',
          variant: 'destructive'
        })
      } finally {
        setIsSubmitting(false)
      }
    }, 3000)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-900">Услуги прокачки</h1>
        <p className="text-gray-600 text-lg">Выберите подходящий пакет для вашего аккаунта</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {services.map(service => (
          <Card key={service.id} className="border-blue-200 shadow-lg hover:shadow-xl transition-all bg-white/70 backdrop-blur hover:scale-105">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-blue-900">{service.title}</CardTitle>
                  <CardDescription className="mt-2">{service.description}</CardDescription>
                </div>
                <div className="text-2xl font-bold text-blue-600">{service.price}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                  <Icon name="CheckCircle2" size={16} className="text-blue-500" />
                  Требования:
                </h4>
                <p className="text-sm text-gray-600 pl-6">{service.requirements}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => {
                  setSelectedService(service)
                  setIsDialogOpen(true)
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              >
                Отправить запрос
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-blue-900">Оформление заявки</DialogTitle>
            <DialogDescription>
              Заполните данные для заказа услуги: {selectedService?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефона</Label>
              <Input
                id="phone"
                placeholder="+7 (999) 123-45-67"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="game_uid">UID аккаунта из игры</Label>
              <Input
                id="game_uid"
                placeholder="123456789"
                value={formData.game_uid}
                onChange={(e) => setFormData({ ...formData, game_uid: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegram">Telegram аккаунт</Label>
              <Input
                id="telegram"
                placeholder="@username"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleSubmitOrder} 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500"
            >
              {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
