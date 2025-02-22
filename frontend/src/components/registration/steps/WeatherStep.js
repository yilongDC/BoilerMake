import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WiDaySunny, WiCloudy, WiSnow } from 'react-icons/wi';

const WeatherStep = ({ weather, updateData, onComplete, onBack }) => {
    const [sliderValue, setSliderValue] = useState(50);
    const [weatherType, setWeatherType] = useState('moderate');

    const WEATHER_POINTS = {
        cold: 0,
        moderate: 50,
        hot: 100
    };

    useEffect(() => {
        // Initialize slider based on weather preference
        switch(weather) {
            case 'cold': setSliderValue(WEATHER_POINTS.cold); break;
            case 'hot': setSliderValue(WEATHER_POINTS.hot); break;
            default: setSliderValue(WEATHER_POINTS.moderate);
        }
    }, [weather]);

    const handleSliderChange = (e) => {
        const value = parseInt(e.target.value);
        let newType;
        let snappedValue;

        // Determine closest snap point
        if (value < 25) {
            newType = 'cold';
            snappedValue = WEATHER_POINTS.cold;
        } else if (value < 75) {
            newType = 'moderate';
            snappedValue = WEATHER_POINTS.moderate;
        } else {
            newType = 'hot';
            snappedValue = WEATHER_POINTS.hot;
        }
        
        setSliderValue(snappedValue);
        setWeatherType(newType);
        updateData('weatherPreference', newType);
    };

    const getWeatherIcon = () => {
        switch(weatherType) {
            case 'cold': return <WiSnow className="weather-icon cold" />;
            case 'hot': return <WiDaySunny className="weather-icon hot" />;
            default: return <WiCloudy className="weather-icon moderate" />;
        }
    };

    return (
        <motion.div 
            className="w-full max-w-md mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">What's your preferred weather?</h1>
                
                <div className="mb-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={weatherType}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center"
                        >
                            {React.cloneElement(getWeatherIcon(), {
                                className: `w-20 h-20 mx-auto mb-4 ${
                                    weatherType === 'cold' ? 'text-blue-500' :
                                    weatherType === 'hot' ? 'text-orange-500' :
                                    'text-gray-500'
                                }`
                            })}
                            <h2 className="text-xl font-semibold text-gray-700">
                                {weatherType.toUpperCase()}
                            </h2>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between mb-2 text-sm font-medium">
                        <span className={`${weatherType === 'cold' ? 'text-blue-500' : 'text-gray-600'}`}>Cold</span>
                        <span className={`${weatherType === 'moderate' ? 'text-gray-700' : 'text-gray-600'}`}>Moderate</span>
                        <span className={`${weatherType === 'hot' ? 'text-orange-500' : 'text-gray-600'}`}>Hot</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="50"
                        value={sliderValue}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-gradient-to-r from-blue-500 via-gray-400 to-orange-500 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="flex space-x-4">
                    <button 
                        onClick={onBack}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                    >
                        Back
                    </button>
                    <button 
                        onClick={onComplete}
                        className="flex-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition"
                    >
                        Complete
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default WeatherStep;
