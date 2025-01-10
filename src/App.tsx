import { useRef, useState } from "react";
import "./App.css";

interface BallProperties {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<BallProperties[]>([]);
  const [score, setScore] = useState(0);

  function createBall() {
    const canvas = canvasRef.current;
    if (canvas) {
      const newBall = {
        x: Math.random() * canvas.width,
        y: -Math.random() * 100,
        dx: Math.random() * 2 - 1,
        dy: Math.random() * 3 + 1,
      };
      ballsRef.current.push(newBall);
    }
  }

  function animate() {
    const canvasContext = canvasRef.current?.getContext("2d");

    if (canvasContext) {
      canvasContext.clearRect(
        0,
        0,
        canvasRef.current?.width || 0,
        canvasRef.current?.height || 0
      );

      if (Math.random() < 0.1) {
        createBall();
      }

      ballsRef.current.forEach((ball) => {
        ball.y += ball.dy;
        ball.x += ball.dx;

        // if (canvasRef.current) {
        //   if (ball.y > canvasRef.current?.height) {
        //     ball.y = -20;
        //     ball.x = Math.random() * canvasRef.current?.width;
        //   }
        // }

        drawBall(canvasContext, ball.x, ball.y);
      });

      requestAnimationFrame(animate);
    }
  }

  function drawBall(
    canvasContext: CanvasRenderingContext2D,
    x: number,
    y: number
  ) {
    canvasContext.beginPath();
    canvasContext.arc(x, y, 20, 0, Math.PI * 2);
    canvasContext.fillStyle = "#0095DD";
    canvasContext.fill();
    canvasContext.closePath();
  }

  function startGame() {
    animate();
  }

  return (
    <>
      <div>
        <button onClick={startGame}>Start Game</button>
        <span>Score: {score}</span>
      </div>
      <canvas ref={canvasRef} width="320" height="560"></canvas>
    </>
  );
}

export default App;
