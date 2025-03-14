
import { Textarea } from "@/components/ui/textarea";
import { Info, BedDouble, Baby, Utensils, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SpecialRequestsInputProps {
  specialRequests: string;
  setSpecialRequests: (value: string) => void;
}

export const SpecialRequestsInput = ({
  specialRequests,
  setSpecialRequests,
}: SpecialRequestsInputProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const commonRequests = [
    { icon: <BedDouble className="h-4 w-4" />, text: "King bed preferred" },
    { icon: <Clock className="h-4 w-4" />, text: "Early check-in (around 12pm)" },
    { icon: <Clock className="h-4 w-4" />, text: "Late check-out (around 2pm)" },
    { icon: <Baby className="h-4 w-4" />, text: "Baby crib needed" },
    { icon: <Utensils className="h-4 w-4" />, text: "Dietary restrictions: vegetarian meals" },
    { icon: <BedDouble className="h-4 w-4" />, text: "Room on a higher floor" },
    { icon: <BedDouble className="h-4 w-4" />, text: "Room with a view" },
  ];
  
  const addRequest = (request: string) => {
    const newValue = specialRequests 
      ? `${specialRequests}\n${request}` 
      : request;
    setSpecialRequests(newValue);
  };

  return (
    <div className="pt-4 space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Special Requests</h4>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowSuggestions(!showSuggestions)}
          className="text-xs flex items-center"
        >
          <Info className="h-3.5 w-3.5 mr-1" />
          {showSuggestions ? 'Hide suggestions' : 'Show suggestions'}
        </Button>
      </div>
      
      {showSuggestions && (
        <div className="bg-muted p-3 rounded-md mb-2">
          <p className="text-sm mb-2">Common requests (click to add):</p>
          <div className="flex flex-wrap gap-2">
            {commonRequests.map((request, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                className="text-xs flex items-center gap-1.5 h-8 bg-background"
                onClick={() => addRequest(request.text)}
              >
                {request.icon}
                {request.text}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <Textarea
        className="w-full min-h-[100px]"
        placeholder="Any special requests for your stay? (e.g., early check-in, room preferences, dietary restrictions)"
        value={specialRequests}
        onChange={(e) => setSpecialRequests(e.target.value)}
      />
      <p className="text-xs text-muted-foreground">
        * We'll do our best to accommodate your requests, but please note they are subject to availability and cannot be guaranteed.
      </p>
    </div>
  );
};
