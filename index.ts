const size = 500;
const shapeCount = 10;

let radius = 20;
const FULL_RADIUS = Math.PI * 2;

export interface IDrawInfo {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
}

function distance(circle1Ref: IPoint, circle2Ref: IPoint, point: IPoint) {
    let circle2 = circle2Ref;
    let circle1 = circle1Ref;

    if (circle2.x < circle1.x) {
        circle2 = circle1Ref;
        circle1 = circle2Ref;
    }

    const x2minsx1 = (circle2.x - circle1.x);
    const y2minusy1 = (circle2.y - circle1.y);

    const numerator = Math.abs(x2minsx1 * (circle1.y - point.y) -
        (circle1.x - point.x) * y2minusy1)
    const denominator = Math.sqrt((x2minsx1 * x2minsx1) + (y2minusy1 * y2minusy1));

    return numerator / denominator;
}

const boundCheck = (shape1: IPoint, shape2: IPoint, conflict: IPoint) => {

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

    return midPointDistance < (radius * 2)
}

const getDistanceBetweenShapes = (shape1: IPoint, shape2: IPoint) => {
    return Math.sqrt(Math.pow((shape1.x) - (shape2.x), 2) + Math.pow((shape1.y) - (shape2.y), 2));
}

export interface IPoint {
    x: number;
    y: number;
}


export class BaseShape {

    constructor(public id: string) {

    }

    draw(state: IDrawInfo) { }

    update() { }
}

export class Background extends BaseShape {
    constructor() {
        super('background')
    }

    draw(state: IDrawInfo) {

        var grd = state.ctx.createLinearGradient(0, 0, state.width, 0);
        grd.addColorStop(0, '#00ffff');
        grd.addColorStop(1, "#703fff");

        // Fill with gradient
        state.ctx.fillStyle = grd;
        state.ctx.fillRect(0, 0, state.width, state.height);

    }
}

class Circle extends BaseShape {
    constructor(public position: IPoint,
        public id: string) {
        super(id);
    }

    draw(state: IDrawInfo) {
        // ctx.fillStyle = 'rgb(200, 0, 0)';
        state.ctx.strokeStyle = 'rgb(0, ' + Math.floor(255 / size * this.position.x) + ', ' +
            Math.floor(255 / size * this.position.y) + ')';
        state.ctx.lineWidth = 3;
        state.ctx.beginPath();

        state.ctx.arc(this.position.x, this.position.y, radius, 0, FULL_RADIUS, true); // Outer circle

        state.ctx.closePath();
        state.ctx.stroke();


        state.ctx.fillStyle = 'rgb(249, 172, 83)'
        // 'rgb(0, ' + Math.floor(255 / size * this.position.x) + ', ' +
        //     Math.floor(255 / size * this.position.y) + ')';
        state.ctx.beginPath();
        state.ctx.arc(this.position.x, this.position.y, radius / 2, 0, FULL_RADIUS, true);
        state.ctx.fill();

        state.ctx.fillText(this.id, this.position.x + radius, this.position.y);
    }

    update() {
        // this.x = (this.x + this.xOffset) % size;
        // this.y = (this.y + this.yoffSet ) % size;
    }
}

class Vertice extends BaseShape {
    constructor(public circle1: Circle,
        public circle2: Circle,
        public green = true) {
        super(Vertice.getVerticeId(circle1, circle2));
    }

    update() {

    }

    draw(state: IDrawInfo) {
        state.ctx.strokeStyle = this.green ? 'green' : "red";
        state.ctx.lineWidth = 5;
        state.ctx.beginPath();
        state.ctx.moveTo(this.circle1.position.x, this.circle1.position.y);
        state.ctx.lineTo(this.circle2.position.x, this.circle2.position.y);
        state.ctx.closePath();
        state.ctx.stroke();
    }

    public static getVerticeId(circle1: Circle, circle2: Circle): string {
        return [circle1, circle2].map(c => c.id).sort().join("-");
    }
}



export function draw() {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas.getContext) {
        let ctx = canvas.getContext('2d');
        let width = 2 * window.innerWidth;
        let height = 2 * window.innerHeight;
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        radius = width / 60;
        console.log(window)
        let shapes: Circle[] = [];
        let verts = [];
        for (let i = 0; i < 80; i++) {
            // let x = Math.random() * size;
            let y = (Math.random() * height * 2) - height / 2;
            let x = (Math.random() * width * 2) - width / 2;
            // let y = x;

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

                    const d = distance(indice.shape1.position, indice.shape2.position, s.position);
                    if (!(indice.shape1 === s || indice.shape2 === s) &&
                        d < radius
                        && boundCheck(indice.shape1.position, indice.shape2.position, s.position)
                    ) {
                        conflictShape = s;
                    }
                })

                if (!conflictShape) {
                    verts.push(new Vertice(indice.shape2, indice.shape1));
                } else {
                    if (boundCheck(indice.shape1.position, indice.shape2.position, conflictShape.position)) {
                        console.log(indice.shape1, indice.shape2, conflictShape)
                    }

                    verts.push(new Vertice(indice.shape2, indice.shape1, false));
                }
            })

        })

        let interval = setInterval(() => {
            try {
                let width = 2 * window.innerWidth;
                let height = 2 * window.innerHeight;
                ctx.canvas.width = width;
                ctx.canvas.height = height;
                ctx.clearRect(0, 0, width, height);
                const state = { ctx, height, width };
                
                new Background().draw(state)

                shapes.concat(verts).forEach(shape => {
                    shape.update()
                    shape.draw(state)
                })

            } catch (e) {
                console.error(e);
                clearInterval(interval)
            }
        }, 1)
    }
}

draw();

// console.log(boundCheck( {x: 0, y:0}, {x: 30, y: 30}, {x:50, y:50}))