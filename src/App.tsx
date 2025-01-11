import { useEffect, useRef, useState } from "react";
import { animate } from "./utils/animate";

export interface BallProperties {
  x: number;
  y: number;
  dx: number;
  dy: number;
  value: number;
  bomb: boolean;
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<BallProperties[]>([]);
  const [_score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // function handleClick(event: React.MouseEvent<HTMLCanvasElement>) {
  //   const canvas = canvasRef.current;
  //   if (canvas) {
  //     const canvasContext = canvas.getContext("2d");
  //     if (canvasContext) {
  //       const rect = canvas.getBoundingClientRect();
  //       const mouseX = event.clientX - rect.left;
  //       const mouseY = event.clientY - rect.top;

  //       console.log(rect, mouseX, mouseY);

  //       ballsRef.current.forEach((ball, index) => {
  //         const dist = Math.sqrt(
  //           Math.pow(mouseX - ball.x, 2) + Math.pow(mouseY - ball.y, 2)
  //         );
  //         if (dist < 20) {
  //           if (ball.bomb) {
  //             setGameOver(true);
  //             ballsRef.current = [];
  //             alert("Game Over");
  //           } else {
  //             setScore((prevScore) => prevScore + ball.value);
  //             ballsRef.current.splice(index, 1);
  //           }
  //         }
  //       });
  //     }
  //   }
  // }

  function handleClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (canvas) {
      const canvasContext = canvas.getContext("2d");
      if (canvasContext) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const updatedBalls = ballsRef.current.filter((ball) => {
          const dist = Math.sqrt(
            Math.pow(mouseX - ball.x, 2) + Math.pow(mouseY - ball.y, 2)
          );
          if (dist < 20) {
            if (ball.bomb) {
              setGameOver(true);
              ballsRef.current = [];
              alert("Game Over");
              return false;
            } else {
              setScore((prevScore) => prevScore + ball.value);
              return false;
            }
          }
          return true;
        });

        ballsRef.current = updatedBalls;
      }
    }
  }

  function handleGameStart() {
    setGameOver(false);
    setScore(0);
    ballsRef.current = [];
    setGameStarted(true);
    animate(gameOver, canvasRef, ballsRef);
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

  useEffect(() => {
    if (gameStarted) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      animate(gameOver, canvasRef, ballsRef);
    }
  }, [gameStarted]);

  return (
    <>
      {!gameStarted && (
        <div className="flex justify-center items-center h-screen w-screen">
          <div className="px-8 sm:items-center sm:justify-center sm:px-0 sm:space-x-5 sm:flex mt-9 shrink-0">
            <button
              onClick={handleGameStart}
              className="inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border-2 border-transparent sm:w-auto rounded-xl font-pj hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              Start Game
            </button>
          </div>
          {/* <span>Score: {score}</span> */}
        </div>
      )}

      {gameStarted && (
        <canvas
          className="block bg-black cursor-pointer w-full"
          ref={canvasRef}
          onClick={handleClick}
        ></canvas>
      )}
    </>
  );
}

export default App;
