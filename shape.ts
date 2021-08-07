const size = 500;
const shapeCount = 10;

const radius = 20;
const FULL_RADIUS = Math.PI * 2;


function distance(circle1Ref, circle2Ref, point) {
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
    const denominator = Math.sqrt( (x2minsx1 * x2minsx1) + (y2minusy1 * y2minusy1));

    return numerator / denominator;
}

const boundCheck = (shape1, shape2, conflict) => {

    let copy1 = {...shape1};
    let copy2 = {...shape2};
    
    if(copy1.x > copy2.x ) {
        copy1.x -= radius;
        copy2.x += radius;
    }else {
        copy2.x -= radius;
        copy1.x += radius;
    }

    if(copy1.y > copy2.y ) {
        copy1.y -= radius;
        copy2.y += radius;
    }else {
        copy2.y -= radius;
        copy1.y += radius;
    }

    const arr = [copy1, copy2, conflict];

    arr.sort( (a,b) => a.x - b.x);
    const xCheck = arr[1] === conflict;

    arr.sort( (a,b) => a.y - b.y)
    const yCheck = arr[1] === conflict;


    return xCheck && yCheck;
}

const checkOverlap = (shape1, shape2) => {
    const midPointDistance = getDistanceBetweenShapes(shape1, shape2);

    return midPointDistance < (radius * 2)
}

const getDistanceBetweenShapes = (shape1, shape2) => {
    return Math.sqrt(Math.pow((shape1.x) - (shape2.x), 2) + Math.pow((shape1.y) - (shape2.y), 2));
}

export interface IPoint {
    x: number;
    y: number;
}


export class BaseShape {

    constructor(public id: string) {

                }

    draw(ctx: CanvasRenderingContext2D) {}

    update() {}
}



class Circle extends BaseShape {
    constructor(public position: IPoint,
                public id: string) {
        super(id);
    }

    draw(ctx) {
        // ctx.fillStyle = 'rgb(200, 0, 0)';
        ctx.strokeStyle = 'rgb(0, ' + Math.floor(255 / size * this.position.x) + ', ' +
            Math.floor(255 / size * this.position.y) + ')';
        ctx.lineWidth = 3;
        ctx.beginPath();

        ctx.arc(this.position.x, this.position.y, radius, 0, FULL_RADIUS, true); // Outer circle

        ctx.closePath();
        ctx.stroke();


        ctx.fillStyle = 'rgb(0, ' + Math.floor(255 / size * this.position.x) + ', ' +
            Math.floor(255 / size * this.position.y) + ')';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, radius / 2, 0, FULL_RADIUS, true);
        ctx.fill();

        ctx.fillText(this.id, this.position.x + radius , this.position.y);
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

    draw(ctx) {
        ctx.strokeStyle = this.green ? 'green' : "red";
        ctx.beginPath();
        ctx.moveTo(this.circle1.position.x, this.circle1.position.y);
        ctx.lineTo(this.circle2.position.x, this.circle2.position.y);
        ctx.closePath();
        ctx.stroke();
    }

    public static getVerticeId(circle1: Circle, circle2: Circle): string {
        return [circle1, circle2].map(c => c.id).sort().join("-");
    }
}



export function draw() {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    if (canvas.getContext) {
        let ctx = canvas.getContext('2d');

        let shapes = [];
        let verts = [];
        for (let i = 0; i < 20; i++) {
            let x = Math.random() * size;
            let y = Math.random() * size;

            const s = new Circle({y, x}, i.toString());
            if (shapes.every(shape => !checkOverlap(shape, s))) {
                shapes.push(s);
            }
        }

        shapes.forEach(shape => {

            const pairs = shapes.map((s, index) => {
                return {
                    distance: getDistanceBetweenShapes(shape, s),
                    shape1: shape,
                    shape2: s,
                    id: index
                }
            }).sort((a, b) => a.distance - b.distance).slice(0, 4);



            pairs.forEach(indice => {

                let conflictShape = null;
                shapes.forEach(s => {
                    if( !(indice.shape1 === s || indice.shape2 === s) && 
                        distance(indice.shape1, indice.shape2, s) < radius) {
                        conflictShape = s;
                    }
                })

                if (!conflictShape || !boundCheck(indice.shape1, indice.shape2, conflictShape)) {
                    if(conflictShape && !boundCheck(indice.shape1, indice.shape2, conflictShape)) {
                        console.log(distance(indice.shape1, indice.shape2, conflictShape),
                        getDistanceBetweenShapes(conflictShape, indice.shape1),
                        getDistanceBetweenShapes(conflictShape, indice.shape2), conflictShape, indice.shape1, indice.shape2) 
                    }
                    verts.push(new Vertice(indice.shape2, indice.shape1));
                } else {
                    verts.push(new Vertice(indice.shape2, indice.shape1, false));
                }
            })

        })

        let interval = setInterval(() => {
            try {
                ctx.clearRect(0, 0, size, size);

                shapes.concat(verts).forEach(shape => {
                    shape.update()
                    shape.draw(ctx)
                })
            } catch (e) {
                console.error(e);
                clearInterval(interval)
            }
        }, 1)
    }
}