"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A full-bleed animated WebGL shader background: looping bands of color
 * radiating from the center. Fills its nearest positioned ancestor (use it
 * inside a `relative` container with content layered on top via z-index)
 * rather than the viewport, so it works as a section backdrop.
 */
export function ShaderAnimation({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect reduced-motion: skip the animated WebGL canvas entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const vertexShader = `
      void main() {
        gl_Position = vec4( position, 1.0 );
      }
    `;

    const fragmentShader = `
      #define TWO_PI 6.2831853072
      #define PI 3.14159265359
      precision highp float;
      uniform vec2 resolution;
      uniform float time;

      // Trayfolio brand palette
      const vec3 oliveDark = vec3(0.043, 0.047, 0.031);
      const vec3 terracotta = vec3(0.710, 0.329, 0.122);
      const vec3 gold = vec3(0.788, 0.635, 0.153);
      const vec3 peach = vec3(0.984, 0.918, 0.851);

      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        float t = time * 0.05;
        float lineWidth = 0.002;
        float glow = 0.0;
        for (int i = 0; i < 5; i++) {
          glow += lineWidth * float(i * i) / abs(fract(t + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
        }

        vec3 color = mix(oliveDark, terracotta, smoothstep(0.0, 0.6, glow));
        color = mix(color, gold, smoothstep(0.5, 1.1, glow));
        color = mix(color, peach, smoothstep(1.0, 1.8, glow));

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const camera = new THREE.Camera();
    camera.position.z = 1;
    const scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      time: { value: 0 },
      resolution: { value: new THREE.Vector2() },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    };
    onResize();

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    let animationId = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationId);
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-black ${className}`}
    />
  );
}
