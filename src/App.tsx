import { useEffect, useRef } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasContext = canvasRef?.current?.getContext("2d");

    if (canvasContext) {
      console.log("Canvas context:", canvasContext);

      canvasContext.beginPath();
      canvasContext.arc(30, 40, 30, 0, Math.PI * 2, false);
      canvasContext.fillStyle = "#FF0000";
      canvasContext.fill();
      canvasContext.closePath();

      canvasContext.beginPath();
      canvasContext.arc(240, 160, 30, 0, Math.PI * 2, false);
      canvasContext.strokeStyle = "rgb(0 0 255 / 50%)";
      canvasContext.stroke();
      canvasContext.closePath();
    }
  }, []);
  return (
    <>
      <canvas ref={canvasRef} width="480" height="320"></canvas>;
    </>
  );
}

export default App;
