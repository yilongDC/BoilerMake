import React from 'react';

const Pin = ({ id }) => (
  <div className="relative group">
    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full animate-bounce-gentle">
      <div className="w-7 h-10 relative cursor-pointer group">
        {/* Pin head */}
        <div className="absolute top-0 left-0 right-0 h-7 bg-gradient-to-br from-blue-400 to-blue-600 
          rounded-full shadow-lg flex items-center justify-center
          transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
          <span className="text-lg text-white drop-shadow-md">💧</span>
        </div>
        {/* Pin tail */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2
          w-3 h-4 bg-gradient-to-br from-blue-500 to-blue-700
          clip-path-triangle shadow-md
          transition-all duration-300 group-hover:scale-110">
        </div>
        {/* Pin shadow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2
          w-4 h-1 bg-black/20 rounded-full blur-sm
          transition-all duration-300 group-hover:scale-110">
        </div>
      </div>
    </div>
  </div>
);

export default Pin;
