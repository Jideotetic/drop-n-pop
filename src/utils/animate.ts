import { MutableRefObject, RefObject } from "react";
import { createBall, drawBall } from "./ball";
import { BallProperties } from "../App";

export function animate(
  gameOver: boolean,
  canvasRef: RefObject<HTMLCanvasElement>,
  ballsRef: MutableRefObject<BallProperties[]>
) {
  if (gameOver) return;

  const canvasContext = canvasRef.current?.getContext("2d");

  if (canvasContext) {
    canvasContext.clearRect(
      0,
      0,
      canvasRef.current?.width || 0,
      canvasRef.current?.height || 0
    );

    if (Math.random() < 0.1) {
      createBall(canvasRef, ballsRef);
    }

    ballsRef.current.forEach((ball, index) => {
      ball.y += ball.dy;
      ball.x += ball.dx;

      if (canvasRef.current) {
        if (ball.y > canvasRef.current?.height) {
          ballsRef.current.splice(index, 1);
        }
      }

      drawBall(canvasContext, ball.x, ball.y, ball.value, ball.bomb);
    });

    requestAnimationFrame(() => animate(gameOver, canvasRef, ballsRef));
  }
}
