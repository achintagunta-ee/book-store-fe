
import React from 'react';

const Shipping: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-center text-primary">Shipping & Returns</h1>
         
         <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm md:shadow-md p-6 md:p-10 lg:p-12">
            <div className="prose prose-stone dark:prose-invert md:prose-lg max-w-none">
                
                <h2 className="text-2xl md:text-3xl font-bold mt-0 mb-6 text-primary border-b border-gray-100 dark:border-gray-700 pb-2">Shipping Policy</h2>
                <p>Thank you for visiting and shopping at Hithabodha Book Store. Following are the terms and conditions that constitute our Shipping Policy.</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">Domestic Shipping Policy</h3>
                <p>All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays.</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">Shipping Rates & Delivery Estimates</h3>
                <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
                <div className="my-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Method</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Delivery Time</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Standard Shipping</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">5-7 business days</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Rs. 50.00</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Express Shipping</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">2-3 business days</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Rs. 120.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                 <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-primary border-b border-gray-100 dark:border-gray-700 pb-2">Returns Policy</h2>
                 <p>Our Return & Refund Policy provides detailed information about options and procedures for returning your order.</p>
                 
                 <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">Conditions for Returns</h3>
                 <p>To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.</p>
                 <p>You have 7 calendar days to return an item from the date you received it.</p>

                 <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">How to Return</h3>
                 <p>To initiate a return, please contact our customer service team at <a href="mailto:returns@hithabodha.com" className="text-primary hover:underline">returns@hithabodha.com</a> with your order ID.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
