"use client";

import { useEffect, useRef } from "react";

interface Node3D {
  x: number;
  y: number;
  z: number;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  size: number;
  text?: string;
}

export function Cinematic3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse parallax tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) / (width / 2);
      targetMouseY = (e.clientY - height / 2) / (height / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 1. Build 3D Polyhedron (Icosahedron / Diamond nodes)
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVertices: Node3D[] = [
      { x: -1, y: phi, z: 0 },
      { x: 1, y: phi, z: 0 },
      { x: -1, y: -phi, z: 0 },
      { x: 1, y: -phi, z: 0 },
      { x: 0, y: -1, z: phi },
      { x: 0, y: 1, z: phi },
      { x: 0, y: -1, z: -phi },
      { x: 0, y: 1, z: -phi },
      { x: phi, y: 0, z: -1 },
      { x: phi, y: 0, z: 1 },
      { x: -phi, y: 0, z: -1 },
      { x: -phi, y: 0, z: 1 },
    ].map((v) => ({
      x: v.x * 120,
      y: v.y * 120,
      z: v.z * 120,
    }));

    // Edges connecting vertices with distance <= 245
    const edges: [number, number][] = [];
    for (let i = 0; i < rawVertices.length; i++) {
      for (let j = i + 1; j < rawVertices.length; j++) {
        const dx = rawVertices[i].x - rawVertices[j].x;
        const dy = rawVertices[i].y - rawVertices[j].y;
        const dz = rawVertices[i].z - rawVertices[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 260) {
          edges.push([i, j]);
        }
      }
    }

    // 2. Build 3D Floating Particles & Code Glyphs
    const CODE_SNIPPETS = [
      "{ }",
      "O(1)",
      "O(log N)",
      "DP[i]",
      "async",
      "=>",
      "binary_search",
      "graph.dfs()",
      "tree.root",
      "0x1F",
      "Stack<T>",
      "return true",
    ];

    const COLORS = [
      "#818cf8", // Indigo
      "#c084fc", // Purple
      "#38bdf8", // Sky
      "#f472b6", // Pink
      "#34d399", // Emerald
      "#fbbf24", // Amber
    ];

    const PARTICLE_COUNT = 90;
    const particles: Particle3D[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 1600,
        z: Math.random() * 1800 + 100,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: -(Math.random() * 1.5 + 0.8), // moves toward camera
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 2.5 + 1.2,
        text: Math.random() > 0.65 ? CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)] : undefined,
      });
    }

    // 3. Animation Loop Variables
    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;
    let flareProgress = 0;

    const render = () => {
      // Smooth camera interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Dark cinematic canvas clear with fading trails
      ctx.fillStyle = "rgba(4, 7, 16, 0.45)";
      ctx.fillRect(0, 0, width, height);

      // Radial Cinematic Vignette & Ambient Glows
      const radialGrad = ctx.createRadialGradient(
        width * 0.35 + mouseX * 80,
        height * 0.45 + mouseY * 80,
        50,
        width / 2,
        height / 2,
        width * 0.85
      );
      radialGrad.addColorStop(0, "rgba(79, 70, 229, 0.16)"); // Indigo glow
      radialGrad.addColorStop(0.35, "rgba(147, 51, 234, 0.08)"); // Purple glow
      radialGrad.addColorStop(0.7, "rgba(6, 182, 212, 0.04)"); // Cyan ambient
      radialGrad.addColorStop(1, "rgba(2, 4, 10, 0.85)"); // Deep space black
      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // --- 3D HORIZON PERSPECTIVE GRID (Floor) ---
      const fov = 450;
      const horizonY = height * 0.62 + mouseY * 40;
      ctx.strokeStyle = "rgba(99, 102, 241, 0.15)";
      ctx.lineWidth = 1;

      // Vanishing lines
      const gridCols = 16;
      for (let i = -gridCols; i <= gridCols; i++) {
        const xStart = width * 0.5 + i * (width / gridCols) * 2;
        ctx.beginPath();
        ctx.moveTo(width * 0.5 + mouseX * 60, horizonY);
        ctx.lineTo(xStart + mouseX * 180, height + 100);
        ctx.stroke();
      }

      // Horizontal depth lines
      const depthLines = 10;
      for (let j = 1; j <= depthLines; j++) {
        const depth = Math.pow(j / depthLines, 2.2);
        const yLine = horizonY + depth * (height - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, yLine);
        ctx.lineTo(width, yLine);
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.04 + depth * 0.22})`;
        ctx.stroke();
      }

      // --- 3D FLOATING PARTICLES & CODE NODES ---
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Wrap around when passing camera
        if (p.z <= 20) {
          p.z = 1800;
          p.x = (Math.random() - 0.5) * 2000;
          p.y = (Math.random() - 0.5) * 1600;
        }

        const scale = fov / (fov + p.z);
        const screenX = width * 0.5 + (p.x + mouseX * 150) * scale;
        const screenY = height * 0.5 + (p.y + mouseY * 150) * scale;

        if (screenX >= -50 && screenX <= width + 50 && screenY >= -50 && screenY <= height + 50) {
          const alpha = Math.min(1, Math.max(0, (1 - p.z / 1800) * 1.3));
          ctx.save();
          ctx.globalAlpha = alpha;

          if (p.text) {
            ctx.font = `${Math.max(9, Math.round(13 * scale))}px monospace`;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10 * scale;
            ctx.fillText(p.text, screenX, screenY);
          } else {
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8 * scale;
            ctx.beginPath();
            ctx.arc(screenX, screenY, Math.max(1, p.size * scale), 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // --- 3D ROTATING HOLOGRAPHIC POLYHEDRON (Left Center Focal Point) ---
      angleX += 0.007;
      angleY += 0.009;
      angleZ += 0.004;

      const polyCenterX = width < 1024 ? width * 0.5 : width * 0.3;
      const polyCenterY = height * 0.5 + mouseY * 30;
      const polyFov = 600;

      // Rotate vertices
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      const projected = rawVertices.map((v) => {
        // Rotate around X
        let y1 = v.y * cosX - v.z * sinX;
        let z1 = v.y * sinX + v.z * cosX;

        // Rotate around Y
        let x2 = v.x * cosY + z1 * sinY;
        let z2 = -v.x * sinY + z1 * cosY;

        // Rotate around Z
        let x3 = x2 * cosZ - y1 * sinZ;
        let y3 = x2 * sinZ + y1 * cosZ;

        // Push forward into depth
        const depth = z2 + 500;
        const pScale = polyFov / depth;
        return {
          sx: polyCenterX + x3 * pScale + mouseX * 50,
          sy: polyCenterY + y3 * pScale + mouseY * 50,
          scale: pScale,
          depth,
        };
      });

      // Draw Polyhedron Wireframe Edges with Glow
      ctx.save();
      for (const [i, j] of edges) {
        const p1 = projected[i];
        const p2 = projected[j];
        const avgDepth = (p1.depth + p2.depth) / 2;
        const edgeAlpha = Math.max(0.1, Math.min(0.85, 450 / avgDepth));

        ctx.strokeStyle = `rgba(129, 140, 248, ${edgeAlpha})`;
        ctx.shadowColor = "#818cf8";
        ctx.shadowBlur = 12;
        ctx.lineWidth = 1.6;

        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.stroke();
      }

      // Draw Glowing Nodes / Vertices
      for (const p of projected) {
        ctx.fillStyle = "#c084fc";
        ctx.shadowColor = "#e879f9";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 3.5 * p.scale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Pulsating Core inside 3D Polyhedron
      const pulse = (Math.sin(Date.now() * 0.003) + 1) * 0.5;
      const coreGrad = ctx.createRadialGradient(
        polyCenterX + mouseX * 50,
        polyCenterY + mouseY * 50,
        0,
        polyCenterX + mouseX * 50,
        polyCenterY + mouseY * 50,
        90 + pulse * 35
      );
      coreGrad.addColorStop(0, "rgba(168, 85, 247, 0.45)");
      coreGrad.addColorStop(0.5, "rgba(99, 102, 241, 0.2)");
      coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(polyCenterX + mouseX * 50, polyCenterY + mouseY * 50, 110 + pulse * 35, 0, Math.PI * 2);
      ctx.fill();

      // --- CINEMATIC ANAMORPHIC LENS FLARE SWEEP ---
      flareProgress += 0.003;
      if (flareProgress > 1.8) flareProgress = -0.4;

      if (flareProgress >= 0 && flareProgress <= 1.2) {
        const flareY = height * 0.35 + Math.sin(flareProgress * Math.PI) * 50;
        const flareX = width * flareProgress;

        const flareGrad = ctx.createLinearGradient(flareX - 350, flareY, flareX + 350, flareY);
        flareGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
        flareGrad.addColorStop(0.4, "rgba(129, 140, 248, 0.15)");
        flareGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.65)");
        flareGrad.addColorStop(0.6, "rgba(192, 132, 252, 0.15)");
        flareGrad.addColorStop(1, "rgba(192, 132, 252, 0)");

        ctx.fillStyle = flareGrad;
        ctx.fillRect(flareX - 350, flareY - 1.5, 700, 3);

        // Central burst dot
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(flareX, flareY, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "#030712" }}
    />
  );
}
