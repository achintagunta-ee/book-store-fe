
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
       <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-center text-primary">Privacy Policy</h1>
        
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm md:shadow-md p-6 md:p-10 lg:p-12">
            <div className="prose prose-stone dark:prose-invert md:prose-lg max-w-none">
                <p className="mb-8 p-4 bg-primary/5 rounded-lg border-l-4 border-primary text-sm md:text-base">
                    <strong>Last Updated:</strong> January 15, 2026
                </p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">1. Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This may include your name, email address, phone number, shipping address, and payment information.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                    <li>Process your orders and payments securely.</li>
                    <li>Communicate with you about your account status and order updates.</li>
                    <li>Send you newsletters and promotional materials (you can opt-out at any time).</li>
                    <li>Improve our website functionality and customer service experience.</li>
                </ul>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">3. Sharing of Information</h2>
                <p>We do not share your personal information with third parties, except as necessary to process your payments (e.g., Razorpay) or ship your orders (logistics partners).</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">4. Security</h2>
                <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. We use industry-standard encryption for sensitive data.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">5. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@hithabodha.com" className="text-primary hover:underline">privacy@hithabodha.com</a>.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
