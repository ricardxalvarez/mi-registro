function isNumeric(value: string): boolean {
    return /^[0-9]+$/.test(value);
}

export default isNumeric