import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaChevronUp } from 'react-icons/fa';

const WeightStep = ({ weight, sex, updateData, onNext, onBack }) => {
    const DEFAULT_WEIGHTS = {
        male: {
            kg: 70,
            lb: 154
        },
        female: {
            kg: 60,
            lb: 132
        }
    };

    const ITEM_HEIGHT = 60;
    const [unit, setUnit] = useState(weight.unit || 'kg');
    const [value, setValue] = useState(weight.value || (sex ? DEFAULT_WEIGHTS[sex][unit] : null));
    const pickerRef = useRef(null);
    const initialRender = useRef(true);

    const weightRanges = {
        kg: Array.from({ length: 181 }, (_, i) => i + 40),  // 40-220 kg
        lb: Array.from({ length: 401 }, (_, i) => i + 88)   // 88-488 lb
    };

    const handleScroll = (e) => {
        const scrollPos = e.target.scrollTop;
        const index = Math.floor(scrollPos / ITEM_HEIGHT);
        const newValue = weightRanges[unit][index];
        if (newValue) {
            setValue(newValue);
            updateData('weight', { value: newValue, unit });
        }
    };

    const scrollToWeight = useCallback((val, smooth = true) => {
        if (pickerRef.current) {
            const index = weightRanges[unit].indexOf(val);
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
                    scrollToWeight(value, false);
                    initialRender.current = false;
                }, 100);
            }
        }
    }, [unit, value, scrollToWeight]);

    const toggleUnit = () => {
        const newUnit = unit === 'kg' ? 'lb' : 'kg';
        setUnit(newUnit);
        if (value) {
            setValue(unit === 'kg' ? Math.round(value * 2.20462) : Math.round(value / 2.20462));
        }
    };

    const handleContinue = () => {
        // Store the raw value and unit, conversion will happen at form submission
        updateData('weight', {
            value: value,
            unit: unit
        });
        onNext();
    };

    return (
        <motion.div 
            className="w-full max-w-md mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">What's your weight?</h1>
                
                <button 
                    onClick={toggleUnit} 
                    className="w-full mb-6 px-4 py-2 bg-sky-100 text-sky-600 rounded-lg font-semibold hover:bg-sky-200 transition"
                >
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
                            {weightRanges[unit].map(val => (
                                <div
                                    key={val}
                                    className={`h-[60px] w-full flex items-center justify-center transition-all duration-200 cursor-pointer select-none ${
                                        value === val 
                                            ? 'text-7xl font-bold text-sky-500 scale-110' 
                                            : value === val + 1 || value === val - 1
                                            ? 'text-3xl text-gray-400'
                                            : 'text-xl text-gray-300'
                                    }`}
                                    onClick={() => {
                                        setValue(val);
                                        updateData('weight', { value: val, unit });
                                        scrollToWeight(val);
                                    }}
                                >
                                    {`${val} ${unit}`}
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

export default WeightStep;
