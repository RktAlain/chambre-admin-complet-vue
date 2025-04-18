
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format, addDays, startOfWeek, addWeeks, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { reservations, rooms } from '@/data/mockData';
import { Room, Reservation, ReservationStatus } from '@/types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const DAYS_OF_WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const VIEW_MODES = ['Semaine', 'Mois'];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'Semaine' | 'Mois'>('Semaine');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  const handlePrevious = () => {
    setCurrentDate(viewMode === 'Semaine' ? addWeeks(currentDate, -1) : addDays(currentDate, -30));
  };
  
  const handleNext = () => {
    setCurrentDate(viewMode === 'Semaine' ? addWeeks(currentDate, 1) : addDays(currentDate, 30));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  const getDaysToShow = () => {
    const days = [];
    const numDays = viewMode === 'Semaine' ? 7 : 30;
    
    for (let i = 0; i < numDays; i++) {
      days.push(addDays(startDate, i));
    }
    
    return days;
  };
  
  const getFilteredRooms = () => {
    if (!selectedRoom) return rooms;
    return rooms.filter(room => room.id === selectedRoom);
  };
  
  const getReservationsForRoomAndDay = (roomId: string, day: Date) => {
    return reservations.filter(reservation => {
      const reservationStart = new Date(reservation.dateArrivee);
      const reservationEnd = new Date(reservation.dateDepart);
      
      const isDateInRange = 
        (day >= reservationStart && day < reservationEnd) || 
        isSameDay(day, reservationStart);
      
      return reservation.chambreId === roomId && isDateInRange;
    });
  };
  
  const getReservationStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.CONFIRMEE:
        return 'bg-green-500';
      case ReservationStatus.EN_ATTENTE:
        return 'bg-amber-500';
      case ReservationStatus.ANNULEE:
        return 'bg-red-500';
      case ReservationStatus.TERMINEE:
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const daysToShow = getDaysToShow();
  const filteredRooms = getFilteredRooms();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Calendrier des réservations</h1>
      </div>
      
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={handlePrevious} title="Précédent">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleToday}>Aujourd'hui</Button>
              <Button variant="outline" size="icon" onClick={handleNext} title="Suivant">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <CardTitle>
                {viewMode === 'Semaine' 
                  ? `${format(startDate, 'dd MMM', { locale: fr })} - ${format(addDays(startDate, 6), 'dd MMM yyyy', { locale: fr })}`
                  : format(currentDate, 'MMMM yyyy', { locale: fr })
                }
              </CardTitle>
            </div>
            <div className="flex space-x-4">
              <div className="w-[200px]">
                <Select value={viewMode} onValueChange={(value) => setViewMode(value as 'Semaine' | 'Mois')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Vue" />
                  </SelectTrigger>
                  <SelectContent>
                    {VIEW_MODES.map(mode => (
                      <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[200px]">
                <Select 
                  value={selectedRoom || ''} 
                  onValueChange={(value) => setSelectedRoom(value || null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les chambres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les chambres</SelectItem>
                    {rooms.map(room => (
                      <SelectItem key={room.id} value={room.id}>
                        Chambre {room.numero}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-[100px_repeat(auto-fill,minmax(120px,1fr))]">
              {/* En-tête avec les jours */}
              <div className="bg-muted py-2 px-3 font-medium border-b">
                Chambre
              </div>
              {daysToShow.map((day, i) => {
                const isToday = isSameDay(day, new Date());
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "py-2 px-3 text-center font-medium border-b border-l",
                      isToday ? "bg-blue-50" : "bg-muted"
                    )}
                  >
                    <div>{DAYS_OF_WEEK[day.getDay() === 0 ? 6 : day.getDay() - 1]}</div>
                    <div className={isToday ? "text-blue-600 font-bold" : ""}>
                      {format(day, 'dd/MM')}
                    </div>
                  </div>
                );
              })}
              
              {/* Lignes pour chaque chambre */}
              {filteredRooms.map(room => (
                <div 
                  key={room.id} 
                  className="contents"
                >
                  <div className="py-4 px-3 font-medium border-b">
                    {room.numero}
                    <div className="text-xs text-muted-foreground">{room.type}</div>
                  </div>
                  
                  {daysToShow.map((day, dayIndex) => {
                    const reservationsForDay = getReservationsForRoomAndDay(room.id, day);
                    const isToday = isSameDay(day, new Date());
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className={cn(
                          "min-h-16 p-1 border-b border-l relative",
                          isToday ? "bg-blue-50" : ""
                        )}
                      >
                        {reservationsForDay.map(reservation => {
                          const isArrival = isSameDay(reservation.dateArrivee, day);
                          
                          return (
                            <TooltipProvider key={reservation.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div 
                                    className={cn(
                                      "mb-1 px-2 py-1 text-xs rounded-sm text-white cursor-pointer",
                                      getReservationStatusColor(reservation.statut),
                                      isArrival ? "border-l-4 border-white" : ""
                                    )}
                                    onClick={() => setSelectedReservation(reservation)}
                                  >
                                    Rés. #{reservation.id.split('-')[1]}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="font-medium">
                                    Réservation #{reservation.id.split('-')[1]}
                                  </p>
                                  <p className="text-xs">
                                    Du {format(reservation.dateArrivee, 'dd/MM/yyyy')} au {format(reservation.dateDepart, 'dd/MM/yyyy')}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-4 mt-4 text-sm">
            <div className="flex items-center">
              <Badge className="bg-green-500 w-3 h-3 rounded-full mr-1" />
              <span>Confirmée</span>
            </div>
            <div className="flex items-center">
              <Badge className="bg-amber-500 w-3 h-3 rounded-full mr-1" />
              <span>En attente</span>
            </div>
            <div className="flex items-center">
              <Badge className="bg-red-500 w-3 h-3 rounded-full mr-1" />
              <span>Annulée</span>
            </div>
            <div className="flex items-center">
              <Badge className="bg-blue-500 w-3 h-3 rounded-full mr-1" />
              <span>Terminée</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialogue pour afficher les détails d'une réservation */}
      <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détails de la réservation</DialogTitle>
            <DialogDescription>
              Informations sur la réservation sélectionnée
            </DialogDescription>
          </DialogHeader>
          
          {selectedReservation && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID de réservation</p>
                  <p className="font-medium">{selectedReservation.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <Badge className={cn(
                    "mt-1",
                    selectedReservation.statut === ReservationStatus.CONFIRMEE ? "bg-green-100 text-green-800" :
                    selectedReservation.statut === ReservationStatus.EN_ATTENTE ? "bg-amber-100 text-amber-800" :
                    selectedReservation.statut === ReservationStatus.ANNULEE ? "bg-red-100 text-red-800" :
                    "bg-blue-100 text-blue-800"
                  )}>
                    {selectedReservation.statut}
                  </Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Chambre</p>
                <p className="font-medium">
                  {rooms.find(room => room.id === selectedReservation.chambreId)?.numero || "N/A"}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date d'arrivée</p>
                  <p className="font-medium">{format(selectedReservation.dateArrivee, 'dd/MM/yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de départ</p>
                  <p className="font-medium">{format(selectedReservation.dateDepart, 'dd/MM/yyyy')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre de personnes</p>
                  <p className="font-medium">{selectedReservation.nombrePersonnes}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prix total</p>
                  <p className="font-medium">{selectedReservation.prixTotal} €</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Commentaires</p>
                <p>{selectedReservation.commentaires || "Aucun commentaire"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
