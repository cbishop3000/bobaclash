import React from 'react';

const MapEmbed: React.FC = () => {
  return (
    <section className="flex justify-center py-6">
      <div className="w-full max-w-md p-4 bg-white rounded-2xl shadow-xl space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Clash Coffee Boba Lemonade</h2>
          <p className="text-sm text-gray-600">39993 Highway 41, Oakhurst, CA 93644</p>
        </div>
        <div className="w-full h-64 rounded-lg overflow-hidden">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=39993+Highway+41,+Oakhurst,+CA+93644&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default MapEmbed;
