
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { rooms as initialRooms, clients } from '@/data/mockData';
import { Room, RoomStatus, RoomType } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle2
} from 'lucide-react';

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Nouvel état pour le formulaire
  const [formData, setFormData] = useState<Partial<Room>>({
    numero: '',
    type: RoomType.SIMPLE,
    etage: 1,
    prix: 0,
    capacite: 1,
    statut: RoomStatus.DISPONIBLE,
    caracteristiques: [],
    description: '',
  });

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCaracteristiqueToggle = (caracteristique: string) => {
    setFormData(prev => {
      const caracteristiques = prev.caracteristiques || [];
      if (caracteristiques.includes(caracteristique)) {
        return { 
          ...prev, 
          caracteristiques: caracteristiques.filter(c => c !== caracteristique) 
        };
      } else {
        return { 
          ...prev, 
          caracteristiques: [...caracteristiques, caracteristique] 
        };
      }
    });
  };

  const handleAddRoom = () => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      numero: formData.numero || '',
      type: formData.type || RoomType.SIMPLE,
      etage: formData.etage || 1,
      prix: formData.prix || 0,
      capacite: formData.capacite || 1,
      statut: formData.statut || RoomStatus.DISPONIBLE,
      caracteristiques: formData.caracteristiques || [],
      description: formData.description || '',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=500&auto=format&fit=crop',
    };
    
    setRooms([...rooms, newRoom]);
    setFormData({
      numero: '',
      type: RoomType.SIMPLE,
      etage: 1,
      prix: 0,
      capacite: 1,
      statut: RoomStatus.DISPONIBLE,
      caracteristiques: [],
      description: '',
    });
    setIsAddingRoom(false);
    
    toast({
      title: 'Chambre ajoutée',
      description: `La chambre ${newRoom.numero} a été ajoutée avec succès.`,
    });
  };

  const handleEditRoom = (room: Room) => {
    setRoomToEdit(room);
    setFormData({
      numero: room.numero,
      type: room.type,
      etage: room.etage,
      prix: room.prix,
      capacite: room.capacite,
      statut: room.statut,
      caracteristiques: room.caracteristiques,
      description: room.description || '',
    });
  };

  const handleSaveEdit = () => {
    if (!roomToEdit) return;
    
    const updatedRooms = rooms.map(room => 
      room.id === roomToEdit.id 
        ? { 
            ...roomToEdit, 
            numero: formData.numero || roomToEdit.numero,
            type: formData.type || roomToEdit.type,
            etage: formData.etage !== undefined ? formData.etage : roomToEdit.etage,
            prix: formData.prix !== undefined ? formData.prix : roomToEdit.prix,
            capacite: formData.capacite !== undefined ? formData.capacite : roomToEdit.capacite,
            statut: formData.statut || roomToEdit.statut,
            caracteristiques: formData.caracteristiques || roomToEdit.caracteristiques,
            description: formData.description,
          } 
        : room
    );
    
    setRooms(updatedRooms);
    setRoomToEdit(null);
    
    toast({
      title: 'Chambre modifiée',
      description: `La chambre ${formData.numero} a été modifiée avec succès.`,
    });
  };

  const handleDeleteConfirmation = (roomId: string) => {
    setRoomToDelete(roomId);
    setShowDeleteConfirm(true);
  };

  const handleDeleteRoom = () => {
    if (!roomToDelete) return;
    
    const updatedRooms = rooms.filter(room => room.id !== roomToDelete);
    setRooms(updatedRooms);
    setRoomToDelete(null);
    setShowDeleteConfirm(false);
    
    toast({
      title: 'Chambre supprimée',
      description: 'La chambre a été supprimée avec succès.',
    });
  };

  const filteredRooms = rooms.filter(room => 
    room.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: RoomStatus) => {
    const statusMap = {
      [RoomStatus.DISPONIBLE]: { color: 'bg-green-100 text-green-800', label: 'Disponible' },
      [RoomStatus.OCCUPEE]: { color: 'bg-red-100 text-red-800', label: 'Occupée' },
      [RoomStatus.MAINTENANCE]: { color: 'bg-gray-100 text-gray-800', label: 'Maintenance' },
      [RoomStatus.NETTOYAGE]: { color: 'bg-blue-100 text-blue-800', label: 'Nettoyage' },
      [RoomStatus.RESERVEE]: { color: 'bg-amber-100 text-amber-800', label: 'Réservée' },
    };
    
    return (
      <Badge variant="outline" className={`${statusMap[status].color}`}>
        {statusMap[status].label}
      </Badge>
    );
  };

  const caracteristiquesOptions = [
    'WiFi', 
    'TV', 
    'Climatisation', 
    'Minibar', 
    'Coffre-fort', 
    'Balcon', 
    'Vue sur mer', 
    'Jacuzzi'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des chambres</h1>
        <Dialog open={isAddingRoom} onOpenChange={setIsAddingRoom}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une chambre
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle chambre</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer une nouvelle chambre.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Numéro</Label>
                  <Input
                    id="numero"
                    placeholder="ex: 101"
                    value={formData.numero}
                    onChange={e => handleFormChange('numero', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="etage">Étage</Label>
                  <Input
                    id="etage"
                    type="number"
                    value={formData.etage}
                    onChange={e => handleFormChange('etage', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={value => handleFormChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(RoomType).map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statut">Statut</Label>
                  <Select
                    value={formData.statut}
                    onValueChange={value => handleFormChange('statut', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(RoomStatus).map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prix">Prix par nuit (€)</Label>
                  <Input
                    id="prix"
                    type="number"
                    value={formData.prix}
                    onChange={e => handleFormChange('prix', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacite">Capacité</Label>
                  <Input
                    id="capacite"
                    type="number"
                    value={formData.capacite}
                    onChange={e => handleFormChange('capacite', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Caractéristiques</Label>
                <div className="grid grid-cols-4 gap-2">
                  {caracteristiquesOptions.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`caracteristique-${option}`}
                        checked={(formData.caracteristiques || []).includes(option)}
                        onCheckedChange={() => handleCaracteristiqueToggle(option)}
                      />
                      <Label htmlFor={`caracteristique-${option}`}>{option}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Description de la chambre"
                  value={formData.description}
                  onChange={e => handleFormChange('description', e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button onClick={handleAddRoom}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une chambre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-[300px]"
                />
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Toutes</DropdownMenuItem>
                <DropdownMenuItem>Disponibles</DropdownMenuItem>
                <DropdownMenuItem>Occupées</DropdownMenuItem>
                <DropdownMenuItem>En maintenance</DropdownMenuItem>
                <DropdownMenuItem>En nettoyage</DropdownMenuItem>
                <DropdownMenuItem>Réservées</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Étage</TableHead>
                  <TableHead>Prix/nuit</TableHead>
                  <TableHead>Capacité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.numero}</TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell>{room.etage}</TableCell>
                    <TableCell>{room.prix} €</TableCell>
                    <TableCell>{room.capacite}</TableCell>
                    <TableCell>{getStatusBadge(room.statut)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir le menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <DropdownMenuItem onSelect={() => handleEditRoom(room)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[625px]">
                              <DialogHeader>
                                <DialogTitle>Modifier la chambre {room.numero}</DialogTitle>
                                <DialogDescription>
                                  Modifiez les informations de la chambre.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="numero-edit">Numéro</Label>
                                    <Input
                                      id="numero-edit"
                                      placeholder="ex: 101"
                                      value={formData.numero}
                                      onChange={e => handleFormChange('numero', e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="etage-edit">Étage</Label>
                                    <Input
                                      id="etage-edit"
                                      type="number"
                                      value={formData.etage}
                                      onChange={e => handleFormChange('etage', parseInt(e.target.value))}
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="type-edit">Type</Label>
                                    <Select
                                      value={formData.type}
                                      onValueChange={value => handleFormChange('type', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.values(RoomType).map(type => (
                                          <SelectItem key={type} value={type}>
                                            {type}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="statut-edit">Statut</Label>
                                    <Select
                                      value={formData.statut}
                                      onValueChange={value => handleFormChange('statut', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un statut" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {Object.values(RoomStatus).map(status => (
                                          <SelectItem key={status} value={status}>
                                            {status}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="prix-edit">Prix par nuit (€)</Label>
                                    <Input
                                      id="prix-edit"
                                      type="number"
                                      value={formData.prix}
                                      onChange={e => handleFormChange('prix', parseInt(e.target.value))}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="capacite-edit">Capacité</Label>
                                    <Input
                                      id="capacite-edit"
                                      type="number"
                                      value={formData.capacite}
                                      onChange={e => handleFormChange('capacite', parseInt(e.target.value))}
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Caractéristiques</Label>
                                  <div className="grid grid-cols-4 gap-2">
                                    {caracteristiquesOptions.map(option => (
                                      <div key={option} className="flex items-center space-x-2">
                                        <Checkbox 
                                          id={`caracteristique-edit-${option}`}
                                          checked={(formData.caracteristiques || []).includes(option)}
                                          onCheckedChange={() => handleCaracteristiqueToggle(option)}
                                        />
                                        <Label htmlFor={`caracteristique-edit-${option}`}>{option}</Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="description-edit">Description</Label>
                                  <Input
                                    id="description-edit"
                                    placeholder="Description de la chambre"
                                    value={formData.description}
                                    onChange={e => handleFormChange('description', e.target.value)}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Annuler</Button>
                                </DialogClose>
                                <Button onClick={handleSaveEdit}>Enregistrer</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <DropdownMenuItem onSelect={() => handleDeleteConfirmation(room.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette chambre ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteRoom}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomsPage;
