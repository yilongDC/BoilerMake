import { convertHeight, convertWeight, mapActivityLevel } from '../../utils/conversions';

// ...existing imports...

const RegistrationForm = () => {
    // ...existing code...

    const handleSubmit = async (formData) => {
        try {
            // Convert measurements to standard units (cm and kg)
            const convertedData = {
                ...formData,
                height: convertHeight(formData.height.value, formData.height.unit),
                weight: convertWeight(formData.weight.value, formData.weight.unit),
                activityLevel: mapActivityLevel(formData.activityLevel)
            };

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(convertedData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            // Handle successful registration
            const data = await response.json();
            // ...rest of success handling code...

        } catch (error) {
            console.error('Registration error:', error);
            // ...error handling code...
        }
    };

    // ...existing code...
};
