
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Landmark, Wallet } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
}

export const PaymentMethodSelector = ({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentMethodSelectorProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Payment Method</h3>
      <RadioGroup 
        value={paymentMethod} 
        onValueChange={onPaymentMethodChange}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="border rounded-lg p-4 flex items-center space-x-3 cursor-pointer hover:bg-muted">
          <RadioGroupItem value="credit-card" id="credit-card" />
          <Label htmlFor="credit-card" className="flex items-center cursor-pointer">
            <CreditCard className="mr-2 h-5 w-5" />
            Credit Card
          </Label>
        </div>
        <div className="border rounded-lg p-4 flex items-center space-x-3 cursor-pointer hover:bg-muted">
          <RadioGroupItem value="bank-transfer" id="bank-transfer" />
          <Label htmlFor="bank-transfer" className="flex items-center cursor-pointer">
            <Landmark className="mr-2 h-5 w-5" />
            Bank Transfer
          </Label>
        </div>
        <div className="border rounded-lg p-4 flex items-center space-x-3 cursor-pointer hover:bg-muted">
          <RadioGroupItem value="pay-at-hotel" id="pay-at-hotel" />
          <Label htmlFor="pay-at-hotel" className="flex items-center cursor-pointer">
            <Wallet className="mr-2 h-5 w-5" />
            Pay at Hotel
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
