import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';

type DonateItem = {
  id: number;
  title: string;
  description: string;
  price: number;
  discount?: number;
  popular?: boolean;
  icon: string;
  image?: string;
};

const donateItems: DonateItem[] = [
  {
    id: 1,
    title: 'Стартовый пакет',
    description: 'Базовые ресурсы для начала игры',
    price: 299,
    icon: 'Rocket',
    image: 'https://cdn.poehali.dev/projects/f950de63-ca9e-4820-8fbb-e922deb001c1/files/099b5b88-1f8b-4697-9bf2-8e9637f7fbc5.jpg',
  },
  {
    id: 2,
    title: 'VIP статус',
    description: 'Эксклюзивные привилегии на месяц',
    price: 999,
    popular: true,
    icon: 'Crown',
    image: 'https://cdn.poehali.dev/projects/f950de63-ca9e-4820-8fbb-e922deb001c1/files/a391680d-60fa-4599-a984-25ce407f8c78.jpg',
  },
  {
    id: 3,
    title: 'Премиум набор',
    description: 'Уникальные скины и предметы',
    price: 1499,
    icon: 'Sparkles',
    image: 'https://cdn.poehali.dev/projects/f950de63-ca9e-4820-8fbb-e922deb001c1/files/ec7a31e4-8d07-46ee-a439-5892f36e710f.jpg',
  },
  {
    id: 4,
    title: 'Валюта x1000',
    description: '1000 игровых монет',
    price: 499,
    icon: 'Coins',
    image: 'https://cdn.poehali.dev/projects/f950de63-ca9e-4820-8fbb-e922deb001c1/files/099b5b88-1f8b-4697-9bf2-8e9637f7fbc5.jpg',
  },
  {
    id: 5,
    title: 'Легендарный сундук',
    description: 'Гарантированный легендарный предмет',
    price: 1999,
    icon: 'Package',
    image: 'https://cdn.poehali.dev/projects/f950de63-ca9e-4820-8fbb-e922deb001c1/files/ec7a31e4-8d07-46ee-a439-5892f36e710f.jpg',
  },
  {
    id: 6,
    title: 'Донат на месяц',
    description: 'Ежедневные бонусы 30 дней',
    price: 599,
    icon: 'Calendar',
    image: 'https://cdn.poehali.dev/projects/f950de63-ca9e-4820-8fbb-e922deb001c1/files/a391680d-60fa-4599-a984-25ce407f8c78.jpg',
  },
];

const promoCodes: { [key: string]: { discount: number; maxActivations: number } } = {
  'PROMOMILLION': { discount: 50, maxActivations: 10 },
  'FRIDAY': { discount: 10, maxActivations: 100 },
  'PODAROK': { discount: 30, maxActivations: 50 },
};

const faqItems = [
  {
    question: 'Как применить промокод?',
    answer: 'Введите промокод в специальное поле в корзине перед оплатой. Скидка применится автоматически к общей сумме заказа.',
  },
  {
    question: 'Какие способы оплаты доступны?',
    answer: 'Мы принимаем банковские карты (Visa, MasterCard, МИР), электронные кошельки и криптовалюту.',
  },
  {
    question: 'Как быстро приходят донаты?',
    answer: 'Все покупки зачисляются моментально после успешной оплаты. В редких случаях может потребоваться до 5 минут.',
  },
  {
    question: 'Можно ли вернуть донат?',
    answer: 'Возврат возможен в течение 24 часов, если донат не был использован в игре. Свяжитесь с нашей поддержкой.',
  },
];

