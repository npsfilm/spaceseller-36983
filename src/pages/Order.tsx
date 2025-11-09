import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ServiceCard } from '@/components/order/ServiceCard';
import { ImageUpload } from '@/components/order/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MapPin, ShoppingCart } from 'lucide-react';

interface Service {
  id: string;
  category: string;
  name: string;
  description: string;
  base_price: number;
  unit: string;
  features: string[];
}

function OrderContent() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({});
  const [draftOrderId, setDraftOrderId] = useState<string | null>(null);
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  // Photography address fields
  const [shootingAddress, setShootingAddress] = useState({
    strasse: '',
    hausnummer: '',
    plz: '',
    stadt: '',
    additional_info: ''
  });
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
    createDraftOrder();
  }, []);

  const loadServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('base_price');
    
    if (data) {
      const formattedServices = data.map(service => ({
        ...service,
        features: Array.isArray(service.features) ? service.features : []
      })) as Service[];
      setServices(formattedServices);
    }
  };

  const createDraftOrder = async () => {
    if (!user) return;

    const orderNumber = await generateOrderNumber();
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        status: 'draft'
      })
      .select()
      .single();

    if (data) setDraftOrderId(data.id);
  };

  const generateOrderNumber = async (): Promise<string> => {
    const { data, error } = await supabase.rpc('generate_order_number');
    return data || `SS-${new Date().getFullYear()}-${Date.now()}`;
  };

  const handleQuantityChange = (serviceId: string, quantity: number) => {
    setSelectedServices(prev => {
      if (quantity <= 0) {
        const { [serviceId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [serviceId]: quantity };
    });
  };

  const calculateTotal = () => {
    return Object.entries(selectedServices).reduce((total, [serviceId, quantity]) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.base_price || 0) * quantity;
    }, 0);
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedServices).length === 0) {
      toast({
        title: 'Keine Services ausgewählt',
        description: 'Bitte wählen Sie mindestens einen Service',
        variant: 'destructive'
      });
      return;
    }

    const photographyServices = services.filter(s => 
      s.category === 'photography' && selectedServices[s.id]
    );
    
    if (photographyServices.length > 0 && !shootingAddress.strasse) {
      toast({
        title: 'Adresse erforderlich',
        description: 'Bitte geben Sie die Shooting-Adresse an',
        variant: 'destructive'
      });
      return;
    }

    const editingServices = services.filter(s => 
      s.category !== 'photography' && selectedServices[s.id]
    );
    
    if (editingServices.length > 0 && uploads.length === 0) {
      toast({
        title: 'Bilder erforderlich',
        description: 'Bitte laden Sie Bilder für die Bearbeitung hoch',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Create order items
      const orderItems = Object.entries(selectedServices).map(([serviceId, quantity]) => {
        const service = services.find(s => s.id === serviceId);
        return {
          order_id: draftOrderId,
          service_id: serviceId,
          quantity,
          unit_price: service?.base_price || 0,
          total_price: (service?.base_price || 0) * quantity
        };
      });

      await supabase.from('order_items').insert(orderItems);

      // Save shooting address if photography services selected
      if (photographyServices.length > 0) {
        await supabase.from('addresses').insert({
          order_id: draftOrderId,
          user_id: user?.id,
          address_type: 'shooting_location',
          strasse: shootingAddress.strasse,
          hausnummer: shootingAddress.hausnummer,
          plz: shootingAddress.plz,
          stadt: shootingAddress.stadt,
          additional_info: shootingAddress.additional_info
        });
      }

      // Update order status and total
      const total = calculateTotal();
      const deliveryDeadline = new Date();
      deliveryDeadline.setHours(deliveryDeadline.getHours() + 48);

      await supabase
        .from('orders')
        .update({
          status: 'submitted',
          total_amount: total,
          delivery_deadline: deliveryDeadline.toISOString(),
          special_instructions: specialInstructions
        })
        .eq('id', draftOrderId);

      toast({
        title: 'Bestellung erfolgreich',
        description: 'Ihre Bestellung wurde aufgegeben!'
      });

      navigate(`/order/confirmation/${draftOrderId}`);
    } catch (error: any) {
      toast({
        title: 'Fehler',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const photographyServices = services.filter(s => s.category === 'photography');
  const editingServices = services.filter(s => s.category === 'editing');
  const virtualStagingServices = services.filter(s => s.category === 'virtual_staging');
  const floorPlanServices = services.filter(s => s.category === 'floor_plan');

  const hasPhotographySelected = photographyServices.some(s => selectedServices[s.id]);
  const hasEditingSelected = [...editingServices, ...virtualStagingServices, ...floorPlanServices].some(s => selectedServices[s.id]);

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Neue Bestellung</h1>
            <p className="text-muted-foreground">Wählen Sie die gewünschten Services aus</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              {/* Photography Services */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Fotografie-Services</h2>
                    <p className="text-sm text-muted-foreground">Professionelle Immobilienfotografie</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {photographyServices.map((service, idx) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      quantity={selectedServices[service.id] || 0}
                      onQuantityChange={handleQuantityChange}
                      isPopular={idx === 5}
                    />
                  ))}
                </div>

                {hasPhotographySelected && (
                  <div className="mt-6 bg-card border border-border rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4">Shooting-Adresse</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Straße *</Label>
                        <Input
                          value={shootingAddress.strasse}
                          onChange={(e) => setShootingAddress(prev => ({ ...prev, strasse: e.target.value }))}
                          placeholder="Musterstraße"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hausnummer</Label>
                        <Input
                          value={shootingAddress.hausnummer}
                          onChange={(e) => setShootingAddress(prev => ({ ...prev, hausnummer: e.target.value }))}
                          placeholder="123"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>PLZ *</Label>
                        <Input
                          value={shootingAddress.plz}
                          onChange={(e) => setShootingAddress(prev => ({ ...prev, plz: e.target.value }))}
                          placeholder="12345"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Stadt *</Label>
                        <Input
                          value={shootingAddress.stadt}
                          onChange={(e) => setShootingAddress(prev => ({ ...prev, stadt: e.target.value }))}
                          placeholder="München"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Zusätzliche Informationen</Label>
                        <Textarea
                          value={shootingAddress.additional_info}
                          onChange={(e) => setShootingAddress(prev => ({ ...prev, additional_info: e.target.value }))}
                          placeholder="Zugang, Parkmöglichkeiten, etc."
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Image Editing Services */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Bildbearbeitung</h2>
                    <p className="text-sm text-muted-foreground">Professionelle Nachbearbeitung</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {[...editingServices, ...virtualStagingServices, ...floorPlanServices].map((service, idx) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      quantity={selectedServices[service.id] || 0}
                      onQuantityChange={handleQuantityChange}
                      isPopular={idx === 1}
                    />
                  ))}
                </div>

                {hasEditingSelected && draftOrderId && (
                  <div className="mt-6 bg-card border border-border rounded-xl p-6">
                    <h3 className="text-lg font-bold mb-4">Bilder hochladen</h3>
                    <ImageUpload 
                      orderId={draftOrderId} 
                      onUploadComplete={setUploads}
                    />
                  </div>
                )}
              </section>

              {/* Special Instructions */}
              <section className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Besondere Wünsche</h3>
                <Textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Haben Sie spezielle Anforderungen oder Wünsche?"
                  rows={4}
                />
              </section>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-card border border-border rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Bestellübersicht</h3>
                </div>

                <Separator />

                {Object.keys(selectedServices).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Keine Services ausgewählt
                  </p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(selectedServices).map(([serviceId, quantity]) => {
                      const service = services.find(s => s.id === serviceId);
                      if (!service) return null;
                      return (
                        <div key={serviceId} className="flex justify-between text-sm">
                          <div className="flex-1">
                            <p className="font-medium">{service.name}</p>
                            <p className="text-muted-foreground">{quantity}x €{service.base_price}</p>
                          </div>
                          <p className="font-semibold">€{service.base_price * quantity}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zwischensumme</span>
                    <span className="font-semibold">€{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Gesamt</span>
                    <span>€{calculateTotal()}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <div className="text-xs text-muted-foreground">
                    <p>✓ 24-48h Lieferzeit</p>
                    <p>✓ Professionelle Bearbeitung</p>
                    <p>✓ Unbegrenzte Revisionen</p>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading || Object.keys(selectedServices).length === 0}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Wird verarbeitet...' : 'Bestellung absenden'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function Order() {
  return (
    <ProtectedRoute requireOnboarding>
      <OrderContent />
    </ProtectedRoute>
  );
}
