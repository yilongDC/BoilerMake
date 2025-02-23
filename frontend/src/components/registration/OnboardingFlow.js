import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { convertHeight, convertWeight, mapActivityLevel } from '../../utils/conversions';
import './styles/onboarding.css';  // Updated import path
import EmailStep from './steps/EmailStep';
import PasswordStep from './steps/PasswordStep';
import NameStep from './steps/NameStep';
import SexStep from './steps/SexStep';
import AgeStep from './steps/AgeStep';
import HeightStep from './steps/HeightStep';
import WeightStep from './steps/WeightStep';
import ActivityStep from './steps/ActivityStep';
import WeatherStep from './steps/WeatherStep';

const OnboardingFlow = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        sex: '',
        age: null,
        height: { value: null, unit: 'cm' },
        weight: { value: null, unit: 'kg' },
        activityLevel: '',
        weatherPreference: 'moderate'
    });
    const navigate = useNavigate();

    const updateFormData = (key, value) => {
        setFormData(prev => {
            const newData = { ...prev, [key]: value };
            
            // Update height/weight defaults when sex is selected
            if (key === 'sex') {
                if (!newData.height.value) {
                    newData.height = {
                        unit: 'cm',
                        value: value === 'male' ? 170 : 160
                    };
                }
                if (!newData.weight.value) {
                    newData.weight = {
                        unit: 'kg',
                        value: value === 'male' ? 70 : 60
                    };
                }
            }
            
            return newData;
        });
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const renderStep = () => {
        switch(step) {
            case 1:
                return <EmailStep 
                    email={formData.email}
                    updateData={updateFormData}
                    onNext={nextStep}
                />;
            case 2:
                return <PasswordStep 
                    password={formData.password}
                    updateData={updateFormData}
                    onNext={nextStep}
                    onBack={prevStep}
                />;
            case 3:
                return <NameStep 
                    name={formData.name}
                    updateData={updateFormData}
                    onNext={nextStep}
                    onBack={prevStep}
                />;
            case 4:
                return <SexStep 
                    sex={formData.sex}
                    updateData={updateFormData}
                    onNext={nextStep}
                    onBack={prevStep}
                />;
            case 5:
                return <AgeStep 
                    age={formData.age}
                    updateData={updateFormData}
                    onNext={nextStep}
                    onBack={prevStep}
                />;
            case 6:
                return <HeightStep 
                    height={formData.height}
                    sex={formData.sex}
                    updateData={updateFormData}
                    onNext={nextStep}
                    onBack={prevStep}
                />;
            case 7:
                return <WeightStep 
                    weight={formData.weight}
                    sex={formData.sex}
                    updateData={updateFormData}
                    onNext={nextStep}
                    onBack={prevStep}
                />;
            case 8:
                return <ActivityStep 
                    activity={formData.activityLevel}
                    updateData={updateFormData}
                    onNext={nextStep}
                    onBack={prevStep}
                />;
            case 9:
                return <WeatherStep 
                    weather={formData.weatherPreference}
                    updateData={updateFormData}
                    onComplete={handleComplete}
                    onBack={prevStep}
                />;
            default:
                return null;
        }
    };

    const handleComplete = async () => {
        try {
            // Prepare data with proper type conversions
            const convertedData = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                sex: formData.sex,
                age: parseInt(formData.age, 10), // Ensure age is a number
                height: convertHeight(formData.height.value, formData.height.unit),
                weight: convertWeight(formData.weight.value, formData.weight.unit),
                activityLevel: mapActivityLevel(formData.activityLevel),
                weatherPreference: formData.weatherPreference
            };

            // Validate data before sending
            if (!convertedData.email || !convertedData.password) {
                throw new Error('Missing required fields');
            }

            const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(convertedData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }
            
            const data = await response.json();
            console.log('Registration successful:', data);
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            // Add error handling UI feedback here
        }
    };

    return (
        <div className="onboarding-container">
            {renderStep()}
            {step > 1 && ( 
                <div className="progress-indicator">
                    {Array(8).fill(0).map((_, i) => (
                        <div 
                            key={i+2} 
                            className={`progress-dot ${i+2 <= step ? 'active' : ''}`}
                            aria-label={`Step ${i+2} of 8`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default OnboardingFlow;
