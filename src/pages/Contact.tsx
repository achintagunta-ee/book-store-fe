
import React from 'react';
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-center text-primary">Contact Us</h1>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-2xl md:p-10 flex flex-col justify-center h-full"> 
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Get in Touch</h2>
            <p className="mb-8 text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
              We'd love to hear from you. Whether you have a question about our books, pricing, or anything else, our team is ready to answer all your questions.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4 text-stone-700 dark:text-stone-200 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-transform hover:-translate-y-1">
                <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <Mail className="text-primary h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Email Us</p>
                  <span className="text-sm md:text-base break-all">support@hithabodha.com</span>
                </div>
              </div>
              
              <div className="flex items-start gap-4 text-stone-700 dark:text-stone-200 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-transform hover:-translate-y-1">
                 <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <Phone className="text-primary h-6 w-6" />
                </div>
                <div>
                   <p className="font-semibold text-gray-900 dark:text-white mb-1">Call Us</p>
                   <span className="text-sm md:text-base">+91 98765 43210</span>
                </div>
              </div>

               <div className="flex items-start gap-4 text-stone-700 dark:text-stone-200 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm transition-transform hover:-translate-y-1">
                 <div className="bg-primary/10 p-3 rounded-full shrink-0">
                  <MapPin className="text-primary h-6 w-6" />
                </div>
                <div>
                   <p className="font-semibold text-gray-900 dark:text-white mb-1">Visit Us</p>
                   <span className="text-sm md:text-base leading-snug">123 Book Street, Knowledge City,<br/>Bangalore - 560001</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-sm md:shadow-md border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white lg:hidden">Send a Message</h2>
            <form>
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 uppercase tracking-wider" htmlFor="name">
                  Name
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-700 dark:text-white"
                  id="name"
                  type="text"
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 uppercase tracking-wider" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-700 dark:text-white"
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                />
              </div>
              <div className="mb-8">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 uppercase tracking-wider" htmlFor="message">
                  Message
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-700 dark:text-white h-40 resize-none"
                  id="message"
                  placeholder="How can we help you?"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl focus:outline-none focus:shadow-outline transition-all transform active:scale-95 flex items-center justify-center gap-2"
                  type="button"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
