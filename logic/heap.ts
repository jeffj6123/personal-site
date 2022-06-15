interface IHeapItem<T> {
    item: T;
    value: number;
}

export class Heap<T> {
    public internal: IHeapItem<T>[] = []

    getNext() {
        const item = this.internal[0];
        const next = this.internal.pop();
        if (this.size() > 0) {
            this.internal[0] = next
            this.heapifyUp(0);
        }
        return item.item;
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
        while (index > 0) {
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
        while (index < this.size()) {
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

            if (smallest !== index) {
                this.swap(index, smallest)
                index = smallest;
            } else {
                break;
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