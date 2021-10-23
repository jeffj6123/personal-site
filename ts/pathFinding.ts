import { IPoint } from "./shape";

export interface Node extends IPoint {
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

    public edgeMap: Record<string, Edge[]> = {};
    constructor(public nodes: Node[],
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

        while (currentNode && currentNode.node.id !== endNode.id) {

            this.edgeMap[currentNode.node.id].forEach(edge => {
                const newNode = edge.nodes.filter(n => currentNode.node.id !== n.id)[0];

                if (!seen.has(newNode.id)) {
                    const hCost = this.evaluateDistance(newNode, endNode);
                    const gCost = this.evaluateDistance(currentNode.node, newNode) //+ currentNode.gCost;
                    available.push({
                        parent: currentNode,
                        node: newNode,
                        hCost,
                        gCost
                    });

                    seen.add(newNode.id);
                }
            })
            const nextNode = this.getLowestCostNode(available, true);
            if(nextNode) {
                currentNode = nextNode;
            }else{
                break;
            }
            
        }

        //TODO CHECK THAT ITS END NODE
        return this.getPathAsList(currentNode);
    }

    evaluateDistance(node: IPoint, goalNode: IPoint): number {
        const x = (node.x - goalNode.x) * (node.x - goalNode.x);
        const y = (node.y - goalNode.y) * (node.y - goalNode.y);
        return Math.sqrt(x + y );
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

    getPathAsList(node: INodePathFindingInfo): INodePathFindingInfo[] {
        
        let nodes = [];
        
        while(node) {
            nodes.push(node);
            node = node.parent;
        } 

        return nodes.reverse();
    }

    getTotalCost(node: INodePathFindingInfo): number {
        return node.gCost + node.hCost;
    }

    findClosestNodeToAPoint(point: IPoint): Node {
        let node = this.nodes[0];
        let distance = this.evaluateDistance(point, node);
        this.nodes.forEach(n => {
            const d = this.evaluateDistance(point, n);
            if(d < distance) {
                node = n;
                distance = d;
            }
            // console.log(n, d)
        })

        return node;
    }
}
