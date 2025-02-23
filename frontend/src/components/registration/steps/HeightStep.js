import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaChevronUp } from 'react-icons/fa';

const HeightStep = ({ height, sex, updateData, onNext, onBack }) => {
    const DEFAULT_HEIGHTS = {
        male: {
            cm: 170,
            ft: 67  // 5'7" in inches
        },
        female: {
            cm: 160,
            ft: 63  // 5'3" in inches
        }
    };

    const ITEM_HEIGHT = 60;
    const [unit, setUnit] = useState(height.unit || 'cm');
    const [value, setValue] = useState(height.value || (sex ? DEFAULT_HEIGHTS[sex][unit] : null));
    const pickerRef = useRef(null);
    const initialRender = useRef(true);

    const heightRanges = {
        cm: Array.from({ length: 121 }, (_, i) => i + 130), // 130-250 cm
        ft: Array.from({ length: 48 }, (_, i) => i + 48)    // 4'0" - 7'11"
    };

    const formatHeight = (val) => {
        if (unit === 'ft') {
            const feet = Math.floor(val / 12);
            const inches = val % 12;
            return `${feet}'${inches}"`;
        }
        return `${val} cm`;
    };

    const handleScroll = (e) => {
        const scrollPos = e.target.scrollTop;
        const index = Math.floor(scrollPos / ITEM_HEIGHT);
        const newValue = heightRanges[unit][index];
        if (newValue) {
            setValue(newValue);
            updateData('height', { value: newValue, unit });
        }
    };

    const scrollToHeight = useCallback((val, smooth = true) => {
        if (pickerRef.current) {
            const index = heightRanges[unit].indexOf(val);
            pickerRef.current.scrollTo({
                top: index * ITEM_HEIGHT,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
    }, [unit]); // Add unit as dependency since it's used inside

    useEffect(() => {
        if (initialRender.current) {
            if (value) {
                setTimeout(() => {
                    scrollToHeight(value, false);
                    initialRender.current = false;
                }, 100);
            }
        }
    }, [unit, value, scrollToHeight]);

    const toggleUnit = () => {
        const newUnit = unit === 'cm' ? 'ft' : 'cm';
        setUnit(newUnit);
        if (value) {
            const newValue = unit === 'cm' ? 
                Math.round(value / 2.54) : 
                Math.round(value * 2.54);
            setValue(newValue);
            updateData('height', { value: newValue, unit: newUnit });
        }
    };

    const handleContinue = () => {
        // Store the raw value and unit, conversion will happen at form submission
        updateData('height', {
            value: value,
            unit: unit
        });
        onNext();
    };

    return (
        <motion.div className="w-full max-w-md mx-auto px-4">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">What's your height?</h1>
                
                <button onClick={toggleUnit} className="w-full mb-6 px-4 py-2 bg-sky-100 text-sky-600 rounded-lg font-semibold hover:bg-sky-200 transition">
                    {unit.toUpperCase()}
                </button>

                <div className="relative mx-8">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <div className="h-[60px] border-y-2 border-sky-200 bg-sky-50/30" />
                    </div>

                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-sky-500 z-20">
                        <FaChevronUp size={24} />
                    </div>
                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-sky-500 z-20">
                        <FaChevronUp size={24} />
                    </div>

                    <div 
                        ref={pickerRef}
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            WebkitOverflowScrolling: 'touch'
                        }}
                        className="h-[300px] overflow-y-scroll relative scroll-smooth [&::-webkit-scrollbar]:hidden touch-pan-y"
                        onScroll={handleScroll}
                    >
                        <div className="absolute inset-0 w-full">
                            <div className="h-[120px]" />
                            {heightRanges[unit].map(val => (
                                <div
                                    key={val}
                                    className={`h-[60px] w-full flex items-center justify-center transition-all duration-200 cursor-pointer select-none ${
                                        value === val 
                                            ? 'text-6xl font-bold text-sky-500 scale-110' // changed from text-7xl to text-6xl
                                            : value === val + 1 || value === val - 1
                                            ? 'text-3xl text-gray-400'
                                            : 'text-xl text-gray-300'
                                    }`}
                                    onClick={() => {
                                        setValue(val);
                                        updateData('height', { value: val, unit });
                                        scrollToHeight(val);
                                    }}
                                >
                                    {formatHeight(val)}
                                </div>
                            ))}
                            <div className="h-[120px]" />
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button 
                        onClick={onBack} 
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                    >
                        Back
                    </button>
                    <button 
                        onClick={handleContinue} 
                        disabled={!value}
                        className={`flex-1 px-4 py-2 rounded-lg text-white transition ${
                            value ? 'bg-sky-500 hover:bg-sky-600' : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default HeightStep;
