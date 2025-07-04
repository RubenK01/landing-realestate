import React from 'react';
import VideoSection from '../components/VideoSection';
import FormSection from '../components/FormSection';

const Home = ({ formHeight, setFormHeight }) => {
  return (
    <div className="w-full max-w-[1100px] flex flex-col lg:flex-row mx-auto my-auto">
      {/* Video Section - 60% width on large screens, full width on mobile */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-4">
        <VideoSection maxHeight={formHeight ? formHeight + 'px' : undefined} />
      </div>
      {/* Form Section - 40% width on large screens, full width on mobile */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4">
        <FormSection onHeightChange={setFormHeight} />
      </div>
    </div>
  );
};

export default Home; 