
import { useState } from 'react';
import { bookings as initialBookings, Booking } from '@/utils/data';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowUpDown, 
  Edit, 
  Trash2, 
  Search,
  Calendar,
  Mail,
  User,
  CreditCard,
  CheckCircle, 
  XCircle, 
  AlertCircle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<{ field: keyof Booking; direction: 'asc' | 'desc' }>({
    field: 'checkIn',
    direction: 'desc',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const { toast } = useToast();

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter(booking => 
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const fieldA = a[sortBy.field];
      const fieldB = b[sortBy.field];
      
      // Handle string comparison
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortBy.direction === 'asc' 
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      
      // Handle number comparison
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortBy.direction === 'asc' 
          ? fieldA - fieldB
          : fieldB - fieldA;
      }
      
      return 0;
    });

  // Sort Handler
  const handleSort = (field: keyof Booking) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Edit Handler
  const handleEdit = (booking: Booking) => {
    setCurrentBooking({ ...booking });
    setIsDialogOpen(true);
  };

  // Delete Handler
  const handleDelete = (id: string) => {
    setBookings(bookings.filter(booking => booking.id !== id));
    
    toast({
      title: "Booking Deleted",
      description: "The booking has been successfully deleted",
    });
  };

  // Save Handler
  const handleSave = () => {
    if (!currentBooking) return;
    
    // Check if booking exists
    const existingBooking = bookings.find(booking => booking.id === currentBooking.id);
    
    if (existingBooking) {
      setBookings(bookings.map(booking => 
        booking.id === currentBooking.id ? currentBooking : booking
      ));
      
      toast({
        title: "Booking Updated",
        description: "The booking has been successfully updated",
      });
    }
    
    setIsDialogOpen(false);
    setCurrentBooking(null);
  };

  // Status Badge Component
  const StatusBadge = ({ status }: { status: Booking['status'] }) => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Confirmed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
            <AlertCircle className="h-3.5 w-3.5 mr-1" />
            Pending
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800">
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  // Payment Status Badge Component
  const PaymentBadge = ({ status }: { status: Booking['paymentStatus'] }) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
            <CreditCard className="h-3.5 w-3.5 mr-1" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
            <AlertCircle className="h-3.5 w-3.5 mr-1" />
            Pending
          </Badge>
        );
      case 'refunded':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800">
            <CreditCard className="h-3.5 w-3.5 mr-1" />
            Refunded
          </Badge>
        );
      default:
        return null;
    }
  };

  // Handle Select Change
  const handleSelectChange = (value: string, field: keyof Booking) => {
    if (!currentBooking) return;
    
    setCurrentBooking({
      ...currentBooking,
      [field]: value,
    });
  };

  // Handle Input Change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentBooking) return;
    
    const { name, value } = e.target;
    
    if (name === 'guests' || name === 'totalPrice') {
      setCurrentBooking({
        ...currentBooking,
        [name]: parseInt(value) || 0,
      });
    } else {
      setCurrentBooking({
        ...currentBooking,
        [name]: value,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Booking Management</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search bookings..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Bookings Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium px-1"
                  onClick={() => handleSort('id')}
                >
                  Booking ID
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium px-1"
                  onClick={() => handleSort('guestName')}
                >
                  Guest
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium px-1"
                  onClick={() => handleSort('roomName')}
                >
                  Room
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium px-1"
                  onClick={() => handleSort('checkIn')}
                >
                  Check-in
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium px-1"
                  onClick={() => handleSort('checkOut')}
                >
                  Check-out
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium px-1"
                  onClick={() => handleSort('status')}
                >
                  Status
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium px-1"
                  onClick={() => handleSort('paymentStatus')}
                >
                  Payment
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium px-1"
                  onClick={() => handleSort('totalPrice')}
                >
                  Total
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-gray-500" />
                        <span>{booking.guestName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{booking.guestEmail}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{booking.roomName}</TableCell>
                  <TableCell>{booking.checkIn}</TableCell>
                  <TableCell>{booking.checkOut}</TableCell>
                  <TableCell>
                    <StatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell>
                    <PaymentBadge status={booking.paymentStatus} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${booking.totalPrice}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(booking)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/10"
                        onClick={() => handleDelete(booking.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                  No bookings found matching your search
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Booking Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Booking #{currentBooking?.id}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkIn">Check-in Date</Label>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input 
                    id="checkIn"
                    name="checkIn"
                    type="date"
                    value={currentBooking?.checkIn || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="checkOut">Check-out Date</Label>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input 
                    id="checkOut"
                    name="checkOut"
                    type="date"
                    value={currentBooking?.checkOut || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="guests">Number of Guests</Label>
              <Input 
                id="guests"
                name="guests"
                type="number"
                min="1"
                value={currentBooking?.guests || 1}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="totalPrice">Total Price</Label>
              <div className="flex items-center mt-1">
                <span className="text-muted-foreground mr-2">$</span>
                <Input 
                  id="totalPrice"
                  name="totalPrice"
                  type="number"
                  min="0"
                  value={currentBooking?.totalPrice || 0}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Booking Status</Label>
                <Select 
                  value={currentBooking?.status || 'pending'} 
                  onValueChange={(value) => handleSelectChange(value, 'status')}
                >
                  <SelectTrigger id="status" className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select 
                  value={currentBooking?.paymentStatus || 'pending'} 
                  onValueChange={(value) => handleSelectChange(value, 'paymentStatus')}
                >
                  <SelectTrigger id="paymentStatus" className="mt-1">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingManagement;
