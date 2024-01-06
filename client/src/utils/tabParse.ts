function tabParse(inputString: string): string {
    // Lowercase the string
    let result: string = inputString.toLowerCase();

    // Replace letters with ´ with the corresponding letter without ´
    result = result.replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u');

    // Replace '/' with '_'
    result = result.replace(/\//g, '_').replace(/ /g, '-');

    return result;
}

export default tabParse;