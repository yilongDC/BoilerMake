export const convertHeight = (value, unit) => {
    if (unit === 'ft') {
        // Convert inches to cm
        return Math.round(value * 2.54);
    }
    return value; // Already in cm
};

export const convertWeight = (value, unit) => {
    if (unit === 'lb') {
        // Convert pounds to kg
        return Math.round(value * 0.45359237 * 10) / 10;
    }
    return value; // Already in kg
};

export const mapActivityLevel = (level) => {
    const activityMap = {
        'sedentary': 'not_active',
        'moderate': 'moderately_active',
        'active': 'very_active'
    };
    return activityMap[level] || level;
};
