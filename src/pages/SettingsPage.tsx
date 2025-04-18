
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Save, Mail, BellRing, User, LogOut, Smartphone, Shield } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const handleSave = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Paramètres enregistrés',
        description: 'Vos paramètres ont été enregistrés avec succès.',
      });
    }, 1000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
      </div>
      
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">Compte</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="hotel">Hôtel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
              <CardDescription>
                Gérez vos informations personnelles et vos préférences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{user?.prenom} {user?.nom}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {user?.role}
                    </Badge>
                    <span className="text-sm text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">Actif</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" defaultValue={user?.prenom} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" defaultValue={user?.nom} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
                
                <div className="flex justify-center md:justify-end">
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? 'Enregistrement...' : <><Save className="mr-2 h-4 w-4" /> Enregistrer</>}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notifications</CardTitle>
              <CardDescription>
                Configurez comment et quand vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Nouvelles réservations</Label>
                      <p className="text-sm text-muted-foreground">Recevez une notification par email pour chaque nouvelle réservation</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Arrivées du jour</Label>
                      <p className="text-sm text-muted-foreground">Recevez un récapitulatif des arrivées du jour</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Rapports hebdomadaires</Label>
                      <p className="text-sm text-muted-foreground">Recevez un rapport d'activité hebdomadaire</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Application</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Nouvelles réservations</Label>
                      <p className="text-sm text-muted-foreground">Afficher une notification dans l'application pour chaque nouvelle réservation</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mises à jour de statut</Label>
                      <p className="text-sm text-muted-foreground">Notifications pour les changements de statut des chambres ou réservations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center md:justify-end">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? 'Enregistrement...' : <><Save className="mr-2 h-4 w-4" /> Enregistrer</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité et connexion</CardTitle>
              <CardDescription>
                Gérez la sécurité de votre compte et les paramètres de connexion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mot de passe</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>
                      Modifier le mot de passe
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Authentification à deux facteurs</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Activer l'authentification à deux facteurs</Label>
                      <p className="text-sm text-muted-foreground">Sécurisez davantage votre compte avec une vérification supplémentaire</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sessions actives</h3>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">iPhone 13 - Paris</p>
                          <p className="text-sm text-muted-foreground">Dernière activité: Aujourd'hui à 15:42</p>
                        </div>
                      </div>
                      <Badge>Session actuelle</Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Se déconnecter de toutes les autres sessions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hotel">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de l'hôtel</CardTitle>
              <CardDescription>
                Configurez les informations générales de votre établissement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hotelName">Nom de l'établissement</Label>
                  <Input id="hotelName" defaultValue="Grand Hôtel Paris" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email de contact</Label>
                    <Input id="email" type="email" defaultValue="contact@grandhotel-paris.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" defaultValue="+33 1 23 45 67 89" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    defaultValue="15 Avenue des Champs-Élysées, 75008 Paris, France"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Horaires de check-in/check-out</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkIn" className="text-sm text-muted-foreground">Check-in à partir de</Label>
                      <Input id="checkIn" defaultValue="14:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkOut" className="text-sm text-muted-foreground">Check-out jusqu'à</Label>
                      <Input id="checkOut" defaultValue="11:00" />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Options de facturation</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>TVA incluse dans les prix affichés</Label>
                      <p className="text-sm text-muted-foreground">Les prix affichés incluent déjà la TVA</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Taxe de séjour automatique</Label>
                      <p className="text-sm text-muted-foreground">Ajouter automatiquement la taxe de séjour aux factures</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? 'Enregistrement...' : <><Save className="mr-2 h-4 w-4" /> Enregistrer</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
