import Layout from '@/components/Layout';

const CookiePolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
              <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Remembering your preferences</li>
                <li>Keeping you signed in</li>
                <li>Understanding how you use our website</li>
                <li>Improving our services based on your behavior</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Managing Cookies</h2>
              <p>You can control cookies through your browser settings. You can:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Delete all cookies</li>
                <li>Block new cookies</li>
                <li>Allow only certain cookies</li>
                <li>Browse in private/incognito mode</li>
              </ul>
              <p>Note: Blocking cookies may affect website functionality</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
              <p>We use services from these third parties that may place cookies:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Google Analytics</li>
                <li>Payment processors</li>
                <li>Social media platforms</li>
                <li>Advertising networks</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
              <p>If you have questions about our Cookie Policy, please contact us at:</p>
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

export default CookiePolicy; 