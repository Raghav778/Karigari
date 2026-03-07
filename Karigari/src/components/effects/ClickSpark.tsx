import { useCallback, useEffect, useRef } from "react";

interface Spark {
  x: number;
  y: number;
  angle: number;
  speed: number;
  life: number;
  maxLife: number;
}

const ClickSpark = ({ children }: { children: React.ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const animFrameRef = useRef<number>(0);

  const createSparks = useCallback((x: number, y: number) => {
    const count = 8;
    for (let i = 0; i < count; i++) {
      sparksRef.current.push({
        x,
        y,
        angle: (Math.PI * 2 * i) / count + Math.random() * 0.5,
        speed: 2 + Math.random() * 3,
        life: 1,
        maxLife: 0.4 + Math.random() * 0.3,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleClick = (e: MouseEvent) => createSparks(e.clientX, e.clientY);
    window.addEventListener("click", handleClick);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current = sparksRef.current.filter((s) => {
        s.life -= 0.02;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.speed *= 0.96;
        if (s.life <= 0) return false;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2 * s.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(50, 100%, 50%, ${s.life})`;
        ctx.shadowColor = "hsla(50, 100%, 50%, 0.5)";
        ctx.shadowBlur = 6;
        ctx.fill();
        return true;
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [createSparks]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[9998] pointer-events-none"
      />
      {children}
    </div>
  );
};

export default ClickSpark;
