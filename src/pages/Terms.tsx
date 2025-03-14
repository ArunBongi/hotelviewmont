import Layout from '@/components/Layout';

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using Hotel Viewmont's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Booking and Cancellation</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>All bookings are subject to availability</li>
                <li>Valid payment method required for all bookings</li>
                <li>Cancellations must be made at least 24 hours before check-in</li>
                <li>Late cancellations may incur charges</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Check-in and Check-out</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Check-in time: 11:00 AM</li>
                <li>Check-out time: 10:00 AM</li>
                <li>Early check-in and late check-out subject to availability</li>
                <li>Valid ID required at check-in</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Room Rules</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>No smoking in rooms</li>
                <li>Pets allowed in designated rooms only</li>
                <li>Maximum occupancy must be respected</li>
                <li>Damage to property will be charged</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Payment and Rates</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>All rates are in Canadian Dollars</li>
                <li>Taxes not included in displayed rates</li>
                <li>Payment processed at time of booking</li>
                <li>Refunds processed within 5-7 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Contact Information</h2>
              <p>For questions about these Terms of Service, please contact us at:</p>
              <p>Email: viewmonthotel@gmail.com</p>
              <p>Phone: +1 (250) 299-9019</p>
              <p>Address: 19 Apex Dr, Logan Lake, BC V0K 1W0</p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms; 