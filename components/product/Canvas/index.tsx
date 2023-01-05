import { FC, useEffect, useRef, useState } from 'react';

type CanvasProps = {
  imageUrl: string;
  width: number;
  height: number;
  text?: string;
  textColor: string;
  textPosition: { x: number; y: number };
  fontFamily: string;
  fontSize: number;
};

const drawScaledImage = (
  image: HTMLImageElement,
  ctx: CanvasRenderingContext2D,
) => {
  const { width, height } = image;
  const aspectRatio = height / width;
  const scaledHeight = width * aspectRatio;

  ctx.clearRect(0, 0, width, scaledHeight);
  ctx.drawImage(image, 0, 0, width, width * aspectRatio);
};

const drawText = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  scaleFactor: number,
  text: string,
  textColor: string,
  textPosition: { x: number; y: number },
  fontFamily: string,
  fontSize: number,
) => {
  const scaledFontSize = Math.round(fontSize * scaleFactor);

  ctx.font = `${scaledFontSize}px ${fontFamily}`;
  ctx.fillStyle = textColor;
  ctx.fillText(
    text,
    Math.round((textPosition.x / 100) * canvas.width),
    Math.round((textPosition.y / 100) * canvas.height),
  );
};

const drawCanvas = (
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  text: string,
  textColor: string,
  textPosition: { x: number; y: number },
  fontFamily: string,
  fontSize: number,
) => {
  if (!canvas || !image) {
    return;
  }

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, image.width, image.height);

  const scaleFactor = image.width / canvas.getBoundingClientRect().width;

  drawScaledImage(image, ctx);
  drawText(
    canvas,
    ctx,
    scaleFactor,
    text,
    textColor,
    textPosition,
    fontFamily,
    fontSize,
  );
};

export const Canvas: FC<CanvasProps> = ({
  imageUrl,
  text = '',
  textColor,
  textPosition,
  fontFamily,
  fontSize,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement>();

  // Load the image.
  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      setImage(img);
    };

    img.src = imageUrl;
  }, [imageUrl]);

  // Draw the canvas.
  useEffect(() => {
    const { current: canvas } = canvasRef;

    if (!canvas || !image) {
      return;
    }

    drawCanvas(
      canvas,
      image,
      text,
      textColor,
      textPosition,
      fontFamily,
      fontSize,
    );
  }, [image, text, textColor, textPosition, fontFamily, fontSize]);

  if (!image) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      width={image.width}
      height={image.height}
      style={{ width: '100%', height: 'auto' }}
    />
  );
};
