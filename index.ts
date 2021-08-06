export interface Node {
    x: number;
    y: number;
    id: string;
}

export interface Edge {
    node1: Node;
    node2: Node;
    id: string;
}


export interface INodePathFindingInfo extends Node{
    parent: INodePathFindingInfo;
    hCost: number;
    gCost: number;
}

export class AStarFinding {

    constructor(private nodes: Node,
                private edges: Edge,
                private startNode: Node,
                private endNode: Node) {
    }

    step() {

    }
}