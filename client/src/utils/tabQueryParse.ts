function tabQueryParse(inputString: string): string {
    // Replace '_' with '/'
    let result: string = inputString.replace(/_/g, ' / ').replace(/-/g, ' ');

    result = result.toUpperCase()

    return result;
}

export default tabQueryParse