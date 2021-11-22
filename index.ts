import { shapeCount } from "./ts/constants";
import { AStarFinding, Node } from "./ts/pathFinding";
import { Circle, Crawler, IPoint, ISquarePoint, RectCircleColliding, ShapeHandler, textRenderer, Vertice } from "./ts/shape";
import "./sass/style.scss";

const canvasMultiplier = 1;
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
        let width = canvasMultiplier * window.innerWidth;
        let height = canvasMultiplier * window.innerHeight * 4;
        ctx.canvas.width = width;
        ctx.canvas.height = height;

        Circle.radius = width / 60;

        //get location for text
        const largeText = Math.min(width / 8, 200);
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.font = `${largeText}px Ariel`;
        const textInfo = ctx.measureText("Jeffrey Jarry");
        let refRect: ISquarePoint = {
            x: width /2 - textInfo.width/2, 
            y: height * .1 - largeText,
            width: textInfo.width,
            height: largeText
        }
        console.log(refRect)
        
        let shapes: Circle[] = [];
        let verts: Vertice[] = [];

        for (let i = 0; i < shapeCount * 2; i++) {
            let y = 10 + (Math.random() * height * .95);
            let x = 10 + (Math.random() * width * .95 );
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

        let pathFinding = new AStarFinding(shapes.map( s => { return s.asPathFindingNode()}), verts.map(v => {return {nodes: [v.circle1.asPathFindingNode(), v.circle2.asPathFindingNode()], id: v.id}}))
        console.log(pathFinding.generatePath(shapes[0].asPathFindingNode(), shapes[1].asPathFindingNode()))

        const path = pathFinding.generatePath(shapes[0].asPathFindingNode(), shapes[1].asPathFindingNode());

        let handler = new ShapeHandler();
        verts.forEach(vert => handler.verticies[vert.id] = vert);
        shapes.forEach(s => handler.circles[s.id] = s);

        let crawler = new Crawler(handler, path.splice(0,1));
        let name = new textRenderer(crawler);
        document.addEventListener('click', (event) => {
            console.log({
                x: event.offsetX * canvasMultiplier,
                y: event.offsetY * canvasMultiplier
            });
            const closest = pathFinding.findClosestNodeToAPoint({
                x: event.offsetX * canvasMultiplier,
                y: event.offsetY * canvasMultiplier
            })
            crawler.setNewpath(pathFinding.generatePath(crawler.nextNode.asPathFindingNode(), closest))
          })

        let previousTime = new Date();
        let interval = setInterval(() => {
            try {
                const currentTime = new Date();
                const tick = currentTime.getTime() - previousTime.getTime();

                let width = canvasMultiplier * window.innerWidth;
                let height = canvasMultiplier * window.innerHeight * 4;
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

                // ctx.fillRect(refRect.x, refRect.y, refRect.width, refRect.height)

                // name.draw(state);
                previousTime = currentTime;
            } catch (e) {
                console.error(e);
                clearInterval(interval)
            }
        }, 25)
    }
}

const changeTest = () => {
    const test = document.getElementById("test");
    let currentIndex = 1;
    const makes = [
        "Websites",
        "Games",
        "prototypes",
        "digital experiences"
    ]
    setInterval(() => {
        test.innerHTML = makes[currentIndex];
        currentIndex ++;
        if(currentIndex === makes.length) {
            currentIndex = 1;
        }
    }, 4000)
}

draw();
changeTest();