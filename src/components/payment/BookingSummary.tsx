
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BookingData {
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  roomPrice: number;
  totalPrice: number;
  taxes: number;
  grandTotal: number;
}

interface BookingSummaryProps {
  bookingData: BookingData;
  promoCode: string;
  setPromoCode: (value: string) => void;
  promoApplied: boolean;
  setPromoApplied: (value: boolean) => void;
  discountAmount: number;
  setDiscountAmount: (value: number) => void;
}

export const BookingSummary = ({
  bookingData,
  promoCode,
  setPromoCode,
  promoApplied,
  setPromoApplied,
  discountAmount,
  setDiscountAmount,
}: BookingSummaryProps) => {
  
  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') {
      const discount = bookingData.grandTotal * 0.1;
      setDiscountAmount(parseFloat(discount.toFixed(2)));
      setPromoApplied(true);
      toast({
        title: "Promo Code Applied",
        description: "You've received a 10% discount on your booking!",
      });
    } else if (promoCode.toUpperCase() === 'SUMMER20') {
      const discount = bookingData.grandTotal * 0.2;
      setDiscountAmount(parseFloat(discount.toFixed(2)));
      setPromoApplied(true);
      toast({
        title: "Promo Code Applied",
        description: "You've received a 20% discount on your booking!",
      });
    } else {
      toast({
        title: "Invalid Promo Code",
        description: "The promo code you entered is invalid or expired.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg">{bookingData.roomName}</h3>
        <div className="text-sm text-muted-foreground">
          {new Date(bookingData.checkIn).toLocaleDateString()} - {new Date(bookingData.checkOut).toLocaleDateString()}
        </div>
        <div className="text-sm">{bookingData.nights} nights · {bookingData.guests} guests</div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Room Rate ({bookingData.nights} nights)</span>
          <span>${bookingData.roomPrice} × {bookingData.nights}</span>
        </div>
        <div className="flex justify-between">
          <span>Room Total</span>
          <span>${bookingData.totalPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes & Fees (10%)</span>
          <span>${bookingData.taxes}</span>
        </div>
        
        {promoApplied && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${discountAmount}</span>
          </div>
        )}
      </div>
      
      <Separator />
      
      <div className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>${promoApplied ? (bookingData.grandTotal - discountAmount).toFixed(2) : bookingData.grandTotal}</span>
      </div>
      
      <div className="pt-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Promo Code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button 
            variant="outline" 
            onClick={applyPromoCode}
            type="button"
            disabled={!promoCode || promoApplied}
          >
            Apply
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Try codes: WELCOME10, SUMMER20</p>
      </div>

      <div className="mt-4 p-4 border border-muted rounded-lg">
        <h3 className="font-semibold mb-2 flex items-center">
          <Info className="h-4 w-4 mr-1" />
          Cancellation Policy
        </h3>
        <p className="text-sm text-muted-foreground">Free cancellation until 48 hours before check-in. After that, cancellations will incur a fee equal to the first night's stay.</p>
      </div>
    </div>
  );
};
