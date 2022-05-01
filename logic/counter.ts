export interface ICounterMostCommonEntry {
    key: string | number;
    value: number;
}

export class Counter {
    private counts: Record<string | number, number> = {};

    public add(key: string | number, incrementalValue: number = 1): void {
        if (this.counts[key] === undefined) {
            this.counts[key]  = 0;
        }
        this.counts[key] += incrementalValue;
    }

    public getAsMap() {
        return this.counts;
    }

    public clearAll(): void {
        this.counts = {};
    }

    public mostCommon(): ICounterMostCommonEntry[] {
        const l = Object.keys(this.counts).map(key => {
            return {
                key,
                value: this.counts[key]
            };
        });
        return l.sort(this.sortFunction);
    }

    private sortFunction(a: ICounterMostCommonEntry, b: ICounterMostCommonEntry): -1 | 0 | 1 {
        return a.value > b.value ? -1 : 1;
    }

    public entries(): ICounterMostCommonEntry[] {
      return Object.keys(this.counts).map(key => {
          return {
              key,
              value: this.counts[key]
          };
      });
    }
}