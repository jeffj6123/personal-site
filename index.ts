export interface Node {
    x: number;
    y: number;
    id: string;
}

export interface Edge {
    nodes: Node[];
    id: string;
}


export interface INodePathFindingInfo {
    parent: INodePathFindingInfo;
    node: Node;
    hCost: number;
    gCost: number;
}


export class AStarFinding {

    private edgeMap: Record<string, Edge[]> = {};
    constructor(private nodes: Node[],
        private edges: Edge[]) {
        this.nodes.forEach(node => {
            this.edgeMap[node.id] = [];
        })

        edges.forEach(edge => {
            edge.nodes.forEach(node => {
                this.edgeMap[node.id].push(edge);
            })
        })
    }

    step() {

    }

    generatePath(startNode: Node, endNode: Node): INodePathFindingInfo[] {
        const seen = new Set();

        const available: INodePathFindingInfo[] = [];

        let currentNode: INodePathFindingInfo = {
            parent: null,
            node: startNode,
            hCost: 0,
            gCost: 0
        };

        while (currentNode && currentNode.node !== endNode) {

            this.edgeMap[currentNode.node.id].forEach(edge => {
                const newNode = edge.nodes.filter(n => currentNode.node.id === n.id)[0];

                if (!seen.has(newNode.id)) {
                    const hCost = this.evaluateDistance(newNode, endNode);
                    const gCost = this.evaluateDistance(currentNode.node, newNode);
                    available.push({
                        parent: currentNode,
                        node: newNode,
                        hCost,
                        gCost
                    });

                    seen.add(newNode.id);
                }
            })

            currentNode = this.getLowestCostNode(available, true);
        }

        return [];
    }

    evaluateDistance(node: Node, goalNode: Node): number {
        return Math.sqrt((node.x - goalNode.x) * (node.x - goalNode.x) - (node.y - goalNode.y) * (node.y - goalNode.y));
    }

    getLowestCostNode(nodes: INodePathFindingInfo[], remove = false): INodePathFindingInfo {
        let node = nodes[0];
        let index = 0;

        nodes.forEach((info, i) => {
            if (this.getTotalCost(info) < this.getTotalCost(node)) {
                node = info;
                index = i;
            }
        })

        if (remove) {
            nodes.splice(index, 1);
        }

        return node;
    }

    getTotalCost(node: INodePathFindingInfo): number {
        return node.gCost + node.hCost;
    }
}
