
import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 md:mb-12 text-center text-primary">About Hithabodha Book Store</h1>
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-sm md:shadow-md p-6 md:p-10 lg:p-12">
          <div className="prose prose-stone dark:prose-invert md:prose-lg max-w-none">
            <p className="mb-6 leading-relaxed">
              Welcome to <span className="font-bold text-primary">Hithabodha Book Store</span>, your number one source for all things books. We're dedicated to giving you the very best of literature, with a focus on dependability, customer service, and uniqueness.
            </p>
            <p className="mb-6 leading-relaxed">
              Founded in 2024, Hithabodha Book Store has come a long way from its beginnings. When we first started out, our passion for "bringing wisdom to your doorstep" drove us to do intense research and gave us the impetus to turn hard work and inspiration into to a booming online store. We now serve customers all over the country and are thrilled to be a part of the eco-friendly wing of the book industry.
            </p>
            <p className="mb-6 leading-relaxed">
              We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
            </p>
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
              <p className="font-display font-bold text-lg text-right text-primary">
                Sincerely,<br />
                The Hithabodha Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
