import { IDrawInfo, IUpdateInfo } from ".";
import { FULL_RADIUS } from "./constants";
import { INodePathFindingInfo, Node } from "./pathFinding";

export interface ICirclePoint extends IPoint {
    radius: number;
}

export interface ISquarePoint extends IPoint {
    width: number;
    height: number;
}

export function RectCircleColliding(circle: ICirclePoint, rect: ISquarePoint){
    var distX = Math.abs(circle.x - rect.x-rect.width/2);
    var distY = Math.abs(circle.y - rect.y-rect.height/2);

    if (distX > (rect.width/2 + circle.radius)) { return false; }
    if (distY > (rect.height/2 + circle.radius)) { return false; }

    if (distX <= (rect.width/2)) { return true; } 
    if (distY <= (rect.height/2)) { return true; }

    var dx=distX-rect.width/2;
    var dy=distY-rect.height/2;
    return (dx*dx+dy*dy<=(circle.radius*circle.radius));
}

function evaluateDistance(node: IPoint, goalNode: IPoint, tolerance: number): boolean {
    const x = (node.x - goalNode.x) * (node.x - goalNode.x);
    const y = (node.y - goalNode.y) * (node.y - goalNode.y);
    return Math.sqrt(x + y) < tolerance;
} 

const moveTowardsOneDimensional = (current: number, destination: number, speed: number): number => {
    if (current !== destination) {
        if (current < destination) {
            return Math.min(current += speed, destination)
        } else {
            return Math.max(current -= speed, destination)
        }
    } else {
        return destination;
    }
}

