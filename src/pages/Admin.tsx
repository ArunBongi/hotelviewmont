
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import RoomManagement from '@/components/RoomManagement';
import BookingManagement from '@/components/BookingManagement';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUp, ArrowDown, Users, Calendar, DollarSign, BedDouble, LogOut } from 'lucide-react';

// Sample data for dashboard
const dashboardData = {
  totalBookings: 245,
  bookingsChange: 12.5,
  revenue: 89750,
  revenueChange: 8.2,
  occupancyRate: 76,
  occupancyChange: -2.3,
  upcomingCheckIns: 18,
  
  recentBookings: [
    { id: 'B-1001', room: 'Deluxe Mountain Suite', guest: 'John Smith', checkIn: '2023-07-15', checkOut: '2023-07-18', amount: 597 },
    { id: 'B-1002', room: 'Premium Valley View', guest: 'Sarah Johnson', checkIn: '2023-07-16', checkOut: '2023-07-20', amount: 1196 },
    { id: 'B-1003', room: 'Standard Twin Room', guest: 'Michael Brown', checkIn: '2023-07-17', checkOut: '2023-07-19', amount: 298 },
    { id: 'B-1004', room: 'Executive Suite', guest: 'Emily Davis', checkIn: '2023-07-18', checkOut: '2023-07-22', amount: 1396 },
    { id: 'B-1005', room: 'Deluxe Mountain Suite', guest: 'Robert Wilson', checkIn: '2023-07-18', checkOut: '2023-07-21', amount: 597 }
  ]
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8 bg-background overflow-auto">
        <Tabs defaultValue="dashboard">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Hotelviewmont Admin</h1>
              <p className="text-muted-foreground">Welcome, {user?.name}</p>
            </div>
            <div className="flex gap-2 items-center">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="rooms">Rooms</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Users size={18} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalBookings}</div>
                  <div className={`flex items-center text-sm ${dashboardData.bookingsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {dashboardData.bookingsChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    <span>{Math.abs(dashboardData.bookingsChange)}% from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign size={18} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dashboardData.revenue.toLocaleString()}</div>
                  <div className={`flex items-center text-sm ${dashboardData.revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {dashboardData.revenueChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    <span>{Math.abs(dashboardData.revenueChange)}% from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                  <BedDouble size={18} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.occupancyRate}%</div>
                  <div className={`flex items-center text-sm ${dashboardData.occupancyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {dashboardData.occupancyChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    <span>{Math.abs(dashboardData.occupancyChange)}% from last month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Check-ins</CardTitle>
                  <Calendar size={18} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.upcomingCheckIns}</div>
                  <div className="text-sm text-muted-foreground">Today</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Recent hotel reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="pb-2">Booking ID</th>
                        <th className="pb-2">Room</th>
                        <th className="pb-2">Guest</th>
                        <th className="pb-2">Check-in</th>
                        <th className="pb-2">Check-out</th>
                        <th className="pb-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentBookings.map((booking) => (
                        <tr key={booking.id} className="border-b">
                          <td className="py-3">{booking.id}</td>
                          <td className="py-3">{booking.room}</td>
                          <td className="py-3">{booking.guest}</td>
                          <td className="py-3">{booking.checkIn}</td>
                          <td className="py-3">{booking.checkOut}</td>
                          <td className="py-3 text-right">${booking.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" onClick={() => navigate('/admin/bookings')}>View All Bookings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rooms">
            <RoomManagement />
          </TabsContent>
          
          <TabsContent value="bookings">
            <BookingManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
