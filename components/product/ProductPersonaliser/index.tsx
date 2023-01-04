import cn from 'classnames';
import { ChangeEvent, FC, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { Canvas } from '../Canvas';
import { Select } from '../../common/Select';

type ProductPersonaliserOption = { label: string; value: string };

type ProductPersonaliserProps = {
  imageUrl: string;
  canvasWidth: number;
  canvasHeight: number;
  colors: ProductPersonaliserOption[];
  fonts: ProductPersonaliserOption[];
  positions: ProductPersonaliserOption[];
  characters: string;
  maxTextLength: number;
  textSize: number;
  submitText: string;
  onSubmit: ({
    message,
    colour,
    font,
    position,
    imageUrl,
  }: {
    message: string,
    colour: string,
    font: string,
    position: string,
    imageUrl: string,
  }) => void;
};

const convertTextPosition = (value: string) => {
  const [x, y] = value.split(',');

  return { x: Number(x), y: Number(y) };
};

export const ProductPersonaliser: FC<ProductPersonaliserProps> = ({
  imageUrl,
  canvasWidth,
  canvasHeight,
  colors,
  fonts,
  positions,
  characters,
  maxTextLength,
  textSize,
  submitText,
  onSubmit,
}: ProductPersonaliserProps) => {
  const [text, setText] = useState<string>('');
  const [textColor, setTextColor] = useState<string>(colors[0].value);
  const [fontFamily, setFontFamily] = useState<string>(fonts[0].value);
  const [textPosition, setTextPosition] = useState<string>(positions[0].value);

  const maxTextLengthReached = text.length >= maxTextLength;

  const onColorChange = useCallback((evt: ChangeEvent<HTMLSelectElement>) => {
    setTextColor(evt.target.value);
  }, []);

  const onFontChange = useCallback((evt: ChangeEvent<HTMLSelectElement>) => {
    setFontFamily(evt.target.value);
  }, []);

  const onPositionChange = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      setTextPosition(evt.target.value);
    },
    [],
  );

  const addCharacter = useCallback(
    (character: string) => {
      const newText = `${text}${character}`;

      if (maxTextLengthReached) {
        throw new Error('Text exceeds the max characters.');
      }

      setText(newText);
    },
    [text, maxTextLengthReached],
  );

  const removeCharacter = useCallback(() => {
    const chars = text.split('');

    chars.pop();

    setText(chars.join(''));
  }, [text]);

  const clearText = useCallback(() => {
    setText('');
  }, []);

  const handleSubmit = useCallback(() => {
    onSubmit({
      message: text,
      colour: textColor,
      font: fontFamily,
      position: textPosition,
      imageUrl,
    });
  }, [onSubmit, text, textColor, fontFamily, textPosition, imageUrl]);

  useEffect(() => {
    require('webfontloader').load({
      google: {
        families: fonts.map(({ value }) => value),
      },
    });
  }, [fonts]);

  return (
    <div className="flex">
      <div style={{ minWidth: canvasWidth, minHeight: canvasHeight }}>
        <Canvas
          text={text}
          imageUrl={imageUrl}
          width={canvasWidth}
          height={canvasHeight}
          textColor={textColor}
          textPosition={convertTextPosition(textPosition)}
          fontSize={textSize}
          fontFamily={fontFamily}
        />
      </div>
      <div className="ml-5 w-full max-w-full">
        <span className="text-sm">
          {text.length} / {maxTextLength} characters
        </span>
        <div
          className={cn(
            'mt-2 w-full max-w-full grid grid grid-flow-row grid-cols-7 md:grid-cols-6 lg:grid-cols-7 border-t border-l border-accent-2',
            !!maxTextLengthReached && 'opacity-30',
          )}
        >
          {characters.split('').map((character) => (
            <button
              type="button"
              disabled={maxTextLengthReached}
              key={character}
              style={{ fontFamily }}
              className={cn(
                'p-2 text-xl leading-none border-accent-2 border-r border-b',
                maxTextLengthReached
                  ? 'cursor-not-allowed'
                  : 'hover:bg-accent-2',
              )}
              onClick={() => {
                addCharacter(character);
              }}
            >
              {character}
            </button>
          ))}
        </div>
        <div className="mt-3 flex space-x-1">
          <button
            type="button"
            className={cn(
              'p-2 text-l leading-none border-black border border-black hover:bg-black hover:text-white hover:bg-black flex-1',
            )}
            onClick={clearText}
          >
            Clear
          </button>
          <button
            type="button"
            className={cn(
              'p-2 text-l leading-none border-black border border-black hover:bg-black hover:text-white hover:bg-black flex-1',
            )}
            onClick={removeCharacter}
          >
            Backspace
          </button>
        </div>
        <div className="mt-6 space-y-4">
          <Select
            label="Colour"
            name="colours"
            options={colors}
            onChange={onColorChange}
          />
          <Select
            label="Font"
            name="fonts"
            options={fonts}
            onChange={onFontChange}
          />
          <Select
            label="Position"
            name="position"
            options={positions}
            onChange={onPositionChange}
          />
        </div>
        <div className="mt-5 flex justify-center items-center">
          <button
            type="submit"
            onClick={handleSubmit}
            className="max-w-xs flex-1 uppercase bg-black border border-transparent rounded-sm py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-black sm:w-full"
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
};
