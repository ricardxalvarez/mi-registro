export default function removeDuplicates<T>(arr: T[], prop: keyof T): T[] {
    const uniqueArray: T[] = [];
    const set = new Set();
    for (const item of arr) {
        const value = item[prop];
        if (!set.has(value)) {
            set.add(value);
            uniqueArray.push(item);
        }
    }
    return uniqueArray;
}
