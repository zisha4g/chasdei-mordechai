import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

const GalleryPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Events', 'Community'];

  const photos = [
    {
      image: 'https://zdaka.org.il/wp-content/uploads/2024/04/28165.jpg',
      title: 'Community Outreach Event',
      description: 'Annual gathering bringing together community members and volunteers',
      alt: 'Jewish community and charity work'
    },
    {
      image: 'https://ahblicklive.com/reklame/img/02/DVWmal.jpg',
      title: 'Volunteer Training Session',
      description: 'New volunteers learning about our programs and initiatives',
      alt: 'Jewish cultural celebration'
    },
    {
      image: 'https://ahblicklive.com/reklame/img/02/rtgUGT.jpg',
      title: 'Support Distribution',
      description: 'Providing essential resources to families in need',
      alt: 'Jewish heritage and traditions'
    },
    {
      image: 'https://ahblicklive.com/new_ded_img/26/06/medium/Is9Tw2qZObkiXl0SPk1/aH0coQ7_wide_m.png',
      title: 'Team Collaboration',
      description: 'Our dedicated team working together on community projects',
      alt: 'Jewish community gathering'
    },
    {
      image: 'https://zdaka.org.il/wp-content/uploads/2024/04/28165.jpg',
      title: 'Youth Program Activities',
      description: 'Engaging young people in meaningful community service',
      alt: 'Jewish community and charity work'
    },
    {
      image: 'https://ahblicklive.com/reklame/img/02/DVWmal.jpg',
      title: 'Fundraising Gala',
      description: 'Celebrating our achievements and raising funds for future programs',
      alt: 'Jewish cultural celebration'
    },
    {
      image: 'https://ahblicklive.com/reklame/img/02/rtgUGT.jpg',
      title: 'Educational Workshop',
      description: 'Providing skills training and educational opportunities',
      alt: 'Jewish heritage and traditions'
    },
    {
      image: 'https://ahblicklive.com/new_ded_img/26/06/medium/Is9Tw2qZObkiXl0SPk1/aH0coQ7_wide_m.png',
      title: 'Community Garden Project',
      description: 'Building sustainable food sources for local families',
      alt: 'Jewish community gathering'
    },
    {
      image: 'https://zdaka.org.il/wp-content/uploads/2024/04/28165.jpg',
      title: 'Holiday Celebration',
      description: 'Bringing joy and community spirit during the holiday season',
      alt: 'Jewish community and charity work'
    },
  ];

  return (
    <>
      <Helmet>
        <title>Photo Gallery - OurOrg | Our Work in Pictures</title>
        <meta
          name="description"
          content="Browse through our photo gallery showcasing community events, volunteer activities, and the impact of our programs."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Photo Gallery</h1>
            <p className="text-xl text-gray-600">
              Explore the moments that define our mission and impact
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <img
                  src={photo.image}
                  alt={photo.alt}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {photo.title}
                  </h3>
                  <p className="text-gray-600">{photo.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GalleryPage;