import { MutableRefObject, RefObject } from "react";
import { BallProperties } from "../App";

export function createBall(
  canvasRef: RefObject<HTMLCanvasElement>,
  ballsRef: MutableRefObject<BallProperties[]>
) {
  const canvas = canvasRef.current;
  if (canvas) {
    const isBomb = Math.random() < 0.2;
    const newBall = {
      x: Math.random() * canvas.width,
      y: -Math.random() * 100,
      dx: Math.random() * 2 - 1,
      dy: Math.random() * 3 + 1,
      bomb: isBomb,
      value: isBomb ? 0 : 1,
    };
    ballsRef.current.push(newBall);
  }
}

export function drawBall(
  canvasContext: CanvasRenderingContext2D,
  x: number,
  y: number,
  value: number,
  bomb: boolean
) {
  canvasContext.beginPath();
  canvasContext.arc(x, y, 30, 0, Math.PI * 2);
  canvasContext.fillStyle = bomb ? "red" : "#0095DD";
  canvasContext.fill();
  canvasContext.closePath();

  canvasContext.fillStyle = "#FFFFFF";
  canvasContext.font = "16px Arial";
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";
  canvasContext.fillText(value.toString(), x, y);
}
