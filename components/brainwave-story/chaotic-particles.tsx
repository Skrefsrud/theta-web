"use client";

import { useRef, useEffect } from "react";
import { motion, useTransform } from "framer-motion";
import { colord, extend } from "colord";
import mix from "colord/plugins/mix";

extend([mix]);

const chaoticColor = "#ff4500"; // OrangeRed
const calmColor = "#dc143c"; // Crimson

class Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  speedX: number;
  speedY: number;
  chaoticFactor: number;
  calmFactor: number;

  constructor(x: number, y: number, chaoticFactor: number, calmFactor: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 1.5 + 0.5;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.chaoticFactor = chaoticFactor;
    this.calmFactor = calmFactor;
  }

  update(
    mouse: { x: number; y: number },
    chaoticFactor: number,
    calmFactor: number,
    time: number,
  ) {
    this.chaoticFactor = chaoticFactor;
    this.calmFactor = calmFactor;

    // Chaotic movement
    let chaoticX = this.x + this.speedX * this.chaoticFactor * 5;
    let chaoticY = this.y + this.speedY * this.chaoticFactor * 5;

    // Calm, wave-like movement
    let calmX =
      this.baseX +
      Math.cos(time * 0.0001 + this.baseX * 0.1) * 10 * this.calmFactor;
    let calmY =
      this.baseY +
      Math.sin(time * 0.0001 + this.baseY * 0.1) * 10 * this.calmFactor;

    this.x = chaoticX * (1 - this.calmFactor) + calmX * this.calmFactor;
    this.y = chaoticY * (1 - this.calmFactor) + calmY * this.calmFactor;

    // Reset if particle goes off-screen
    if (
      this.x > window.innerWidth ||
      this.x < 0 ||
      this.y > window.innerHeight ||
      this.y < 0
    ) {
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight;
      this.baseX = this.x;
      this.baseY = this.y;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const color = colord(chaoticColor)
      .mix(calmColor, this.calmFactor)
      .toRgbString();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

export function ChaoticParticles({
  scrollYProgress,
}: {
  scrollYProgress: any;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0, y: 0 });

  const chaoticFactor = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const calmFactor = useTransform(scrollYProgress, [0.4, 0.8], [0, 1]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.current = [];
      const particleCount = (window.innerWidth * window.innerHeight) / 10000;
      for (let i = 0; i < particleCount; i++) {
        particles.current.push(
          new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            chaoticFactor.get(),
            calmFactor.get(),
          ),
        );
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let animationFrameId: number;
    let time = 0;
    const animate = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => {
        p.update(mouse.current, chaoticFactor.get(), calmFactor.get(), time);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [chaoticFactor, calmFactor]);

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [1, 1, 1, 0]);

  return (
    <motion.canvas
      ref={canvasRef}
      style={{ opacity }}
      className="absolute inset-0 w-full h-full"
    />
  );
}
