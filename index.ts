import { shapeCount } from "./constants";
import { AStarFinding, Node } from "./pathFinding";
import { Circle, Crawler, IPoint, ShapeHandler, Vertice } from "./shape";


export interface IDrawInfo {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
}

export interface IUpdateInfo {
    tickSizeInMilliseconds: number;
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

const checkOverlap = (shape1: Circle, shape2: Circle) => {
    const midPointDistance = getDistanceBetweenShapes(shape1.position, shape2.position);

    return midPointDistance < (Circle.radius * 2)
}

const getDistanceBetweenShapes = (shape1: IPoint, shape2: IPoint) => {
    return Math.sqrt(Math.pow((shape1.x) - (shape2.x), 2) + Math.pow((shape1.y) - (shape2.y), 2));
}



export function draw() {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas.getContext) {
        let ctx = canvas.getContext('2d');
        let width = 2 * window.innerWidth;
        let height = 2 * window.innerHeight;
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        Circle.radius = width / 60;
        console.log(window)
        let shapes: Circle[] = [];
        let verts: Vertice[] = [];

        // let i = 0;
        // while(i < height) {
        //         const s = new Circle({ y: 200, x: i }, i.toString());
        //         shapes.push(s);
        //     i += Circle.radius * 3
        // }
        // for(let i = 0; i < 40; i++) {
        //     for(let j = 0; j < 30 ; j++) {
        //         const s = new Circle({ y: ( i / 20) * width, x: (j / 20) * height }, j.toString() + i.toString());
        //         shapes.push(s);
        //     }
        // }

        for (let i = 0; i < shapeCount * 2; i++) {
            let y = (Math.random() * height);
            let x = (Math.random() * width );

            // let y = (Math.random() * height * 2) - height / 2;
            // let x = (Math.random() * width * 2) - width / 2;

            const s = new Circle({ y, x }, i.toString());
            if (shapes.every(shape => !checkOverlap(shape, s))) {
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

        let pathFinding = new AStarFinding(shapes.map( s => { return s.asPathFindingNode()}), verts.map(v => {return {nodes: [v.circle1.asPathFindingNode(), v.circle2.asPathFindingNode()], id: v.id}}))
        console.log(pathFinding.generatePath(shapes[0].asPathFindingNode(), shapes[1].asPathFindingNode()))

        const path = pathFinding.generatePath(shapes[0].asPathFindingNode(), shapes[1].asPathFindingNode());

        let handler = new ShapeHandler();
        verts.forEach(vert => handler.verticies[vert.id] = vert);
        shapes.forEach(s => handler.circles[s.id] = s);

        let crawler = new Crawler(handler, path.splice(0,1));

        document.addEventListener('click', (event) => {
            console.log({
                x: event.offsetX * 2,
                y: event.offsetY * 2
            });
            const closest = pathFinding.findClosestNodeToAPoint({
                x: event.offsetX * 2,
                y: event.offsetY * 2
            })
            // console.table(pathFinding.nodes)
            console.log(closest)
            crawler.setNewpath(pathFinding.generatePath(crawler.nextNode.asPathFindingNode(), closest))
          })


        let previousTime = new Date();
        let interval = setInterval(() => {
            try {
                const currentTime = new Date();
                const tick = currentTime.getTime() - previousTime.getTime();

                let width = 2 * window.innerWidth;
                let height = 2 * window.innerHeight;
                ctx.canvas.width = width;
                ctx.canvas.height = height;
                ctx.clearRect(0, 0, width, height);
                const state = { ctx, height, width };
                const updateState = {tickSizeInMilliseconds: tick};

                [].concat(verts).concat(shapes).forEach(shape => {
                    shape.update(updateState)
                    shape.draw(state)
                })
                
                crawler.draw(state)
                crawler.update(updateState);

                previousTime = currentTime;
            } catch (e) {
                console.error(e);
                clearInterval(interval)
            }
        }, 50)
    }
}

draw();
