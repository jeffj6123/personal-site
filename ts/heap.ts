/*
   0
 1   2
3 4 5 6
*/
export class Heap<T> {
    private internal: T[] = []

    getNext<T>() {
        const item = this.internal[0];
        this.internal[0] = this.internal.splice(this.size(), 1)[0];

    }

    add(item: T, value: number) {
        this.internal.push(item);

    }

    size(): number {
        return this.internal.length
    }

    private getLeftChild(index: number) {
        return index * 2 + 1;
    }

    
    private getRightChild(index: number) {
        return index * 2 + 2;
    }

    private getParent(index: number) {
        return Math.floor( (index -1 ) / 2);
    }
}