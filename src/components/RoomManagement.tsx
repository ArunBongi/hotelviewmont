
import { useState } from 'react';
import { rooms as initialRooms, Room } from '@/utils/data';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowUpDown, 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  BedDouble, 
  DollarSign,
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle
} from 'lucide-react';

const RoomManagement = () => {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<{ field: keyof Room; direction: 'asc' | 'desc' }>({
    field: 'id',
    direction: 'asc',
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const { toast } = useToast();

  // Filter and sort rooms
  const filteredRooms = rooms
    .filter(room => 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      room.id.toLowerCase().includes(searchTerm.toLowerCase())
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
      
      // Handle boolean comparison
      if (typeof fieldA === 'boolean' && typeof fieldB === 'boolean') {
        return sortBy.direction === 'asc' 
          ? Number(fieldA) - Number(fieldB)
          : Number(fieldB) - Number(fieldA);
      }
      
      return 0;
    });

  // Sort Handler
  const handleSort = (field: keyof Room) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Edit Handler
  const handleEdit = (room: Room) => {
    setCurrentRoom({ ...room });
    setIsDialogOpen(true);
  };

  // Create Handler
  const handleCreate = () => {
    const newRoom: Room = {
      id: `${rooms.length + 1}`,
      name: '',
      description: '',
      price: 0,
      capacity: 1,
      size: 0,
      amenities: [],
      images: [],
      featured: false,
      status: 'available',
    };
    
    setCurrentRoom(newRoom);
    setIsDialogOpen(true);
  };

  // Delete Handler
  const handleDelete = (id: string) => {
    setRooms(rooms.filter(room => room.id !== id));
    
    toast({
      title: "Room Deleted",
      description: "The room has been successfully deleted",
    });
  };

  // Save Handler
  const handleSave = () => {
    if (!currentRoom) return;
    
    // Validation
    if (!currentRoom.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Room name is required",
        variant: "destructive",
      });
      return;
    }
    
    // Check if it's a new room or an existing one
    const isNewRoom = !rooms.some(room => room.id === currentRoom.id);
    
    if (isNewRoom) {
      setRooms([...rooms, currentRoom]);
      
      toast({
        title: "Room Created",
        description: "The new room has been successfully added",
      });
    } else {
      setRooms(rooms.map(room => 
        room.id === currentRoom.id ? currentRoom : room
      ));
      
      toast({
        title: "Room Updated",
        description: "The room has been successfully updated",
      });
    }
    
    setIsDialogOpen(false);
    setCurrentRoom(null);
  };

  // Input Change Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!currentRoom) return;
    
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'capacity' || name === 'size') {
      setCurrentRoom({
        ...currentRoom,
        [name]: parseInt(value) || 0,
      });
    } else {
      setCurrentRoom({
        ...currentRoom,
        [name]: value,
      });
    }
  };

  // Checkbox Change Handler
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentRoom) return;
    
    const { name, checked } = e.target;
    
    setCurrentRoom({
      ...currentRoom,
      [name]: checked,
    });
  };

  // Status Badge Component
  const StatusBadge = ({ status }: { status: Room['status'] }) => {
    switch (status) {
      case 'available':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Available
          </Badge>
        );
      case 'booked':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800">
            <Users className="h-3.5 w-3.5 mr-1" />
            Booked
          </Badge>
        );
      case 'maintenance':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
            <AlertCircle className="h-3.5 w-3.5 mr-1" />
            Maintenance
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold">Room Management</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search rooms..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="whitespace-nowrap" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Room
          </Button>
        </div>
      </div>
      
      {/* Rooms Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium px-1"
                  onClick={() => handleSort('id')}
                >
                  ID
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium px-1"
                  onClick={() => handleSort('name')}
                >
                  Room Name
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium px-1"
                  onClick={() => handleSort('price')}
                >
                  Price
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium px-1"
                  onClick={() => handleSort('capacity')}
                >
                  Capacity
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-medium px-1"
                  onClick={() => handleSort('featured')}
                >
                  Featured
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
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
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="font-medium">{room.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BedDouble className="h-4 w-4 text-gray-500" />
                      <span>{room.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span>{room.price}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{room.capacity}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {room.featured ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-300 mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={room.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(room)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/10"
                        onClick={() => handleDelete(room.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  No rooms found matching your search
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit/Create Room Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentRoom && rooms.some(room => room.id === currentRoom.id) 
                ? "Edit Room"
                : "Create New Room"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-2">
            <div>
              <Label htmlFor="name">Room Name</Label>
              <Input 
                id="name"
                name="name"
                value={currentRoom?.name || ''}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price per Night</Label>
                <Input 
                  id="price"
                  name="price"
                  type="number"
                  value={currentRoom?.price || 0}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input 
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={currentRoom?.capacity || 1}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="size">Room Size (m²)</Label>
              <Input 
                id="size"
                name="size"
                type="number"
                value={currentRoom?.size || 0}
                onChange={handleInputChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                name="description"
                value={currentRoom?.description || ''}
                onChange={handleInputChange}
                rows={3}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                checked={currentRoom?.featured || false}
                onChange={handleCheckboxChange}
              />
              <Label htmlFor="featured" className="text-sm cursor-pointer">
                Feature this room on homepage
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomManagement;
