import { getDistanceBetweenPoints } from "./graph";
import { BaseShape, IPoint } from "./shape";

export class GraphHandler {
    private edgeMap: Record<string, BaseShape> = {};

    constructor() {

    }
}

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
    private edgeMap2: Record<string, string[]> = {};
    private nodeMap: Record<string, Node> = {};

    // public edgeMap: Record<string, Edge[]> = {};

    constructor(public nodes: Node[],
        private edges: Edge[]) {

        this.nodes.forEach(node => {
            this.edgeMap2[node.id] = [];
            this.nodeMap[node.id] = node;
        })

        edges.forEach(edge => {
            const id1 = edge.nodes[0].id;
            const id2 = edge.nodes[1].id;
            this.edgeMap2[id1].push(id2)
            this.edgeMap2[id2].push(id1)
        })
    }

    step() {

    }

    getNode(id: string): Node {
        return this.nodeMap[id];
    }

    getNodeEdges(id: string): string[] {
        return this.edgeMap2[id];
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

            this.edgeMap2[currentNode.node.id].forEach(edge => {
                const newNode = this.nodeMap[edge];

                if (!seen.has(newNode.id)) {
                    const hCost = getDistanceBetweenPoints(newNode, endNode);
                    const gCost = getDistanceBetweenPoints(currentNode.node, newNode)
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
        let distance = getDistanceBetweenPoints(point, node);
        this.nodes.forEach(n => {
            const d = getDistanceBetweenPoints(point, n);
            if(d < distance) {
                node = n;
                distance = d;
            }
            // console.log(n, d)
        })

        return node;
    }
}
