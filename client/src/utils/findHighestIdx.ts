interface MyObject {
    value: any;
    idx: number;
}

function findHighestIdx(arr: MyObject[]): number {
    return arr.reduce((maxIdx, currentObj) => {
        return currentObj.idx > maxIdx ? currentObj.idx : maxIdx;
    }, -Infinity);
}

export default findHighestIdx;