const Index = () => {
  const [cart, setCart] = useState<DonateItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoActivations, setPromoActivations] = useState<{ [key: string]: number }>({
    'PROMOMILLION': 0,
    'FRIDAY': 0,
    'PODAROK': 0,
  });

  const addToCart = (item: DonateItem) => {
    setCart([...cart, item]);
    toast.success('Добавлено в корзину!', {
      description: item.title,
    });
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    toast.info('Удалено из корзины');
  };

  const applyPromoCode = () => {
    const upperPromo = promoCode.toUpperCase();
    if (promoCodes[upperPromo]) {
      const currentActivations = promoActivations[upperPromo] || 0;
      const maxActivations = promoCodes[upperPromo].maxActivations;
      
      if (currentActivations >= maxActivations) {
        toast.error(`Промокод исчерпан (${maxActivations}/${maxActivations})`);
        return;
      }
      
      setPromoActivations({ ...promoActivations, [upperPromo]: currentActivations + 1 });
      setAppliedPromo(upperPromo);
      toast.success(`Промокод применён! Скидка ${promoCodes[upperPromo].discount}%`);
    } else {
      toast.error('Неверный промокод');
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const discount = appliedPromo ? promoCodes[appliedPromo].discount : 0;
    return {
      subtotal,
      discount,
      total: subtotal - (subtotal * discount) / 100,
    };
  };

  const { subtotal, discount, total } = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-primary/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Icon name="Gamepad2" size={32} className="text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              GameStore
            </h1>
          </div>
          <div className="flex gap-6 items-center">
            <a href="#donates" className="hover:text-primary transition-colors">
              Донаты
            </a>
            <a href="#faq" className="hover:text-primary transition-colors">
              FAQ
            </a>
            <a href="#support" className="hover:text-primary transition-colors">
              Поддержка
            </a>
            <Button
              variant="outline"
              size="icon"
              className="relative border-primary/50 hover:border-primary"
              onClick={() => {
                const cartEl = document.getElementById('cart');
                cartEl?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Icon name="ShoppingCart" size={20} />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent">
                  {cart.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
        <div className="animate-float">
          <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Windows.Vista
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Эксклюзивные предметы, уникальные скины и VIP-привилегии. Стань легендой!
          </p>
        </div>
      </section>

      <section id="donates" className="container mx-auto px-4 py-12">
        <h3 className="text-4xl font-bold mb-8 text-center">Популярные донаты</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donateItems.map((item, index) => {
            return (
              <Card
                key={item.id}
                className="relative overflow-hidden border-2 border-muted hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-2 animate-slide-in bg-card/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.popular && (
                  <Badge className="absolute top-4 right-4 bg-accent animate-glow">
                    <Icon name="Flame" size={14} className="mr-1" />
                    Хит
                  </Badge>
                )}
                <CardHeader>
                  {item.image ? (
                    <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                      <Icon name={item.icon as any} size={32} className="text-white" />
                    </div>
                  )}
                  <CardTitle className="text-2xl">{item.title}</CardTitle>
                  <CardDescription className="text-base">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">{item.price}₽</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                    onClick={() => addToCart(item)}
                  >
                    <Icon name="ShoppingBag" size={18} className="mr-2" />
                    Купить
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="cart" className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto border-2 border-primary/30 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Icon name="ShoppingCart" size={28} />
              Корзина
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Корзина пуста</p>
            ) : (
              <div className="space-y-3 mb-6">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Icon name={item.icon as any} size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.price}₽</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(index)}>
                      <Icon name="X" size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Промокод"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="border-primary/30"
                />
                <Button onClick={applyPromoCode} variant="outline" className="border-primary/50">
                  <Icon name="Tag" size={18} />
                </Button>
              </div>

              {appliedPromo && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Промокод {appliedPromo}:</span>
                  <span className="text-accent font-medium">-{discount}%</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Сумма:</span>
                <span>{subtotal}₽</span>
              </div>

              <div className="flex items-center justify-between text-2xl font-bold pt-2">
                <span>Итого:</span>
                <span className="text-primary">{total}₽</span>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90 text-lg h-12"
                disabled={cart.length === 0}
              >
                <Icon name="CreditCard" size={20} className="mr-2" />
                Оплатить
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="faq" className="container mx-auto px-4 py-12">
        <h3 className="text-4xl font-bold mb-8 text-center">Часто задаваемые вопросы</h3>
        <Accordion type="single" collapsible className="max-w-2xl mx-auto">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-primary/20">
              <AccordionTrigger className="text-lg hover:text-primary">
                <div className="flex items-center gap-2">
                  <Icon name="HelpCircle" size={20} className="text-primary" />
                  {item.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section id="support" className="container mx-auto px-4 py-12 pb-20">
        <Card className="max-w-2xl mx-auto border-2 border-secondary/30 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Icon name="Headphones" size={28} className="text-secondary" />
              Поддержка
            </CardTitle>
            <CardDescription>Мы всегда на связи, чтобы помочь вам</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <Icon name="Mail" size={24} className="text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">support@gamestore.ru</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <Icon name="MessageCircle" size={24} className="text-secondary" />
              <div>
                <p className="font-medium">Telegram</p>
                <p className="text-sm text-muted-foreground">@gamestore_support</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <Icon name="Clock" size={24} className="text-accent" />
              <div>
                <p className="font-medium">Время работы</p>
                <p className="text-sm text-muted-foreground">24/7 онлайн</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-primary/20 backdrop-blur-lg bg-background/80">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2025 GameStore. Все права защищены.</p>
          <p className="text-sm mt-2">Играй честно, побеждай красиво! 🎮</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;