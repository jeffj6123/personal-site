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
    return islands;
}

export function generateEdgeIds(handler: AStarFinding, islands: IIsland[]) {
    let newVerts: string[][] = [];

    //take one island and find closest matching island - combine them
    //take next island and repeat until 1 island is left
    while(islands.length > 1) {
        const currentIsland = islands.pop();
        let verts: string[] = [];
        let closest = 100000;
        let closestIsland = islands[0];

        //for all other islands check for closest node
        islands.forEach(island => {
            currentIsland.nodes.forEach(node1 => {
                island.nodes.forEach(node2 => {
                    if(checkForValidVertice(handler.getNode(node1.id), handler.getNode(node2.id), handler.nodes)) {
                        const distance = getDistanceBetweenPoints(node1, node2);
                        if(closest > distance) {
                            verts = [node1.id, node2.id];
                            closest = distance;
                            closestIsland = island;
                        }
                    }
                })
            })
        })

        currentIsland.nodes.concat(closestIsland.nodes);
        newVerts.push(verts);
    }

    return newVerts;
}

export function generateVertices(shapes: Circle[]): Vertice[] {
    const shapePoints = shapes.map(shapes => shapes.position);
    let verts = [];

    shapes.forEach(shape => {
        const pairs = shapes.map(s => {
            return {
                distance: getDistanceBetweenPoints(shape.position, s.position),
                shape1: shape,
                shape2: s
            }
        }).filter((a) => a.shape1 !== a.shape2).sort((a, b) => a.distance - b.distance).slice(0, 3);

        pairs.forEach(indice => {
            if (checkForValidVertice(indice.shape1.position, indice.shape2.position, shapePoints)) {
                verts.push(new Vertice(indice.shape2, indice.shape1));
            }
        })

    })

    return verts;
}


export const checkForValidVertice = (point1: IPoint, point2: IPoint, points: IPoint[]): boolean => {
    let valid = true;;
    points.forEach(s => {
        const distance = getDistanceBetweenPoints(point1, point2);
        if (!(point1 === s || point2 === s) &&
            distance < Circle.radius
            && boundCheck(point1, point2, s, Circle.radius)
        ) {
            valid = false;
        }
    })
    return valid;
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