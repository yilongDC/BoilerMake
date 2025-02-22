import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const AgeStep = ({ age, updateData, onNext, onBack }) => {
    const DEFAULT_AGE = 23;
    const ITEM_HEIGHT = 60;
    // Initialize with age from props if it exists, otherwise use default
    const [selectedAge, setSelectedAge] = useState(age || DEFAULT_AGE);
    const pickerRef = useRef(null);
    const initialRender = useRef(true);

    const ages = Array.from({ length: 101 }, (_, i) => i);

    const handleScroll = (e) => {
        const scrollPos = e.target.scrollTop;
        const newAge = Math.floor(scrollPos / ITEM_HEIGHT);
        if (newAge >= 0 && newAge <= 100) {
            setSelectedAge(newAge);
            updateData('age', newAge);
        }
    };

    const scrollToAge = (age, smooth = true) => {
        if (pickerRef.current) {
            pickerRef.current.scrollTo({
                top: age * ITEM_HEIGHT,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
    };

    useEffect(() => {
        if (initialRender.current) {
            // Only set default age if no age was previously selected
            if (age === null) {
                updateData('age', DEFAULT_AGE);
            }
            
            // Scroll to either the saved age or default
            setTimeout(() => {
                scrollToAge(selectedAge, false);
                initialRender.current = false;
            }, 100);
        }
    }, []); // Run only on mount

    return (
        <motion.div className="w-full max-w-md mx-auto px-4">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">How old are you?</h1>
                
                <div className="relative mx-8">
                    {/* Selection frame */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <div className="h-[60px] border-y-2 border-sky-200 bg-sky-50/30" />
                    </div>

                    {/* Chevrons */}
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-sky-500 z-20">
                        <FaChevronUp size={24} />
                    </div>
                    <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-sky-500 z-20">
                        <FaChevronUp size={24} />
                    </div>
                    
                    {/* Age picker */}
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
                            {ages.map(age => (
                                <div
                                    key={age}
                                    className={`h-[60px] w-full flex items-center justify-center transition-all duration-200 cursor-pointer select-none ${
                                        selectedAge === age 
                                            ? 'text-7xl font-bold text-sky-500 scale-110' 
                                            : selectedAge === age + 1 || selectedAge === age - 1
                                            ? 'text-3xl text-gray-400'
                                            : 'text-xl text-gray-300'
                                    }`}
                                    onClick={() => {
                                        setSelectedAge(age);
                                        updateData('age', age);
                                        scrollToAge(age);
                                    }}
                                >
                                    {age}
                                </div>
                            ))}
                            <div className="h-[120px]" />
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4 mt-6">
                    <button 
                        onClick={onBack}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                    >
                        Back
                    </button>
                    <button 
                        onClick={onNext}
                        className="flex-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition"
                    >
                        Next
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default AgeStep;
