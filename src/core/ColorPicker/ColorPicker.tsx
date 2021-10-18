/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from 'react';
import '@itwin/itwinui-css/css/color-picker.css';
import {
  useTheme,
  CommonProps,
  getBoundedValue,
  getWindow,
  useEventListener,
} from '../utils';
import cx from 'classnames';
import {
  ColorValue,
  HslColor,
  RgbColor,
  HsvColor,
} from '../utils/color/ColorValue';
import { ColorByName } from '../utils/color/ColorByName';
import { Slider } from '../Slider';
import ColorSwatch from './ColorSwatch';
import { IconButton } from '../Buttons';
import { Input } from '../Input';

export type Color = HslColor | RgbColor | HsvColor | string;

const getVerticalPercentageOfRectangle = (rect: DOMRect, pointer: number) => {
  const position = getBoundedValue(pointer, rect.top, rect.bottom);
  return ((position - rect.top) / rect.height) * 100;
};
const getHorizontalPercentageOfRectangle = (rect: DOMRect, pointer: number) => {
  const position = getBoundedValue(pointer, rect.left, rect.right);
  return ((position - rect.left) / rect.width) * 100;
};

// Converts color value provided and fills in all hsv, hsl, rgb, hex, and displayString values
export const fillColor = (color: ColorValue) => {
  const hsv = color.toHSV();
  const hsl = color.toHSL();
  const rgb = color.toRGB();

  return {
    hsv: { h: hsv.h, s: hsv.s, v: hsv.v, displayString: color.toHsvString() },
    hsl: { h: hsl.h, s: hsl.s, l: hsl.l, displayString: color.toHslString() },
    rgb: { r: rgb.r, g: rgb.g, b: rgb.b, displayString: color.toRgbString() },
    hex: { hex: color.toHexString() },
  };
};

export type ColorBuilderProps = {
  /**
   * Show HSL, RGB, or HEX input values.
   * Set to NONE to use advanced color builder without showing color input
   */
  defaultColorInputType?: 'HSL' | 'RGB' | 'HEX' | 'NONE';
};

export type ColorPaletteProps = {
  /**
   * Available color values to show in palette
   * */
  colors?: Color[];
  /**
   * Title shown above color palette
   */
  colorPaletteTitle?: string;
};

export type ColorPickerProps = {
  children?: React.ReactNode;
  /**
   * The selected color
   */
  selectedColor?: ColorValue;
  /**
   * Callback fired when the color value is internally updated during
   * operations like dragging a Thumb. Use this callback with caution as a
   * high-volume of updates will occur when dragging.
   */
  onChange?: (color: ColorValue) => void;
  /**
   * Callback fired when selectedColor is done changing.
   * This can be on pointerUp when thumb is done dragging,
   * or when user clicks on color builder components, or when user clicks on color swatch
   */
  onChangeCompleted?: (color: ColorValue) => void;
  /**
   * Props used to determine what advanced color picker components to display
   * to allow user to build their own color.
   * If undefined, paletteProps must be defined.
   */
  builderProps?: ColorBuilderProps;
  /**
   * Props used to display a palette of colors
   * If used in combination with builderProps then the palette is shown below the builder components
   * If undefined, builderProps must be defined.
   */
  paletteProps?: ColorPaletteProps;
} & Omit<CommonProps, 'title'>;

/**
 * Basic ColorPicker component to display a palette of ColorSwatches
 * @example
 * <ColorPicker>
 *   <ColorSwatch key={1} color='#D4F4BD' onClick={onColorClick} />
 *   <ColorSwatch key={2} color='#EEF6E8' onClick={onColorClick} />
 *   <ColorSwatch key={3} color='#9BA5AF' onClick={onColorClick} />
 *   <ColorSwatch key={4} color='#002A44' onClick={onColorClick} />
 * </ColorPicker>
 */
/**
 * Advanced ColorPicker component to display a palette of ColorSwatches and color customization options
 * @example
 * <ColorPicker type='advanced' selectedColor={selectedColor} onSelectionChanged={onColorChanged}>
 *   <ColorSwatch key={1} color='#D4F4BD' onClick={onColorClick} />
 *   <ColorSwatch key={2} color='#EEF6E8' onClick={onColorClick} />
 *   <ColorSwatch key={3} color='#9BA5AF' onClick={onColorClick} />
 *   <ColorSwatch key={4} color='#002A44' onClick={onColorClick} />
 * </ColorPicker>
 */
