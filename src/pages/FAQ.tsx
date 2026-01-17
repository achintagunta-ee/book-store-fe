
import React from 'react';
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ: React.FC = () => {
  const qa = [
    {
      q: "How can I track my order?",
      a: "You can track your order status in the 'Track Order' section of website using your order ID. We also send email updates at every step."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept payments via Razorpay, which supports all major Credit/Debit cards, UPI (Google Pay, PhonePe, etc.), Net Banking, and popular Wallets."
    },
    {
      q: "Can I return a book?",
      a: "Yes, you can return a book within 7 days of delivery if it is damaged, defective, or if you received the wrong item. Please refer to our Refund Policy for more details on the process."
    },
    {
      q: "Do you ship internationally?",
      a: "Currently, we only ship within India. We are working on expanding our delivery network to other countries soon. Stay tuned!"
    },
    {
        q: "How can I contact tracking support?",
        a: "You can reach our dedicated support team at support@hithabodha.com or call us at +91 98765 43210 between 9 AM and 6 PM IST."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
             <HelpCircle className="w-12 h-12 md:w-16 md:h-16 text-primary mx-auto mb-4 opacity-80" />
             <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-primary">Frequently Asked Questions</h1>
             <p className="text-stone-600 dark:text-stone-400 text-lg">Have questions? We're here to help.</p>
        </div>
        
        <div className="space-y-4 max-w-3xl mx-auto">
          {qa.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md">
                <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-6">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white pr-4">{item.q}</h3>
                        <span className="ml-2 flex-shrink-0 text-gray-400 group-open:-rotate-180 transition-transform duration-200">
                           <ChevronDown className="w-6 h-6" />
                        </span>
                    </summary>
                    <div className="px-6 pb-6 text-stone-600 dark:text-stone-300 leading-relaxed border-t border-gray-50 dark:border-gray-700/50 pt-4">
                        {item.a}
                    </div>
                </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
