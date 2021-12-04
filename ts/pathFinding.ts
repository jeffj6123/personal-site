import { getDistanceBetweenPoints } from "./graph";
import { Heap } from "./heap";
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
    private edgeMap: Record<string, string[]> = {};
    private nodeMap: Record<string, Node> = {};

    constructor(public nodes: Node[], edges: Edge[]) {

        this.nodes.forEach(node => {
            this.edgeMap[node.id] = [];
            this.nodeMap[node.id] = node;
        })

        edges.forEach(edge => {
            const id1 = edge.nodes[0].id;
            const id2 = edge.nodes[1].id;
            this.edgeMap[id1].push(id2)
            this.edgeMap[id2].push(id1)
        })
    }

    getNode(id: string): Node {
        return this.nodeMap[id];
    }

    getNodeEdges(id: string): string[] {
        return this.edgeMap[id];
    }

    generatePath(startNode: Node, endNode: Node): INodePathFindingInfo[] {
        const seen = new Set();
        const heap = new Heap<INodePathFindingInfo>();

        let currentNode: INodePathFindingInfo = {
            parent: null,
            node: startNode,
            hCost: 0,
            gCost: 0
        };

        while (currentNode && currentNode.node.id !== endNode.id) {
            this.edgeMap[currentNode.node.id].forEach(edge => {
                const nextNode = this.nodeMap[edge];

                if (!seen.has(nextNode.id)) {
                    const hCost = getDistanceBetweenPoints(nextNode, endNode);
                    const gCost = getDistanceBetweenPoints(currentNode.node, nextNode) + currentNode.gCost;

                    const newNode = {
                        parent: currentNode,
                        node: nextNode,
                        hCost,
                        gCost
                    };
                    heap.add(newNode, this.getTotalCost(newNode))

                    seen.add(nextNode.id);
                }
            })
            currentNode = heap.getNext();
        }
        return this.getPathAsList(currentNode);
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
        })

        return node;
    }
}
