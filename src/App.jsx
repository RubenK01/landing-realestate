import React from 'react';
import VideoSection from './components/VideoSection';
import FormSection from './components/FormSection';
import './App.css';

function App() {
  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Main content with vertical padding and max width */}
      <div className="flex-1 flex flex-col lg:flex-row h-full items-center justify-center py-[2vh]">
        <div className="w-full max-w-[920px] flex flex-col lg:flex-row h-full mx-auto">
          {/* Video Section - 50% width on large screens, full width on mobile */}
          <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-4">
            <VideoSection />
          </div>
          {/* Form Section - 50% width on large screens, full width on mobile */}
          <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-4">
            <FormSection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
