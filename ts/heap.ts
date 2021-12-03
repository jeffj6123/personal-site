/*
   0
 1   2
3 4 5 6
*/

interface IHeapItem<T> {
    item: T;
    value: number;
}

export class Heap<T> {
    private internal: IHeapItem<T>[] = []

    getNext<T>() {
        const item = this.internal[0];
        this.internal[0] = this.internal.splice(this.size(), 1)[0];

    }

    add(item: T, value: number) {
        this.internal.push({
            item,
            value
        });

        this.heapifyDown(this.size() - 1);
    }

    heapifyDown(index:  number) {
        const item = this.internal[index];

        while(index > 0) {
            const parent = this.getParent(index);

            if(item.value < this.internal[parent].value) {
                this.swap(parent, index);
            }else{
                break;
            }

            index = parent;
        }
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

    private swap(index1: number, index2: number) {
        const temp = this.internal[index1];
        this.internal[index1] = this.internal[index2];
        this.internal[index2] = temp;
    }
}


let f = new Heap();

const items = [];

for(let i = 0; i < 10; i++) {
    const item = Math.random() * 10;
    items.push(item);
    f.add(item, item);
}

while(f.size() > 0) {
    console.log(f.getNext());
}
console.log(items)