// lib/constants.ts

export const EQUIPMENT_OPTIONS = [
    'Microphone System',
    'Projector',
    'Sound System',
    'Stage Lighting',
    'Podium',
    'Chairs (Additional)',
    'Tables',
    'Air Conditioning',
    'Recording Equipment',
    'Photography Equipment',
];

export const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

/**
 * Generates an array of date strings (YYYY-MM-DD) for the next 30 days, starting from tomorrow.
 */
export const generateDateOptions = (): string[] => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
};

export const DEPARTMENTS = [
    'Computer Science & Engineering',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Information Technology',
    'Electrical Engineering',
    'Electronics & Instrumentation Engineering',
    'Chemical Engineering',
    'Management',
    'Administration',
];