import { shapeCount } from "./ts/constants";
import { AStarFinding, Node } from "./ts/pathFinding";
import { Circle, Crawler, IPoint, ISquarePoint, RectCircleColliding, ShapeHandler, textRenderer, Vertice } from "./ts/shape";
import "./sass/style.scss";
import { debounced } from "./ts/debounce";
import { checkOverlap, detectIslands, generateEdgeIds, generateVertices } from "./ts/graph";

const canvasMultiplier = 1;
export interface IDrawInfo {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
}

export interface IUpdateInfo {
    tickSizeInMilliseconds: number;
}


export function draw() {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas.getContext) {
        let ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight - 50;
        ctx.canvas.width = width;
        ctx.canvas.height = height;

        Circle.radius = width / 60;

        let landingTile = document.getElementById('landing-tile');

        let refRect: ISquarePoint = landingTile.getBoundingClientRect();
        refRect.y + 50;

        console.log(landingTile.getBoundingClientRect())

        let shapes: Circle[] = [];

        for (let i = 0; i < shapeCount; i++) {
            let y = 10 + (Math.random() * height * .95);
            let x = 10 + (Math.random() * width * .95);
            const s = new Circle({y, x}, i.toString());
            if (shapes.every(shape => !checkOverlap(shape, s)) &&
                !RectCircleColliding({ ...s.position, radius: Circle.radius * 1.5 }, refRect)) {
                shapes.push(s);
            }
        }

        let verts: Vertice[] = generateVertices(shapes);

        let handler = new ShapeHandler();
        verts.forEach(vert => handler.verticies[vert.id] = vert);
        shapes.forEach(s => handler.circles[s.id] = s);

        let pathFinding = new AStarFinding(shapes.map(s => { return s.asPathFindingNode() }),
                                           verts.map(v => v.getAspathFinding()))

        //move elsewhere
        const islands = detectIslands(pathFinding);
        const newIds = generateEdgeIds(pathFinding, islands);
        newIds.forEach(ids => {
            const vert = new Vertice(handler.circles[ids[0]], handler.circles[ids[1]]);
            verts.push(vert);
            pathFinding.addEdge(vert.getAspathFinding());
        })

        let crawler = new Crawler(handler, shapes[0]);

        document.addEventListener('click', (event) => {
            crawler.setNewColor();
        })

        document.addEventListener('mousemove', debounced(10, (event: MouseEvent) => {
            const closest = pathFinding.findClosestNodeToAPoint({
                x: event.pageX,
                y: event.pageY
            })

            crawler.setNewpath(pathFinding.generatePath(crawler.nextNode.asPathFindingNode(), closest))
        }))

        const items = [].concat(verts).concat(shapes);

        let previousTime = new Date();
        let interval = setInterval(() => {
            try {
                const currentTime = new Date();
                const tick = currentTime.getTime() - previousTime.getTime();

                let width = window.innerWidth;
                let height = window.innerHeight - 50;
                ctx.canvas.width = width;
                ctx.canvas.height = height;

                ctx.clearRect(0, 0, width, height);
                const state = { ctx, height, width };
                const updateState = { tickSizeInMilliseconds: tick };

                items.forEach(shape => {
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
        "digital experiences",
        "useful tools"
    ]
    setInterval(() => {
        test.innerHTML = makes[currentIndex];
        currentIndex++;
        if (currentIndex === makes.length) {
            currentIndex = 1;
        }
    }, 4000)
}

const callback: IntersectionObserverCallback = entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
        }
    });
};

const setObservers = () => {
    const observer = new IntersectionObserver(callback);

    const targets = document.querySelectorAll(".show-on-scroll");
    targets.forEach(function (target) {
        observer.observe(target);
    });
}

window.onload = () => {
    setObservers();
    draw();
    changeTest();
};