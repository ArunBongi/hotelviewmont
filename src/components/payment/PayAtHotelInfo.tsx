
import { ShieldCheck, CreditCard, Wallet, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const PayAtHotelInfo = () => {
  return (
    <div className="p-4 bg-muted rounded-lg">
      <h4 className="font-medium mb-2 flex items-center">
        <Wallet className="mr-2 h-5 w-5" />
        Pay at Hotel
      </h4>
      <p className="text-sm mb-2">You'll pay during check-in at the hotel.</p>
      
      <div className="my-4">
        <h5 className="text-sm font-medium flex items-center">
          <ShieldCheck className="mr-2 h-4 w-4 text-green-600" />
          Secure Reservation
        </h5>
        <p className="text-sm pl-6 mt-1">
          Your booking is 100% confirmed. We only need card details to guarantee your reservation.
        </p>
      </div>
      
      <Separator className="my-3" />
      
      <div className="my-4">
        <h5 className="text-sm font-medium flex items-center">
          <CreditCard className="mr-2 h-4 w-4" />
          Accepted Payment Methods
        </h5>
        <div className="pl-6 mt-2 flex flex-wrap gap-2">
          <div className="bg-background px-2 py-1 rounded text-xs border">Visa</div>
          <div className="bg-background px-2 py-1 rounded text-xs border">Mastercard</div>
          <div className="bg-background px-2 py-1 rounded text-xs border">American Express</div>
          <div className="bg-background px-2 py-1 rounded text-xs border">Cash</div>
        </div>
      </div>
      
      <Separator className="my-3" />
      
      <div className="mt-4">
        <h5 className="text-sm font-medium flex items-center">
          <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
          Important Notes
        </h5>
        <ul className="list-disc list-inside text-sm space-y-1 pl-6 mt-1">
          <li>A valid credit card is required to guarantee your booking</li>
          <li>Payment must be made upon arrival in full</li>
          <li>We accept credit cards, debit cards, and cash</li>
          <li>Some room types may require a security deposit</li>
        </ul>
      </div>
    </div>
  );
};
