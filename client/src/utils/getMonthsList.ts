import { format } from 'date-fns';

export default function getMonthsList(): string[] {
    const dummyDate = new Date();
    
    const months: string[] = [];
    
    for (let i = 0; i < 12; i++) {
        // Set the month for the dummy date object
        dummyDate.setMonth(i);
    
        // Format the month name using date-fns
        const monthName = format(dummyDate, 'MMM');
    
        // Push the formatted month name into the array
        months.push(monthName);
    }

    return months
}