export const ColorPicker = (props: ColorPickerProps) => {
  const {
    children,
    className,
    selectedColor,
    onChange,
    onChangeCompleted,
    builderProps,
    paletteProps,
    ...rest
  } = props;

  useTheme();

  const ref = React.useRef<HTMLDivElement>(null);

  const [focusedColor, setFocusedColor] = React.useState<number | null>();
  const [activeColor, setActiveColor] = React.useState<ColorValue>(
    typeof selectedColor === 'string'
      ? ColorValue.fromString(selectedColor)
      : ColorValue.fromString('#00121D'),
  );
  const [inputType, setInputType] = React.useState<
    'HEX' | 'HSL' | 'RGB' | 'NONE'
  >(builderProps?.defaultColorInputType ?? 'NONE');

  React.useEffect(() => {
    const colorSwatches = Array.from<HTMLElement>(
      ref.current?.querySelectorAll('.iui-color-swatch, .iui-button') ?? [],
    );
    if (focusedColor != null) {
      colorSwatches[focusedColor]?.focus();
      return;
    }
    const selectedIndex = colorSwatches.findIndex(
      (swatch) =>
        swatch.tabIndex === 0 || swatch.getAttribute('aria-selected') == 'true',
    );
    setFocusedColor(selectedIndex > -1 ? selectedIndex : null);
  }, [focusedColor]);

  // Color palette arrow key navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const colorSwatches = Array.from<HTMLElement>(
      ref.current?.querySelectorAll('.iui-color-swatch, .iui-button') ?? [],
    );
    if (!colorSwatches.length) {
      return;
    }

    const currentlyFocused = colorSwatches.findIndex(
      (swatch) => swatch === ref.current?.ownerDocument.activeElement,
    );
    const currentIndex = currentlyFocused > -1 ? currentlyFocused : 0;
    let newIndex = -1;

    switch (event.key) {
      case 'ArrowDown': {
        // Look for next ColorSwatch with same offsetLeft value
        newIndex = colorSwatches.findIndex(
          (swatch, index) =>
            index > currentIndex &&
            swatch.offsetLeft === colorSwatches[currentIndex].offsetLeft,
        );
        break;
      }
      case 'ArrowUp': {
        // Look backwards for next ColorSwatch with same offsetLeft value
        for (let i = currentIndex - 1; i >= 0; i--) {
          if (
            colorSwatches[i].offsetLeft ==
            colorSwatches[currentIndex].offsetLeft
          ) {
            newIndex = i;
            break;
          }
        }
        break;
      }
      case 'ArrowLeft':
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'ArrowRight':
        newIndex = Math.min(currentIndex + 1, colorSwatches.length - 1);
        break;
      case 'Enter':
      case ' ':
      case 'Spacebar':
        colorSwatches[currentIndex].click();
        event.preventDefault();
        return;
    }

    if (newIndex >= 0 && newIndex < colorSwatches.length) {
      setFocusedColor(newIndex);
      event.preventDefault();
    }
  };

  // Set style values for advanced color picker
  const [dotColor, setDotColor] = React.useState(() =>
    fillColor(selectedColor ?? new ColorValue(ColorByName.red)),
  );

  const [squareColor, setSquareColor] = React.useState(() =>
    fillColor(ColorValue.fromHSV({ h: dotColor.hsv.h, s: 100, v: 100 })),
  );
  const [sliderValue, setSliderValue] = React.useState(() =>
    Math.round(dotColor.hsv.h / 3.59),
  );
  const [squareTop, setSquareTop] = React.useState(() => 100 - dotColor.hsv.v);
  const [squareLeft, setSquareLeft] = React.useState(() => dotColor.hsv.s);
  const [activeDotIndex, setActiveDotIndex] = React.useState<
    number | undefined
  >(undefined);

  const colorSquareStyle = getWindow()?.CSS?.supports?.(
    `--hue: ${squareColor.hsl.displayString}`,
    `--selected-color: ${dotColor.hsl.displayString}`,
  )
    ? {
        '--hue': squareColor.hsl.displayString,
        '--selected-color': dotColor.hsl.displayString,
      }
    : { backgroundColor: squareColor.hsl.displayString };

  const colorDotStyle = getWindow()?.CSS?.supports?.(
    `--top: ${squareTop.toString()}%`,
    `--left: ${squareLeft.toString()}%`,
  )
    ? {
        '--top': squareTop.toString() + '%',
        '--left': squareLeft.toString() + '%',
      }
    : {
        backgroundColor: dotColor.hsl.displayString,
        top: squareTop.toString() + '%',
        left: squareLeft.toString() + '%',
      };

  // Update slider change
  const updateSlider = React.useCallback(
    (y: number, selectionChanged: boolean) => {
      setSliderValue(y);

      const hue = Math.round(y * 3.59);
      const newSquareColor = ColorValue.fromHSV({
        h: hue,
        s: 100,
        v: 100,
      });
      setSquareColor(fillColor(newSquareColor));

      const newDotColor = ColorValue.fromHSV({
        h: hue,
        s: dotColor.hsv.s,
        v: dotColor.hsv.v,
      });

      // Keep same s and v, Update hue
      const color = fillColor(newDotColor);
      setDotColor(color);

      // Only update selected color when dragging is done
      if (selectionChanged) {
        onChangeCompleted?.(newDotColor);
      } else {
        onChange?.(newDotColor);
      }
    },
    [dotColor.hsv.s, dotColor.hsv.v, onChange, onChangeCompleted],
  );
  const onChangeColor = React.useCallback(
    (values: ReadonlyArray<number>) => {
      updateSlider(values[0], false);
    },
    [updateSlider],
  );

  const onChangeColorCompleted = React.useCallback(
    (values: ReadonlyArray<number>) => {
      updateSlider(values[0], true);
    },
    [updateSlider],
  );

  // Update Color field square change
  const squareRef = React.useRef<HTMLDivElement>(null);

  const updateColorDot = React.useCallback(
    (x: number, y: number, selectionChanged: boolean) => {
      setSquareTop(y);
      setSquareLeft(x);
      const newColor = ColorValue.fromHSV({
        h: squareColor.hsv.h,
        s: x,
        v: 100 - y,
      });

      const color = fillColor(newColor);
      setDotColor(color);
      if (selectionChanged) {
        onChangeCompleted?.(newColor);
      }
    },
    [onChangeCompleted, squareColor.hsv.h],
  );

  const updateSquareValue = React.useCallback(
    (
      event: PointerEvent | React.PointerEvent,
      callbackType: 'onChange' | 'onUpdate' | 'onClick',
    ) => {
      if (
        (squareRef.current && activeDotIndex == 1) ||
        (squareRef.current && callbackType == 'onClick')
      ) {
        const percentX = getHorizontalPercentageOfRectangle(
          squareRef.current.getBoundingClientRect(),
          event.clientX,
        );
        const percentY = getVerticalPercentageOfRectangle(
          squareRef.current.getBoundingClientRect(),
          event.clientY,
        );

        if (callbackType == 'onChange' || callbackType == 'onClick') {
          updateColorDot(percentX, percentY, true);
        } else if (callbackType == 'onUpdate') {
          updateColorDot(percentX, percentY, false);
        }
      }
    },
    [activeDotIndex, updateColorDot],
  );
  const handleSquarePointerUp = React.useCallback(
    (event: PointerEvent) => {
      updateSquareValue(event, 'onChange');
      setActiveDotIndex(undefined);
      event.preventDefault();
      event.stopPropagation();
    },
    [updateSquareValue],
  );
  useEventListener(
    'pointerup',
    handleSquarePointerUp,
    ref.current?.ownerDocument,
  );

  const handleSquarePointerMove = React.useCallback(
    (event: PointerEvent): void => {
      event.preventDefault();
      event.stopPropagation();
      updateSquareValue(event, 'onUpdate');
    },
    [updateSquareValue],
  );
  useEventListener(
    'pointermove',
    handleSquarePointerMove,
    ref.current?.ownerDocument,
  );

  const handlePointerDownOnSquare = React.useCallback(
    (event: React.PointerEvent) => {
      updateSquareValue(event, 'onClick');
      setActiveDotIndex(1);
    },
    [updateSquareValue],
  );

  // Arrow key navigation for color dot
  const handleColorDotKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    let x = squareLeft;
    let y = squareTop;
    switch (event.key) {
      case 'ArrowDown': {
        y = Math.min(y + 1, 100);
        updateColorDot(x, y, false);
        break;
      }
      case 'ArrowUp': {
        y = Math.max(y - 1, 0);
        updateColorDot(x, y, false);
        break;
      }
      case 'ArrowLeft':
        x = Math.max(x - 1, 0);
        updateColorDot(x, y, false);
        break;
      case 'ArrowRight':
        x = Math.min(x + 1, 100);
        updateColorDot(x, y, false);
        break;
      case 'Enter':
      case ' ':
      case 'Spacebar':
        updateColorDot(x, y, true);
        break;
    }
  };

  // Handle swapping color input type
  const onSwapColorType = React.useCallback(() => {
    if (inputType == 'HEX') {
      setInputType('HSL');
    } else if (inputType == 'HSL') {
      setInputType('RGB');
    } else if (inputType == 'RGB') {
      setInputType('HEX');
    }
  }, [inputType]);

  return (
    <div
      className={cx('iui-color-picker', className)}
      style={colorSquareStyle}
      {...rest}
    >
      {builderProps && (
        <div className='iui-color-selection-wrapper'>
          <div
            className='iui-color-field'
            ref={squareRef}
            onPointerDown={handlePointerDownOnSquare}
          >
            <div
              className='iui-color-dot'
              style={colorDotStyle}
              onPointerDown={() => {
                setActiveDotIndex(1);
              }}
              onKeyDown={handleColorDotKeyDown}
              tabIndex={0}
            />
          </div>

          <Slider
            minLabel=''
            maxLabel=''
            values={[sliderValue]}
            className='iui-hue-slider'
            trackDisplayMode='none'
            tooltipProps={() => {
              return { visible: false };
            }}
            onChange={onChangeColorCompleted}
            onUpdate={onChangeColor}
          />
        </div>
      )}
      {builderProps && inputType != 'NONE' && (
        <div>
          <div className='iui-color-picker-section-label'>{inputType}</div>
          <div className='iui-color-input'>
            <IconButton styleType={'borderless'} onClick={onSwapColorType}>
              <svg viewBox='0 0 16 16' className='iui-icon' aria-hidden='true'>
                <path d='m5 15-3.78125-3.5 3.78125-3.5v2h8v3h-8zm6-7 3.78125-3.5-3.78125-3.5v2h-8v3h8z' />
              </svg>
            </IconButton>
            {inputType === 'HEX' && (
              <div className='iui-color-input-fields'>
                <Input
                  type={'small'}
                  placeholder={'HEX'}
                  value={dotColor.hex.hex}
                />
              </div>
            )}
            {inputType === 'HSL' && (
              <div className='iui-color-input-fields'>
                <Input
                  type={'small'}
                  placeholder={'H'}
                  value={dotColor.hsl.h}
                />
                <Input
                  type={'small'}
                  placeholder={'S'}
                  value={dotColor.hsl.s}
                />
                <Input
                  type={'small'}
                  placeholder={'L'}
                  value={dotColor.hsl.l}
                />
              </div>
            )}
            {inputType == 'RGB' && (
              <div className='iui-color-input-fields'>
                <Input
                  type={'small'}
                  placeholder={'R'}
                  value={dotColor.rgb.r}
                />
                <Input
                  type={'small'}
                  placeholder={'G'}
                  value={dotColor.rgb.g}
                />
                <Input
                  type={'small'}
                  placeholder={'B'}
                  value={dotColor.rgb.b}
                />
              </div>
            )}
          </div>
        </div>
      )}
      {paletteProps && (
        <div>
          {paletteProps.colorPaletteTitle && (
            <div className='iui-color-picker-section-label'>
              {paletteProps.colorPaletteTitle}
            </div>
          )}
          <div
            className='iui-color-palette'
            onKeyDown={handleKeyDown}
            ref={ref}
          >
            {paletteProps.colors?.map((color, index) => {
              return (
                <ColorSwatch
                  key={index}
                  color={color}
                  onClick={() => {
                    if (typeof color === 'string') {
                      onChangeCompleted?.(ColorValue.fromString(color));
                      // } else if (color.type === HSVColor) {
                      //   onChangeCompleted(ColorValue.fromHSL(color));
                      setActiveColor(ColorValue.fromString(color));
                    }
                  }}
                  isActive={
                    typeof color === 'string'
                      ? ColorValue.fromString(color).toHslString() ===
                        activeColor?.toHslString()
                      : false
                  }
                />
              );
            })}
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
