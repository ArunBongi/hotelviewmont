
export const BankTransferInfo = () => {
  return (
    <div className="p-4 bg-muted rounded-lg">
      <h4 className="font-medium mb-2">Bank Transfer Instructions</h4>
      <p className="text-sm mb-4">Please transfer the total amount to our bank account:</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>Bank Name:</div>
        <div className="font-medium">Viewmont International Bank</div>
        <div>Account Number:</div>
        <div className="font-medium">8234 5678 9012</div>
        <div>Account Name:</div>
        <div className="font-medium">Hotel Viewmont Ltd</div>
        <div>Reference:</div>
        <div className="font-medium">BOOKING-{Math.floor(10000 + Math.random() * 90000)}</div>
      </div>
      <p className="text-sm mt-4">Your booking will be confirmed once we receive the payment.</p>
    </div>
  );
};
