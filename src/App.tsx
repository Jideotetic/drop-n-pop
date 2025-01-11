import { useEffect, useRef, useState } from "react";
import { animate } from "./utils/animate";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import popSoundUrl from "/Pop-sound-effect.mp3";

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
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const popSound = new Audio(popSoundUrl);

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
              return false;
            } else {
              setScore((prevScore) => prevScore + ball.value);
              popSound.currentTime = 0;
              popSound.play();
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
          <div className="flex px-8 sm:items-center sm:justify-center sm:px-0 sm:space-x-5 sm:flex mt-9">
            <button
              onClick={handleGameStart}
              className="shrink-0 inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border-2 border-transparent sm:w-auto rounded-xl font-pj hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <span className="shrink-0">Start Game</span>
            </button>
          </div>
        </div>
      )}

      {gameStarted && (
        <>
          <Dialog open={gameOver} onClose={() => {}} className="relative z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black">
              <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 text-center rounded-lg">
                <DialogTitle className="font-bold">Game Over</DialogTitle>
                <Description>Score: {score}</Description>
                <div className="flex">
                  <button
                    onClick={() => {
                      setGameOver(false);
                      setGameStarted(false);
                    }}
                    className="shrink-0 inline-flex items-center justify-center w-full px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-gray-900 border-2 border-transparent sm:w-auto rounded-xl font-pj hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    <span className="shrink-0">Play Again</span>
                  </button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
          <canvas
            className="block bg-black cursor-pointer w-full"
            ref={canvasRef}
            onClick={handleClick}
          ></canvas>
        </>
      )}
    </>
  );
}

export default App;