function moveTowards(position: IPoint, destination: IPoint, speed: number): IPoint {
    let xSpeed = speed;
    let ySpeed = speed;
    if (position.x === destination.y) {
        xSpeed = 0;
    } else if (position.y === destination.y) {
        ySpeed = 0;
    } else {
        let angle = Math.atan(Math.abs(position.x - destination.x) / Math.abs(position.y - destination.y)); // * 180/Math.PI
        ySpeed = speed * Math.cos(angle);
        xSpeed = speed * Math.sin(angle);
    }

    return {
        x: moveTowardsOneDimensional(position.x, destination.x, xSpeed),
        y: moveTowardsOneDimensional(position.y, destination.y, ySpeed)
    };
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

export class Circle extends BaseShape {
    public static radius = 20;

    public tempColor = "";

    initialPosition: IPoint;
    goalPosition: IPoint;
    speed = 5;

    constructor(public position: IPoint,
        public id: string) {
        super(id);
        this.initialPosition = { ...position }
        this.goalPosition = { ...position };
    }

    draw(state: IDrawInfo) {
        state.ctx.fillStyle = this.tempColor || 'lightgray';
        state.ctx.lineWidth = 3;
        state.ctx.beginPath();

        state.ctx.arc(this.position.x, this.position.y, Circle.radius, 0, FULL_RADIUS, true); // Outer circle

        state.ctx.closePath();
        state.ctx.shadowBlur = 20;
        state.ctx.shadowColor = "black";
        state.ctx.fill();

        // state.ctx.font = "30px Ariel";
        // state.ctx.fillText(this.id, this.position.x + Circle.radius *1.2, this.position.y);
    }

    update(state: IUpdateInfo) {
        if (Math.abs(this.goalPosition.x - this.position.x) === 0 &&
            Math.abs(this.goalPosition.y - this.position.y) === 0) {

            this.goalPosition.x = (this.initialPosition.x + Math.random() * 20) + 10
            this.goalPosition.y = (this.initialPosition.y + Math.random() * 20) + 10
        } else {
            this.position = moveTowards(this.position, this.goalPosition, this.speed * (state.tickSizeInMilliseconds / 1000))
        }
    }

    asPathFindingNode(): Node {
        return {
            ...this.position,
            id: this.id
        }
    }
}

export class Vertice extends BaseShape {
    lineWidth = (Math.random() + 1) * 5;
    color = "";

    tempColor = "";
    crawlerPosition: Crawler;

    static colors = ["#BDBDBD", "#9E9E9E", "#7D7D7D", "#696969"];
    constructor(public circle1: Circle,
        public circle2: Circle,
        public green = true) {
        super(Vertice.getVerticeId(circle1, circle2));

        this.color = Vertice.colors[Math.floor((Math.random() * Vertice.colors.length))];
    }

    draw(state: IDrawInfo) {
        //Render how far the crawler is
        if(this.crawlerPosition) {

            let start: Circle;
            let end: Circle;
            if(this.crawlerPosition.nextNode.id === this.circle1.id) {
                start = this.circle2;
                end = this.circle1;
            }else{
                start = this.circle1;
                end = this.circle2;
            }

            state.ctx.beginPath();
            state.ctx.strokeStyle = this.tempColor;
            state.ctx.lineWidth = this.lineWidth * 2;
            state.ctx.moveTo(start.position.x, start.position.y);
            state.ctx.lineTo(this.crawlerPosition.position.x, this.crawlerPosition.position.y);
            state.ctx.closePath();
            state.ctx.stroke();

            state.ctx.strokeStyle = this.color;
            state.ctx.lineWidth = this.lineWidth;
            state.ctx.beginPath();
            state.ctx.moveTo(this.crawlerPosition.position.x, this.crawlerPosition.position.y);
            state.ctx.lineTo(end.position.x, end.position.y);    
            state.ctx.closePath();
            state.ctx.stroke();

        }else {
            state.ctx.strokeStyle = this.tempColor || this.color;
            state.ctx.lineWidth = this.lineWidth * (this.tempColor ? 2 : 1);
            state.ctx.beginPath();
            state.ctx.moveTo(this.circle1.position.x, this.circle1.position.y);
            state.ctx.lineTo(this.circle2.position.x, this.circle2.position.y);
            state.ctx.closePath();
            state.ctx.stroke();
        }
    }

    public static getVerticeId(circle1: Circle, circle2: Circle): string {
        return [circle1, circle2].map(c => c.id).sort().join("-");
    }

    public static getVerticeIdWithoutCircle(id: string, id2: string): string {
        return [id, id2].sort().join("-");
    }


}

export class Crawler extends BaseShape {
    position: IPoint;
    speed = 240;

    public nextNode: Circle;
    private currentVert: Vertice;
    currentIndex = 1;
    currentColor = "#006400";
    constructor(private handler: ShapeHandler, private nodes: INodePathFindingInfo[]) {
        super('crawler');

        this.position = handler.circles[nodes[0].node.id].position;
        this.nextNode = handler.circles[nodes[0].node.id];
    }

    draw(state: IDrawInfo) {
        state.ctx.fillStyle = this.currentColor;
        state.ctx.lineWidth = 3;
        state.ctx.beginPath();

        state.ctx.arc(this.position.x, this.position.y, Circle.radius / 2, 0, FULL_RADIUS, true); // Outer circle

        state.ctx.closePath();
        state.ctx.fill();

        // state.ctx.fillText(this.id, this.position.x + Circle.radius, this.position.y);
    }

    update(state: IUpdateInfo) {
        //When close to a node color it
        if (evaluateDistance(this.position, this.nextNode.position, Circle.radius / 2)) {
            this.nextNode.tempColor = this.currentColor;
        }

        //when there is
        if (this.currentIndex > -1) {
            if (evaluateDistance(this.position, this.nextNode.position, Circle.radius / 5)) {
                    this.position = this.nextNode.position;


                if(this.currentVert) {
                    this.currentVert.crawlerPosition = null;
                }

                if (this.currentIndex < this.nodes.length) {
                    const currentNode = this.nextNode;

                    this.nextNode = this.handler.circles[this.nodes[this.currentIndex].node.id];
                    

                    if(currentNode.id !== this.nextNode.id) {
                        const vert = this.handler.verticies[Vertice.getVerticeId(currentNode, this.nextNode)];
                        vert.tempColor = this.currentColor;
                        vert.crawlerPosition = this;
                        this.currentVert = vert;
                        console.log(vert)

                    }
                    this.currentIndex++;
                } else {
                    this.currentIndex = -1;
                }
            }
        }

        this.position = moveTowards(this.position, this.nextNode.position, this.speed * (state.tickSizeInMilliseconds / 1000))
    }

    setNewpath(nodes: INodePathFindingInfo[]) {
        this.currentIndex = 0;
        this.nodes = nodes;
        this.currentColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        console.log(this);
    }
}

export class textRenderer  extends BaseShape {
    constructor(private crawler: Crawler) {
        super("name");
    }

    draw(state: IDrawInfo) {
        state.ctx.fillStyle = this.crawler.currentColor;
        state.ctx.lineWidth = 3;
        state.ctx.beginPath();


        const largeText = Math.min(state.width / 8, 200);

        state.ctx.font = `normal ${largeText}px Aldrich`;
        state.ctx.textAlign = "center"; // To Align Center
        // font-family: 'Aldrich', sans-serif;

        state.ctx.fillText("Jeffrey Jarry", state.width / 2, state.height * .33);
        state.ctx.font = `${largeText * .3}px Aldrich`;
        state.ctx.fillText("Try clicking around", state.width / 2, state.height * .33 + largeText * .3 * 2)
    }
}

export class ShapeHandler {
    verticies: Record<string, Vertice> = {};
    circles: Record<string, Circle> = {};

    constructor() {

    }
}