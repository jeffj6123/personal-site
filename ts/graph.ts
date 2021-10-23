import { Circle, IPoint, ISquarePoint, Vertice } from "./shape";


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

const checkOverlap = (shape1: Circle, shape2: Circle) => {
    const midPointDistance = getDistanceBetweenShapes(shape1.position, shape2.position);

    return midPointDistance < (Circle.radius * 2)
}

const getDistanceBetweenShapes = (shape1: IPoint, shape2: IPoint) => {
    return Math.sqrt(Math.pow((shape1.x) - (shape2.x), 2) + Math.pow((shape1.y) - (shape2.y), 2));
}

export class GraphHandler {
    verticies: Record<string, Vertice> = {};
    circles: Record<string, Circle> = {};

    constructor(public nodeCount: number, exclusionAreas: ISquarePoint[]) {

    }

    generateGraph() {
        let shapes: Circle[] = [];
        let verts: Vertice[] = [];

        for (let i = 0; i < this.nodeCount * 2; i++) {
            let y = Math.random();
            let x = Math.random();
            const s = new Circle({ y, x }, i.toString());
            if (shapes.every(shape => !checkOverlap(shape, s)) && !RectCircleColliding({...s.position, radius: Circle.radius * 1.5}, refRect) ) {
                shapes.push(s);
            }
        }

        shapes.forEach(shape => {
            const pairs = shapes.map((s, index) => {
                return {
                    distance: getDistanceBetweenShapes(shape.position, s.position),
                    shape1: shape,
                    shape2: s,
                    id: index
                }
            }).filter((a) => a.shape1 !== a.shape2).sort((a, b) => a.distance - b.distance).slice(0, 3);

            pairs.forEach(indice => {

                let conflictShape = null;
                shapes.forEach(s => {
                    const d = getDistanceBetweenShapes(indice.shape1.position, indice.shape2.position);
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
    }
}