
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Room, rooms } from '@/utils/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { CalendarIcon, CreditCard, Users } from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';

interface BookingFormProps {
  preselectedRoomId?: string;
}

const BookingForm = ({ preselectedRoomId }: BookingFormProps) => {
  const [searchParams] = useSearchParams();
  const roomIdParam = searchParams.get('roomId') || preselectedRoomId;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    roomId: roomIdParam || '',
    checkIn: new Date(),
    checkOut: addDays(new Date(), 2),
    guests: 1,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const selectedRoom: Room | undefined = rooms.find(room => room.id === formData.roomId);
  const nightsCount = differenceInDays(formData.checkOut, formData.checkIn);
  const subtotal = selectedRoom ? selectedRoom.price * nightsCount : 0;
  const tax = subtotal * 0.12; // 12% tax
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoomChange = (value: string) => {
    setFormData(prev => ({ ...prev, roomId: value }));
  };
  
  const handleCheckInChange = (date: Date | undefined) => {
    if (!date) return;
    
    // Ensure checkout is at least one day after checkin
    const currentCheckOut = formData.checkOut;
    const newCheckOut = differenceInDays(currentCheckOut, date) < 1 
      ? addDays(date, 1) 
      : currentCheckOut;
    
    setFormData(prev => ({ 
      ...prev, 
      checkIn: date,
      checkOut: newCheckOut
    }));
  };
  
  const handleCheckOutChange = (date: Date | undefined) => {
    if (!date) return;
    setFormData(prev => ({ ...prev, checkOut: date }));
  };
  
  const handleGuestsChange = (value: string) => {
    setFormData(prev => ({ ...prev, guests: parseInt(value) }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRoom) {
      toast({
        title: "Error",
        description: "Please select a room to continue",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Booking Successful!",
        description: "Your booking has been confirmed. Check your email for details.",
      });
      
      navigate('/booking-confirmation', { 
        state: { 
          booking: {
            ...formData,
            roomName: selectedRoom.name,
            total,
            bookingId: `BK-${Math.floor(Math.random() * 10000)}`,
            createdAt: new Date().toISOString()
          } 
        } 
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="md:col-span-2 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="roomId">Select Room</Label>
            <Select
              value={formData.roomId}
              onValueChange={handleRoomChange}
              required
            >
              <SelectTrigger id="roomId" className="mt-1">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map(room => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} - ${room.price}/night
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="guests">Number of Guests</Label>
            <Select
              value={formData.guests.toString()}
              onValueChange={handleGuestsChange}
              disabled={!selectedRoom}
              required
            >
              <SelectTrigger id="guests" className="mt-1">
                <SelectValue placeholder="Select number of guests" />
              </SelectTrigger>
              <SelectContent>
                {selectedRoom && Array.from({ length: selectedRoom.capacity }, (_, i) => i + 1).map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
                {!selectedRoom && (
                  <SelectItem value="1">1 Guest</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Check-in Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left mt-1"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.checkIn ? format(formData.checkIn, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.checkIn}
                  onSelect={handleCheckInChange}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label>Check-out Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left mt-1"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.checkOut ? format(formData.checkOut, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.checkOut}
                  onSelect={handleCheckOutChange}
                  initialFocus
                  disabled={(date) => 
                    date <= formData.checkIn || 
                    date < new Date()
                  }
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white"
            disabled={isSubmitting || !formData.roomId}
          >
            {isSubmitting ? "Processing..." : "Complete Booking"}
          </Button>
        </div>
      </form>
      
      <div className="md:col-span-1">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
            
            {selectedRoom ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Selected Room:</span>
                  <span className="font-medium">{selectedRoom.name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Check-in:</span>
                  <span>{format(formData.checkIn, 'PP')}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Check-out:</span>
                  <span>{format(formData.checkOut, 'PP')}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>Guests:</span>
                    </div>
                  </span>
                  <span>{formData.guests}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Duration:</span>
                  <span>{nightsCount} {nightsCount === 1 ? 'night' : 'nights'}</span>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Subtotal:
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Tax (12%):
                    </span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-2 border-t font-semibold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 pt-2">
                  <div className="flex items-center gap-1">
                    <CreditCard size={14} />
                    <span>We accept all major credit cards</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 opacity-70">
                <p>Please select a room to see booking details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingForm;
