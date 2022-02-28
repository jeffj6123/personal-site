import React, { useRef, useEffect, useState } from 'react'
import { shapeCount } from '../logic/constants';
import { debounced } from '../logic/debounce';
import { checkOverlap, detectIslands, generateEdgeIds, generateVertices } from '../logic/graph';
import { AStarFinding, Node } from '../logic/pathFinding';
import { BaseShape, Circle, Crawler, ISquarePoint, RectCircleColliding, ShapeHandler, Vertice } from '../logic/shape';

export interface IDrawInfo {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
}

export interface IUpdateInfo {
    tickSizeInMilliseconds: number;
}

function generateInitialState(width: number, height: number) {
    height = height - 50;

    Circle.radius = Math.min(width / 60, 22);
    let landingTile = document.getElementById('landing-tile');

    let refRect: ISquarePoint = landingTile.getBoundingClientRect();
    refRect.y - 50;

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
        handler.verticies[vert.id] = vert;
    })

    let crawler = new Crawler(handler, shapes[0]);

    return {
        crawler,
        pathFinding,
        items: [].concat(verts).concat(shapes)
    }
}


export default function Graph() {
    const [graphState, setState] = useState(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const draw = (ctx: CanvasRenderingContext2D, entities: any) => {
        let width = window.innerWidth;
        let height = window.innerHeight - 50;
        ctx.canvas.width = width;
        ctx.canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        const state = { ctx, height, width };

        (entities.items as BaseShape[]).forEach(shape => {
            shape.draw(state)
        })
        entities.crawler.draw(state)
    }

    const onMouseMove = debounced(10, (event: MouseEvent) => {
        console.log
        const closest = graphState.pathFinding.findClosestNodeToAPoint({
            x: event.pageX,
            y: event.pageY
        })
        console.log(event)
        graphState.crawler.setNewpath(graphState.pathFinding.generatePath(graphState.crawler.nextNode.asPathFindingNode(), closest))
    })

    useEffect(() => {
        let width = window.innerWidth;
        let height = window.innerHeight;
        const state = generateInitialState(width, height);
        setState(state);

        let previousTime = new Date();
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        let animationFrameId: number;

        let intervalId = setInterval(() => {
            const currentTime = new Date();
            const tick = currentTime.getTime() - previousTime.getTime();
            const updateState = { tickSizeInMilliseconds: tick };

            (state.items as BaseShape[]).forEach(shape => {
                shape.update(updateState)
            })
            previousTime = currentTime;

            state.crawler.update(updateState);
        }, 35)

        //Our draw came here
        const render = () => {
            draw(context, state)
            animationFrameId = window.requestAnimationFrame(render)
        }
        render()

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            clearTimeout(intervalId);
        }
    }, [])

    return <canvas ref={canvasRef} className="chart-container" onMouseMove={(event) => onMouseMove(event)} onClick={() => graphState.crawler.setNewColor() }/>
}
