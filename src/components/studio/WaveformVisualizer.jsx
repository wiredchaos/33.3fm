import { useRef, useEffect } from 'react';

export function WaveformVisualizer({ isActive, getAudioData, className = '', variant = 'default' }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      if (isActive && getAudioData) {
        const audioData = getAudioData();
        if (audioData) {
          ctx.beginPath();
          ctx.strokeStyle = variant === 'cyan' ? '#00ffff' : '#ff0033';
          ctx.lineWidth = 2;
          ctx.shadowColor = variant === 'cyan' ? '#00ffff' : '#ff0033';
          ctx.shadowBlur = 10;
          const sliceWidth = width / audioData.length;
          let x = 0;
          for (let i = 0; i < audioData.length; i++) {
            const v = audioData[i];
            const y = (v * height) / 2 + height / 2;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            x += sliceWidth;
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      } else {
        // Idle animated line
        ctx.beginPath();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        const t = Date.now() / 1000;
        for (let x = 0; x < width; x += 2) {
          const y = height / 2 + Math.sin((x / width) * Math.PI * 8 + t) * (isActive ? 20 : 3);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [isActive, getAudioData, variant]);

  return (
    <div className={`relative rounded-lg overflow-hidden bg-black border border-white/10 ${className}`}>
      <canvas ref={canvasRef} width={800} height={150} className="w-full h-full" style={{ height: '80px' }} />
      {isActive && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" style={{ animation: 'scanLine 2s linear infinite', top: '50%' }} />
        </div>
      )}
    </div>
  );
}
