const size = 500;
const shapeCount = 30;

let radius = 20;
const FULL_RADIUS = Math.PI * 2;

export interface IDrawInfo {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
}

export interface IUpdateInfo {
    tickSizeInMilliseconds: number;
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

const moveTowardsOneDimensional = (current :number, destination: number, speed: number): number => {
    if(current !== destination) {
        if(current < destination) {
           return Math.min(current += speed, destination) 
        }else{
            return Math.max(current -= speed, destination)
        }
    }else{
        return destination;
    }
}

function moveTowards(position: IPoint, destination: IPoint, speed): IPoint {
    let xSpeed = speed;
    let ySpeed = speed;
    if(position.x === destination.y ) {
        xSpeed = 0;
    }else if(position.y === destination.y) {
        ySpeed = 0;
    }else{
        let angle = Math.atan(Math.abs(position.x - destination.x) / Math.abs(position.y - destination.y)); // * 180/Math.PI
        ySpeed = speed * Math.cos(angle);
        xSpeed = speed * Math.sin(angle);
    }
    
    return {
        x: moveTowardsOneDimensional(position.x, destination.x, xSpeed),
        y: moveTowardsOneDimensional(position.y, destination.y, ySpeed)
    };
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

    update(state: IUpdateInfo) { }
}

export class Background extends BaseShape {
    gradiantStart = 0;
    constructor() {
        super('background')
    }

    update() {
        if(this.gradiantStart > 1) {
            this.gradiantStart -= .01
        }else if(this.gradiantStart < 0){
            this.gradiantStart += .01
        }
    }

    draw(state: IDrawInfo) {

        var grd = state.ctx.createLinearGradient(0, 0, state.width, state.height);

        grd.addColorStop(0, "#703fff");
        grd.addColorStop(1 - this.gradiantStart, '#00ffff');
        grd.addColorStop(1, "#703fff");

        // Fill with gradient
        state.ctx.fillStyle = grd;
        state.ctx.fillRect(0, 0, state.width, state.height);

    }
}

class Circle extends BaseShape {
    initialPosition: IPoint;
    goalPosition: IPoint;
    speed = 5;

    constructor(public position: IPoint,
        public id: string) {
        super(id);
        this.initialPosition = {...position}
        this.goalPosition = {...position};
    }

    draw(state: IDrawInfo) {
        // ctx.fillStyle = 'rgb(200, 0, 0)';

        state.ctx.fillStyle = 'lightgray'
        state.ctx.lineWidth = 3;
        state.ctx.beginPath();

        state.ctx.arc(this.position.x, this.position.y, radius, 0, FULL_RADIUS, true); // Outer circle

        state.ctx.closePath();
        state.ctx.shadowBlur = 20;
        state.ctx.shadowColor = "black";
        state.ctx.fill();


        // state.ctx.fillStyle = 'rgb(249, 172, 83)'
        // state.ctx.beginPath();
        // state.ctx.arc(this.position.x, this.position.y, radius / 2, 0, FULL_RADIUS, true);
        // state.ctx.fill();

        // state.ctx.fillText(this.id, this.position.x + radius, this.position.y);
    }

    update(state: IUpdateInfo) {
        if( Math.abs(this.goalPosition.x - this.position.x) === 0 &&
            Math.abs(this.goalPosition.y - this.position.y) === 0) {
            
            this.goalPosition.x = (this.initialPosition.x + Math.random() * 20 ) + 10
            this.goalPosition.y = (this.initialPosition.y + Math.random() * 20 ) + 10
        }else{
            this.position = moveTowards(this.position, this.goalPosition, this.speed * (state.tickSizeInMilliseconds / 1000))
        }
    }
}

class Vertice extends BaseShape {
    lineWidth = (Math.random() + 1)* 5;
    color = "";
    static colors = ["#BDBDBD", "#9E9E9E", "#7D7D7D", "#696969"];
    constructor(public circle1: Circle,
        public circle2: Circle,
        public green = true) {
        super(Vertice.getVerticeId(circle1, circle2));
        
        this.color = Vertice.colors[Math.floor((Math.random() * Vertice.colors.length))];
    }

    draw(state: IDrawInfo) {
        state.ctx.strokeStyle = this.green ? this.color : "red";
        state.ctx.lineWidth = this.lineWidth;
        state.ctx.beginPath();
        state.ctx.moveTo(this.circle1.position.x, this.circle1.position.y);
        state.ctx.lineTo(this.circle2.position.x, this.circle2.position.y);
        state.ctx.closePath();
        // state.ctx.shadowBlur = 20;
        // state.ctx.shadowColor = "black";
        state.ctx.stroke();

        state.ctx.shadowBlur = 0;
    }

    public static getVerticeId(circle1: Circle, circle2: Circle): string {
        return [circle1, circle2].map(c => c.id).sort().join("-");
    }
}

class Crawler extends BaseShape {
    position: IPoint;
    speed = 30;
    constructor(private goalNode: Circle, private startNode: Circle) {
        super('crawler');

        this.position = {...startNode.position};
    }

    draw(state: IDrawInfo) {
        state.ctx.fillStyle = '#006400'
        state.ctx.lineWidth = 3;
        state.ctx.beginPath();

        state.ctx.arc(this.position.x, this.position.y, radius / 2, 0, FULL_RADIUS, true); // Outer circle

        state.ctx.closePath();
        state.ctx.fill();

        state.ctx.fillText(this.id, this.position.x + radius, this.position.y);
    }

    update(state: IUpdateInfo) {
        this.position = moveTowards(this.position, this.goalNode.position, this.speed * (state.tickSizeInMilliseconds / 1000))

        if(this.position.x == this.goalNode.position.x && this.position.y === this.goalNode.position.y) {
            const temp = this.goalNode;
            this.goalNode = this.startNode;
            this.startNode = temp;
        }
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
        for (let i = 0; i < shapeCount; i++) {
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
                    // if (boundCheck(indice.shape1.position, indice.shape2.position, conflictShape.position)) {
                    //     console.log(indice.shape1, indice.shape2, conflictShape)
                    // }
                    console.log("test")
                    // verts.push(new Vertice(indice.shape2, indice.shape1, false));
                }
            })

        })

        let crawler = new Crawler(shapes[0], shapes[1])
        // let background = new Background();

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

                // background.draw(state)
                // background.update();

                verts.concat(shapes).forEach(shape => {
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
