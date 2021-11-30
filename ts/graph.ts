import { AStarFinding, Node } from "./pathFinding";
import { BaseShape, ShapeHandler } from "./shape";

export interface IIsland {
    id: string;
    nodes: BaseShape;
}

export function detectIslands(handler: AStarFinding) {
    const notSeen = new Set(handler.nodes);
    const iterator = notSeen.values();

    while(notSeen.size > 0) {
        const start: Node = iterator.next().value;

        handler.edgeMap[start.id].forEach(edge => {
            
        })
    }
}

