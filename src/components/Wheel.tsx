import { Film } from "./FilmsDashboard";
import { useEffect, useRef, useState } from "react";
import { getRandomInt } from "../utils/functions";

interface WheelProps {
  randomisedFilm: Film | null;
  films: Film[];
  isAnimating: boolean;
  setIsAnimating: (value: React.SetStateAction<boolean>) => void;
}

function Wheel({ randomisedFilm, films, isAnimating, setIsAnimating }: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [currentFilm, setCurrentFilm] = useState<Film | null>(null);

  // Настройки колеса
  const SPIN_DURATION = 3000 + getRandomInt(0, 1000); // время в милисекундах до остановки
  const SPIN_ROTATIONS = 3 + getRandomInt(1, 3); // количество полных оборотов до остановки

  const colors = [
    '#D32F2F', '#00796B', '#006A80',
    '#388E3C', '#F57C00', '#7B1FA2',
    '#00796B', '#FF8F00', '#6A1B9A',
    '#01579B', '#EF6C00', '#1B5E20',
    '#C62828', '#01579B', '#6A1B9A'
  ];

  useEffect(() => {
    if (films.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawWheel(ctx);
  }, [films, rotation, currentFilm]);

  useEffect(() => {
    if (randomisedFilm && !isAnimating) {
      startSpinning(randomisedFilm);
    }
  }, [randomisedFilm]); // Убедитесь, что зависимость правильная

  const drawWheel = (ctx: CanvasRenderingContext2D) => {
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Очищаем canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (films.length === 0) {
      // Если фильмов нет, рисуем пустое колесо
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#f9f9f9';
      ctx.fill();

      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Нет фильмов', centerX, centerY);
      return;
    }

    const sliceAngle = (2 * Math.PI) / films.length;

    // Рисуем секции колеса
    films.forEach((film, index) => {
      const startAngle = index * sliceAngle + rotation;
      const endAngle = (index + 1) * sliceAngle + rotation;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      // Опеределяем цвета для секторов
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Рисуем текст
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);

      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Обрезаем длинные названия
      const maxTextWidth = radius * 0.8;
      let text = film.title;
      let metrics = ctx.measureText(text);

      if (metrics.width > maxTextWidth) {
        // Укорачиваем текст и добавляем "..."
        while (metrics.width > maxTextWidth && text.length > 3) {
          text = text.substring(0, text.length - 1);
          metrics = ctx.measureText(text + '...');
        }
        text = text + '...';
      }

      ctx.fillText(text, radius * 0.6, 0);
      ctx.restore();
    });

    // Рисуем центральный круг
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Рисуем стрелку
    drawArrow(ctx, centerX, centerY, radius);
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) => {
    // Позиция стрелки - справа от колеса
    const arrowX = centerX + radius;
    const arrowY = centerY;

    // Рисуем саму стрелку (треугольник)
    ctx.beginPath();
    ctx.moveTo(arrowX + 30, arrowY - 20);
    ctx.lineTo(arrowX, arrowY);
    ctx.lineTo(arrowX + 30, arrowY + 20);
    ctx.closePath();

    // Яркий цвет для хорошей видимости
    ctx.fillStyle = '#ff0000';
    ctx.fill();

    // Обводка для контраста
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const startSpinning = (targetFilm: Film) => {
    if (films.length === 0 || isAnimating) return;

    setIsAnimating(true);
    setCurrentFilm(targetFilm);

    const targetIndex = films.findIndex(film => film.id === targetFilm.id);
    if (targetIndex === -1) return;

    // Вычисляем угол для целевого фильма (справа = 0 градусов)
    const sliceAngle = (2 * Math.PI) / films.length;

    // ВАЖНО: учитываем текущее положение колеса для плавного перехода
    const currentRotationNormalized = rotation % (2 * Math.PI);
    const targetAngle = - (targetIndex * sliceAngle + sliceAngle / 2);

    // Вычисляем кратчайший путь к цели
    let shortestPath = targetAngle - currentRotationNormalized;

    // Корректируем путь для движения в правильном направлении
    if (shortestPath > Math.PI) shortestPath -= 2 * Math.PI;
    if (shortestPath < -Math.PI) shortestPath += 2 * Math.PI;

    // Добавляем полные обороты
    const fullRotations = SPIN_ROTATIONS * 2 * Math.PI;
    const finalRotation = rotation + fullRotations + shortestPath;

    // Анимация вращения
    const startTime = Date.now();
    const startRotation = rotation;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / SPIN_DURATION, 1);

      // Easing функция для плавного замедления
      // const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const easeOut = (t: number) => Math.sqrt(1 - Math.pow(t - 1, 2));
      const easedProgress = easeOut(progress);

      setRotation(startRotation + easedProgress * (finalRotation - startRotation));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        // Нормализуем rotation чтобы избежать очень больших чисел
        setRotation(finalRotation % (2 * Math.PI));
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center min-h-[520px]">
      <div className="relative mb-8">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border rounded-full shadow-lg"
        />
      </div>
      {currentFilm && !isAnimating && (
        <div className={`p-4 border rounded-lg bg-green-100 border-green-400 `}>
          <>
            <span className="text-lg font-semibold text-green-800 text-center">
              Победил:{' '}
            </span>
            <span className="text-green-700 text-center font-medium">
              {currentFilm.title}
            </span>
          </>
        </div>
      )}
    </div>
  );
}

export default Wheel;