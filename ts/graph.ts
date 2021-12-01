import { AStarFinding, Node } from "./pathFinding";
import { BaseShape, Circle, IPoint, ShapeHandler, Vertice } from "./shape";

export interface IIsland {
    id: string;
    nodes: Node[];
}

export function detectIslands(handler: AStarFinding): IIsland[] {
    const notSeen = new Set(handler.nodes);
    const iterator = notSeen.values();

    const islands = [];

    while(notSeen.size > 0) {
        const start: Node = iterator.next().value;
        notSeen.delete(start);

        let queue = [start];

        let island: IIsland = {
            id: "1",
            nodes: [start]
        }

        while(queue.length > 0) {
            const currentNode = queue.pop();

            handler.getNodeEdges(currentNode.id).forEach(nodeId => {
                const newNode = handler.getNode(nodeId);
    
                if(notSeen.has(newNode)) {
                    queue.push(newNode);
                    notSeen.delete(newNode);
                    island.nodes.push(newNode);
                }
            })
        }

        islands.push(island);
    }

    console.log(islands);
    return islands;
}

export function generateEdge(island1: IIsland, island2: IIsland) {

    island1.nodes.forEach(node1 => {
        island2.nodes.forEach(node2 => {

        })
    })

}


interface IVertGenerationInfo {
    distance: number,
    shape1: Node,
    shape2: Node,
    id: string;
}

export function generateVertices(shapes: Circle[]): Vertice[] {
    let verts = [];

    shapes.forEach(shape => {

        const pairs = shapes.map((s, index) => {
            return {
                distance: getDistanceBetweenPoints(shape.position, s.position),
                shape1: shape,
                shape2: s,
                id: index
            }
        }).filter((a) => a.shape1 !== a.shape2).sort((a, b) => a.distance - b.distance).slice(0, 3);


        pairs.forEach(indice => {

            let conflictShape = null;
            shapes.forEach(s => {

                const d = getDistanceBetweenPoints(indice.shape1.position, indice.shape2.position);
                if (!(indice.shape1 === s || indice.shape2 === s) &&
                    d < Circle.radius
                    && boundCheck(indice.shape1.position, indice.shape2.position, s.position, Circle.radius)
                ) {
                    conflictShape = s;
                }
            })

            if (!conflictShape) {
                verts.push(new Vertice(indice.shape2, indice.shape1));
            }
        })

    })

    return verts;
}


export const checkForValidVertice = () => {

}






export const getDistanceBetweenPoints = (node: IPoint, goalNode: IPoint) => {
    const x = (node.x - goalNode.x) * (node.x - goalNode.x);
    const y = (node.y - goalNode.y) * (node.y - goalNode.y);
    return Math.sqrt(x + y );
}



export const checkOverlap = (shape1: Circle, shape2: Circle) => {
    //check if circles are
    const midPointDistance = getDistanceBetweenPoints(shape1.position, shape2.position);

    return midPointDistance < (Circle.radius * 2)
}

const boundCheck = (shape1: IPoint, shape2: IPoint, conflict: IPoint, radius) => {

    let copy1 = { ...shape1 };
    let copy2 = { ...shape2 };

    if (copy1.x > copy2.x) {
        copy1.x -= radius;
        copy2.x += radius;
    } else {
        copy2.x -= radius;
        copy1.x += radius;
    }

    if (copy1.y > copy2.y) {
        copy1.y -= radius;
        copy2.y += radius;
    } else {
        copy2.y -= radius;
        copy1.y += radius;
    }

    const arr = [copy1, copy2, conflict];

    arr.sort((a, b) => a.x - b.x);
    const xCheck = arr[1] === conflict;

    arr.sort((a, b) => a.y - b.y)
    const yCheck = arr[1] === conflict;


    return xCheck && yCheck;
}