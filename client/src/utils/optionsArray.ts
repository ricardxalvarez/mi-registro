interface optionItem {
    name: string;
    value: number;
  }
  
export default function createOptionsArray(start: number, end: number, label: string): optionItem[] {
    const optionArray: optionItem[] = [];
  
    for (let i = start; i <= end; i++) {
      optionArray.push({ name: `${i.toString()} ${label}`, value: i });
    }
  
    return optionArray;
  }