
import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-center text-primary">Terms of Service</h1>
         
         <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm md:shadow-md p-6 md:p-10 lg:p-12">
            <div className="prose prose-stone dark:prose-invert md:prose-lg max-w-none">
                <p className="mb-8 p-4 bg-primary/5 rounded-lg border-l-4 border-primary text-sm md:text-base">
                    <strong>Last Updated:</strong> January 15, 2026
                </p>

                <p className="lead text-lg mb-6">Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Hithabodha Book Store website operated by us.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">1. Conditions of Use</h2>
                <p>By using this website, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms. If you do not want to be bound by the terms of this Agreement, you are advised to leave the website accordingly.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">2. Privacy Policy</h2>
                <p>Before you continue using our website, we advise you to read our privacy policy regarding our user data collection. It will help you better understand our practices.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">3. Age Restriction</h2>
                <p>You must be at least 18 (eighteen) years of age before you can use this website. By using this website, you warrant that you are at least 18 years of age and you may legally adhere to this Agreement.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">4. Intellectual Property</h2>
                <p>You agree that all materials, products, and services provided on this website are the property of Hithabodha Book Store, its affiliates, directors, officers, employees, agents, suppliers, or licensors including all copyrights, trade secrets, trademarks, patents, and other intellectual property.</p>

                <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">5. User Accounts</h2>
                <p>As a user of this website, you may be asked to register with us and provide private information. You are responsible for ensuring the accuracy of this information, and you are responsible for maintaining the safety and security of your identifying information.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
