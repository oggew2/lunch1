// Date utility functions

export function getCurrentWeek() {
    const date = new Date();
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

export function getCurrentDay() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    return today === 0 || today === 6 ? 'monday' : days[today];
}

export function getWeekDays() {
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
}
