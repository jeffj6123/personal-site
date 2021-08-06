const size = 500;
const shapeCount = 10;

const radius = 20;
const FULL_RADIUS = Math.PI * 2;

const getDistanceBetweenShapes = (shape1, shape2) => {
    return Math.sqrt(Math.pow((shape1.x) - (shape2.x), 2) + Math.pow((shape1.y) - (shape2.y), 2));
}

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

// class Shape {
//     constructor(x, y, xOffset, yoffSet, id) {
//         this.x = x;
//         this.y = y;
//         this.xOffset = xOffset;
//         this.yoffSet = yoffSet;
//         this.id = id;
//     }

//     draw(ctx) {
//         // ctx.fillStyle = 'rgb(200, 0, 0)';

//         ctx.strokeStyle = 'rgb(0, ' + Math.floor(255 / size * this.x) + ', ' +
//             Math.floor(255 / size * this.y) + ')';
//         ctx.lineWidth = 3;
//         ctx.beginPath();

//         ctx.arc(this.x, this.y, radius, 0, FULL_RADIUS, true); // Outer circle

//         ctx.closePath();
//         ctx.stroke();


//         ctx.fillStyle = 'rgb(0, ' + Math.floor(255 / size * this.x) + ', ' +
//             Math.floor(255 / size * this.y) + ')';
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, radius / 2, 0, FULL_RADIUS, true);
//         ctx.fill();

//         ctx.fillText(this.id, this.x + radius , this.y);


//     }

//     update() {
//         // this.x = (this.x + this.xOffset) % size;
//         // this.y = (this.y + this.yoffSet ) % size;
//     }
// }

// class Vertice {
//     constructor(shape1, shape2, green = true) {
//         this.shape1 = shape1;
//         this.shape2 = shape2;
//         this.green = green;
//     }

//     update() {

//     }

//     draw(ctx) {

//         ctx.strokeStyle = this.green ? 'green' : "red";
//         ctx.beginPath();
//         ctx.moveTo(this.shape1.x, this.shape1.y);
//         ctx.lineTo(this.shape2.x, this.shape2.y);
//         ctx.closePath();
//         ctx.stroke();
//     }
// }

// function draw() {
//     var canvas = document.getElementById('canvas');
//     if (canvas.getContext) {
//         var ctx = canvas.getContext('2d');

//         let shapes = [];
//         let verts = [];
//         for (let i = 0; i < 20; i++) {
//             let x = Math.random() * size;
//             let y = Math.random() * size;

//             const s = new Shape(y, x, 0, 0, i);
//             if (shapes.every(shape => !checkOverlap(shape, s))) {
//                 shapes.push(s);
//             }
//         }

//         shapes.forEach(shape => {

//             const pairs = shapes.map((s, index) => {
//                 return {
//                     distance: getDistanceBetweenShapes(shape, s),
//                     shape1: shape,
//                     shape2: s,
//                     id: index
//                 }
//             }).sort((a, b) => a.distance - b.distance).slice(0, 4);



//             pairs.forEach(indice => {

//                 let conflictShape = null;
//                 shapes.forEach(s => {
//                     // console.log(distance(indice.shape1, indice.shape2, s), distance(indice.shape1, indice.shape2, s) > radius)
//                     // if (indice.shape1 === s || indice.shape2 === s) {
//                     //     return true;
//                     // }

//                     if( !(indice.shape1 === s || indice.shape2 === s) && 
//                         distance(indice.shape1, indice.shape2, s) < radius) {
//                         conflictShape = s;
//                     }
//                 })

//                 if (!conflictShape || !boundCheck(indice.shape1, indice.shape2, conflictShape)) {
//                     if(conflictShape && !boundCheck(indice.shape1, indice.shape2, conflictShape)) {
//                         console.log(distance(indice.shape1, indice.shape2, conflictShape),
//                         getDistanceBetweenShapes(conflictShape, indice.shape1),
//                         getDistanceBetweenShapes(conflictShape, indice.shape2), conflictShape, indice.shape1, indice.shape2) 
//                     }
//                     verts.push(new Vertice(indice.shape2, indice.shape1));
//                 } else {
//                     verts.push(new Vertice(indice.shape2, indice.shape1, false));
//                     // console.log(distance(indice.shape1, indice.shape2, conflictShape),
//                     // getDistanceBetweenShapes(conflictShape, indice.shape1),
//                     // getDistanceBetweenShapes(conflictShape, indice.shape2), conflictShape, indice.shape1, indice.shape2)
//                 }
//             })

//         })
//         // for (let j = -.5; j < shapeCount; j++) {
//         //     for (let i = -.5; i < shapeCount; i++) {
//         //         if(Math.random() > .5) {
//         //             shapes.push(new Shape(
//         //                 j * (size / shapeCount), // Math.random() * size, 
//         //                 i * (size / shapeCount),// Math.random() * size, 
//         //                 Math.random(),
//         //                 Math.random()
//         //             ))               
//         //         }
//         //     }
//         // }
//         console.log(verts);
//         let interval = setInterval(() => {
//             try {
//                 ctx.clearRect(0, 0, size, size);

//                 shapes.concat(verts).forEach(shape => {
//                     shape.update()
//                     shape.draw(ctx)
//                 })
//             } catch (e) {
//                 console.error(e);
//                 clearInterval(interval)
//             }
//         }, 1)
//     }
// }