import { useEffect, useRef, useState } from "react";
import "./App.css";

interface BallProperties {
  x: number;
  y: number;
  dx: number;
  dy: number;
  value: number;
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
        value: Math.floor(Math.random() * 10) + 1,
      };
      ballsRef.current.push(newBall);
    }
  }

  function handleClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasContext = canvas.getContext("2d");
      if (canvasContext) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        ballsRef.current.forEach((ball, index) => {
          const dist = Math.sqrt(
            Math.pow(mouseX - ball.x, 2) + Math.pow(mouseY - ball.y, 2)
          );
          if (dist < 20) {
            setScore((prevScore) => prevScore + ball.value);
            ballsRef.current.splice(index, 1);
          }
        });
      }
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

      ballsRef.current.forEach((ball, index) => {
        ball.y += ball.dy;
        ball.x += ball.dx;

        if (canvasRef.current) {
          if (ball.y > canvasRef.current?.height) {
            ballsRef.current.splice(index, 1);
          }
        }

        drawBall(canvasContext, ball.x, ball.y, ball.value);
      });

      requestAnimationFrame(animate);
    }
  }

  function drawBall(
    canvasContext: CanvasRenderingContext2D,
    x: number,
    y: number,
    value: number
  ) {
    canvasContext.beginPath();
    canvasContext.arc(x, y, 15, 0, Math.PI * 2);
    canvasContext.fillStyle = "#0095DD";
    canvasContext.fill();
    canvasContext.closePath();

    canvasContext.fillStyle = "#FFFFFF";
    canvasContext.font = "16px Arial";
    canvasContext.textAlign = "center";
    canvasContext.textBaseline = "middle";
    canvasContext.fillText(value.toString(), x, y);
  }

  function startGame() {
    animate();
  }

  useEffect(() => {
    function resizeCanvas() {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <>
      <div className="flex justify-between w-full">
        <button onClick={startGame}>Start Game</button>
        <span>Score: {score}</span>
      </div>
      <canvas
        className="block bg-black cursor-pointer w-full"
        ref={canvasRef}
        onClick={handleClick}
      ></canvas>
    </>
  );
}

export default App;
