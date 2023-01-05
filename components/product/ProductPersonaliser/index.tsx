import cn from 'classnames';
import { ChangeEvent, FC, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { Canvas } from '../Canvas';
import { Select } from '../../common/Select';
import { PersonalisationOptions } from '@commerce/utils/personalisation';

type ProductPersonaliserOption = { label: string; value: string };

type ProductPersonaliserImage = {
  url: string;
  position: string;
  coordinates: string;
  fontSize: number;
};

type ProductPersonaliserProps = {
  images: ProductPersonaliserImage[];
  canvasWidth: number;
  canvasHeight: number;
  colors: ProductPersonaliserOption[];
  fonts: ProductPersonaliserOption[];
  characters: string;
  maxTextLength: number;
  submitText: string;
  onChange: (options: PersonalisationOptions) => void;
};

const convertTextPosition = (value: string) => {
  const [x, y] = value.split(',');

  return { x: Number(x), y: Number(y) };
};

export const ProductPersonaliser: FC<ProductPersonaliserProps> = ({
  canvasWidth,
  canvasHeight,
  colors,
  fonts,
  images,
  characters,
  maxTextLength,
  submitText,
  onChange,
}: ProductPersonaliserProps) => {
  const [text, setText] = useState<string>('');
  const [textColor, setTextColor] = useState<string>(colors[0].value);
  const [fontFamily, setFontFamily] = useState<string>(fonts[0].value);
  const [image, setImage] = useState<ProductPersonaliserImage>(images[0]);

  const maxTextLengthReached = text.length >= maxTextLength;

  const onColorChange = useCallback((evt: ChangeEvent<HTMLSelectElement>) => {
    setTextColor(evt.target.value);
  }, []);

  const onFontChange = useCallback((evt: ChangeEvent<HTMLSelectElement>) => {
    setFontFamily(evt.target.value);
  }, []);

  const onPositionChange = useCallback(
    (evt: ChangeEvent<HTMLSelectElement>) => {
      const imageIndex = Number(evt.target.value);
      const newImage = images[imageIndex];

      if (!newImage) {
        throw new Error(`No image found at index: ${imageIndex}`);
      }

      setImage(newImage);
    },
    [images],
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

  useEffect(() => {
    require('webfontloader').load({
      google: {
        families: fonts.map(({ value }) => value),
      },
    });
  }, [fonts]);

  useEffect(() => {
    onChange({
      imageUrl: image.url,
      text,
      textColor,
      textPosition: image.position,
      textCoordinates: convertTextPosition(image.coordinates),
      fontFamily,
      fontSize: image.fontSize,
    })
  }, [image, text, textColor, fontFamily, onChange]);

  return (
    <div className="flex">
      <div className="w-full">
        <span className="text-sm">
          {text.length} / {maxTextLength} characters
        </span>
        <div
          className={cn(
            'mt-2 w-full max-w-full grid grid grid-flow-row grid-cols-7 md:grid-cols-6 lg:grid-cols-12 border-t border-l border-accent-2',
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
        <div className="mt-3 flex space-x-1 lg:space-x-2">
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
        <div className="mt-6 space-y-4 lg:flex lg:space-y-0 lg:space-x-2 xl:space-x-4">
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
          {images.length > 1 && (
            <Select
              label="Position"
              name="position"
              options={images.map(({ position }, index) => ({
                label: position,
                value: String(index),
              }))}
              onChange={onPositionChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};
