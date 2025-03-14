export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  size: number;
  images: string[];
  amenities: string[];
  featured: boolean;
  status: 'available' | 'booked' | 'maintenance';
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  createdAt: string;
}

export const rooms: Room[] = [
  {
    id: "1",
    name: 'Single Bedroom',
    description: 'Spacious room with king-sized bed',
    price: 125,
    capacity: 1,
    size: 40,
    images: [
      '../../public/rooms/single_bedroom1.jpg',
      '../../public/rooms/single_bedroom2.jpg',
      '../../public/rooms/bathroom1.jpg',
      '../../public/rooms/wash_area.jpeg'
    ],
    amenities: ['Free Wi-Fi', 'Air Conditioning', 'TV', 'Microwave', 'Refrigerator'],
    featured: true,
    status: 'available'
  },
  {
    id: "2",
    name: 'Standard Twin Room',
    description: 'Comfortable room with two twin beds',
    price: 145,
    capacity: 2,
    size: 45,
    images: [
      '../../public/rooms/double_bedroom1.jpeg',
      '../../public/rooms/double_bedroom2.jpeg',
      '../../public/rooms/bathroom2.jpeg',
      '../../public/rooms/wash_area1.jpeg'
    ],
    amenities: ['Free Wi-Fi', 'Breakfast', 'Air Conditioning', 'TV', 'Microwave', 'Refrigerator'],
    featured: false,
    status: 'available'
  },
];

export const bookings: Booking[] = [
  {
    id: "b1",
    roomId: "1",
    roomName: "Deluxe Mountain Suite",
    guestName: "John Smith",
    guestEmail: "john.smith@example.com",
    checkIn: "2023-10-15",
    checkOut: "2023-10-20",
    guests: 2,
    totalPrice: 1495,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2023-09-20T14:30:00Z"
  },
  {
    id: "b2",
    roomId: "2",
    roomName: "Premium Valley View",
    guestName: "Emma Johnson",
    guestEmail: "emma.j@example.com",
    checkIn: "2023-11-01",
    checkOut: "2023-11-05",
    guests: 2,
    totalPrice: 916,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2023-10-10T09:15:00Z"
  },
  {
    id: "b3",
    roomId: "3",
    roomName: "Family Suite",
    guestName: "David Wilson",
    guestEmail: "david.w@example.com",
    checkIn: "2023-10-22",
    checkOut: "2023-10-28",
    guests: 4,
    totalPrice: 2094,
    status: "pending",
    paymentStatus: "pending",
    createdAt: "2023-10-05T18:45:00Z"
  },
  {
    id: "b4",
    roomId: "5",
    roomName: "Luxury Penthouse",
    guestName: "Sophie Brown",
    guestEmail: "sophie.b@example.com",
    checkIn: "2023-12-24",
    checkOut: "2023-12-27",
    guests: 2,
    totalPrice: 1797,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2023-10-01T11:20:00Z"
  },
  {
    id: "b5",
    roomId: "4",
    roomName: "Executive Business Room",
    guestName: "Michael Chen",
    guestEmail: "michael.c@example.com",
    checkIn: "2023-10-18",
    checkOut: "2023-10-21",
    guests: 1,
    totalPrice: 777,
    status: "cancelled",
    paymentStatus: "refunded",
    createdAt: "2023-09-25T16:10:00Z"
  }
];

export const users = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@hotelviewmont.com",
    password: "admin123", // In a real app, this would be hashed
    role: "admin"
  },
  {
    id: "u2",
    name: "Guest User",
    email: "guest@example.com",
    password: "guest123", // In a real app, this would be hashed
    role: "guest"
  },
  {
    id: "u3",
    name: "Test User",
    email: "user@example.com",
    password: "password", // In a real app, this would be hashed
    role: "guest"
  }
];
