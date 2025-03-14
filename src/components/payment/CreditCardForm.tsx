
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface CreditCardFormProps {
  cardholderName: string;
  setCardholderName: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  expiryDate: string;
  setExpiryDate: (value: string) => void;
  cvv: string;
  setCvv: (value: string) => void;
  billingAddress: string;
  setBillingAddress: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  zipCode: string;
  setZipCode: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
  savePaymentInfo: boolean;
  setSavePaymentInfo: (value: boolean) => void;
}

export const CreditCardForm = ({
  cardholderName,
  setCardholderName,
  cardNumber,
  setCardNumber,
  expiryDate,
  setExpiryDate,
  cvv,
  setCvv,
  billingAddress,
  setBillingAddress,
  city,
  setCity,
  zipCode,
  setZipCode,
  country,
  setCountry,
  savePaymentInfo,
  setSavePaymentInfo,
}: CreditCardFormProps) => {
  
  // Format card number input
  const formatCardNumber = (value: string) => {
    const rawValue = value.replace(/\D/g, '');
    let formattedValue = '';
    
    for (let i = 0; i < rawValue.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += rawValue[i];
    }
    
    return formattedValue;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue.substring(0, 19)); // limit to 16 digits + 3 spaces
  };

  // Format expiry date
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setExpiryDate(value);
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cardholder-name">Cardholder Name</Label>
          <Input 
            id="cardholder-name" 
            placeholder="John Doe" 
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="card-number">Card Number</Label>
          <Input 
            id="card-number" 
            placeholder="1234 5678 9012 3456" 
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry-date">Expiry Date</Label>
            <Input 
              id="expiry-date" 
              placeholder="MM/YY" 
              value={expiryDate}
              onChange={handleExpiryDateChange}
              maxLength={5}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input 
              id="cvv" 
              placeholder="123" 
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              maxLength={4}
              required
            />
          </div>
        </div>
        
        <div className="pt-4">
          <h4 className="font-medium mb-2">Billing Address</h4>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input 
                id="address" 
                placeholder="123 Main St" 
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  placeholder="New York" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip-code">Zip Code</Label>
                <Input 
                  id="zip-code" 
                  placeholder="10001" 
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input 
                id="country" 
                placeholder="United States" 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox 
            id="save-payment" 
            checked={savePaymentInfo} 
            onCheckedChange={(checked) => setSavePaymentInfo(checked as boolean)}
          />
          <Label htmlFor="save-payment">Save this card for future bookings</Label>
        </div>
      </div>
    </div>
  );
};
