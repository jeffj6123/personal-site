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
    public internal: IHeapItem<T>[] = []

    getNext() {
        const item = this.internal[0];
        const next = this.internal.pop();
        if(this.size() > 0) {
            this.internal[0] = next
        }
        this.heapifyUp(0);
        return item.value
    }

    add(item: T, value: number) {
        this.internal.push({
            item,
            value
        });

        this.heapifyDown(this.size() - 1);
    }

    heapifyDown(index: number) {
        const item = this.internal[index];

        let loopCount = 0;
        while (index > 0) {
            loopCount += 1
            const parent = this.getParent(index);

            if (item.value < this.internal[parent].value) {
                this.swap(parent, index);
            } else {
                break;
            }

            index = parent;
        }
    }

    heapifyUp(index: number) {
        let loopCount = 0;
        while (index < this.size()) {
            loopCount += 1

            const leftChild = this.getLeftChild(index);
            const rightChild = this.getRightChild(index);

            let smallest = index;

            if (leftChild < this.size() &&
                this.internal[leftChild].value < this.internal[smallest].value) {
                smallest = leftChild;
            }
            
            if (rightChild < this.size() &&
                this.internal[rightChild].value < this.internal[smallest].value) {
                smallest = rightChild;
            }

            if(smallest != index) {
                this.swap(index, smallest)
                index = smallest;
            }
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
        return Math.floor((index - 1) / 2);
    }

    private swap(index1: number, index2: number) {
        const temp = this.internal[index1];
        this.internal[index1] = this.internal[index2];
        this.internal[index2] = temp;
    }
}


let f = new Heap();

const items = [];

for (let i = 0; i < 10; i++) {
    const item = Math.random() * 10;
    items.push(item);
    f.add(item, item);
}

console.log(items)
console.log(f.internal)
while (f.size() > 0) {
    console.log("item" + f.getNext())
}