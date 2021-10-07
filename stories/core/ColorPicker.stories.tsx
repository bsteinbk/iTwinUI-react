/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Story, Meta } from '@storybook/react';
import React from 'react';
import {
  ColorPicker,
  ColorPickerProps,
  IconButton,
  Tooltip,
  ColorSwatch,
  Color,
  fillColor,
} from '../../src/core';
import { action } from '@storybook/addon-actions';
import SvgAddCircular from '@itwin/itwinui-icons-react/cjs/icons/AddCircular';

export default {
  component: ColorPicker,
  argTypes: {
    className: { control: { disable: true } },
    style: { control: { disable: true } },
    children: { control: { disable: true } },
  },
  title: 'Core/ColorPicker',
} as Meta<ColorPickerProps>;

const ColorsList = [
  { color: '#FFFFFF', name: 'WHITE' },
  { color: '#5A6973', name: 'GREY' },
  { color: '#00121D', name: 'KURETAKE BLACK MANGA' },
  { color: '#002A44', name: 'RHAPSODY IN BLUE' },
  { color: '#00426B', name: 'DARK IMPERIAL BLUE' },
  { color: '#005A92', name: 'JETSKI RACE' },
  { color: '#0073BA', name: 'FRENCH BLUE' },
  { color: '#008BE1', name: 'BLUE COLA' },
  { color: '#30B0FF', name: 'FANTASY CONSOLE SKY' },
  { color: '#58BFFF', name: 'HELLO SUMMER' },
  { color: '#7FCEFF', name: 'CHROMIS DAMSEL BLUE' },
  { color: '#A6DDFF', name: 'DROPLET' },
  { color: '#CDECFF', name: 'LUCID DREAMS' },
  { color: '#E5F5FD', name: 'KODAMA WHITE' },
  { color: '#010200', name: 'REGISTRATION BLACK' },
  { color: '#122306', name: 'YUZU SOY' },
  { color: '#23450b', name: 'FOREST GREEN' },
  { color: '#346711', name: 'TATZELWURM GREEN' },
  { color: '#458816', name: 'CHLOROPHYLL' },
  { color: '#56AA1C', name: 'PLASTIC PINES' },
  { color: '#5FBB1F', name: 'FIELD GREEN' },
  { color: '#67CC22', name: 'GREEN HIGH' },
  { color: '#91E458', name: 'LILLIPUTIAN LIME' },
  { color: '#B2EC8B', name: 'GREEN DAY' },
  { color: '#D4F4BD', name: 'TEA GREEN' },
  { color: '#EEF6E8', name: 'VERDE PASTEL' },
  { color: '#9BA5AF', name: 'SERYI GREY' },
  { color: '#CF0000', name: 'RED EPIPHYLLUM' },
  { color: '#FF6300', name: 'SAFETY ORANGE' },
  { color: '#FFC335', name: 'RISE-N-SHINE' },
];

export const Basic: Story<ColorPickerProps> = (args) => {
  const [activeIndex, setActiveIndex] = React.useState(5);

  const [opened, setOpened] = React.useState(false);

  const onClickColor = (index: number) => {
    action(`Clicked color ${ColorsList[index].color}`)();
    setActiveIndex(index);
  };

  return (
    <>
      <IconButton onClick={() => setOpened(!opened)}>
        <span
          style={{
            backgroundColor: ColorsList[activeIndex].color,
            border: '1px solid',
          }}
        />
      </IconButton>
      <span style={{ marginLeft: 16 }}>{ColorsList[activeIndex].name}</span>
      {opened && (
        <div style={{ marginTop: 4 }}>
          <ColorPicker {...args}>
            {ColorsList.map((color, index) => {
              return (
                <ColorSwatch
                  key={index + color.color}
                  color={color.color}
                  onClick={() => {
                    onClickColor(index);
                  }}
                  isActive={index === activeIndex}
                />
              );
            })}
          </ColorPicker>
        </div>
      )}
    </>
  );
};

Basic.args = {};

export const WithTooltip: Story<ColorPickerProps> = (args) => {
  const [opened, setOpened] = React.useState(false);

  const [activeIndex, setActiveIndex] = React.useState(-1);

  const onColorClick = (index: number) => {
    action(`Clicked ${ColorsList[index].name}`)();
    setActiveIndex(index);
  };

  return (
    <>
      <IconButton onClick={() => setOpened(!opened)}>
        <span
          style={{
            backgroundColor:
              activeIndex > -1 ? ColorsList[activeIndex].color : '#FFF',
            border: '1px solid',
          }}
        />
      </IconButton>
      <span style={{ marginLeft: 16 }}>
        {activeIndex > -1 ? ColorsList[activeIndex].name : 'No color selected.'}
      </span>
      {opened && (
        <div style={{ marginTop: 4 }}>
          <ColorPicker {...args}>
            {ColorsList.map((color, index) => {
              return (
                <>
                  <Tooltip content={color.name} placement={'bottom-end'}>
                    <ColorSwatch
                      key={index + color.color}
                      color={color.color}
                      onClick={() => {
                        onColorClick(index);
                      }}
                      isActive={index == activeIndex}
                    />
                  </Tooltip>
                </>
              );
            })}
          </ColorPicker>
        </div>
      )}
    </>
  );
};

WithTooltip.args = {};

export const Advanced: Story<ColorPickerProps> = (args) => {
  const [opened, setOpened] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [selectedColor, setSelectedColor] = React.useState<Color>(
    fillColor({
      hsl: { h: 0, s: 100, l: 50 },
    }),
  );
  const [savedColors] = React.useState<Array<Color>>([
    { hsl: { h: 0, s: 100, l: 50 } },
    { rgb: { r: 255, g: 98, b: 0 } },
    { hex: { hex: '#fec134' } },
    { hsv: { h: 95, s: 83, v: 72 } },
    { hsl: { h: 202, s: 100, l: 59 } },
  ]);

  const onColorClick = (index: number) => {
    const color = fillColor(savedColors[index]);
    action(`Clicked ${color.hsl.displayString}`)();
    setActiveIndex(index);
    setSelectedColor(color);
  };

  const onColorChanged = (color: Color) => {
    setActiveIndex(-1);
    setSelectedColor(color);
    action(`Selected ${color.hsl?.displayString}`)();
  };

  const onAdd = () => {
    const color =
      selectedColor?.hsl?.displayString ??
      fillColor(selectedColor).hsl.displayString;
    if (
      savedColors.findIndex(
        (swatch) => fillColor(swatch).hsl.displayString === color,
      ) > -1
    ) {
      action(`Cannot add duplicate color ${color}`)();
      return;
    }
    action(`Added color ${color}`)();
    setActiveIndex(savedColors.length);
    savedColors.push(selectedColor);
  };

  return (
    <>
      <IconButton onClick={() => setOpened(!opened)}>
        <span
          style={{
            backgroundColor: selectedColor.hsl?.displayString
              ? selectedColor.hsl.displayString
              : fillColor(selectedColor).hsl.displayString,
            border: '1px solid',
          }}
        />
      </IconButton>

      <span style={{ marginLeft: 16 }}>
        {selectedColor.hsl
          ? selectedColor.hsl.displayString
          : 'No color selected.'}
      </span>

      {opened && (
        <div style={{ marginTop: 4 }}>
          <ColorPicker
            selectedColor={selectedColor}
            onSelectionChanged={onColorChanged}
            {...args}
          >
            <button className='iui-button iui-borderless' onClick={onAdd}>
              <SvgAddCircular className='iui-icon' aria-hidden='true' />
            </button>

            {savedColors.map((color, index) => {
              const colorString =
                color.hsl?.displayString ?? fillColor(color).hsl.displayString;
              return (
                <>
                  <ColorSwatch
                    key={index + colorString}
                    color={colorString}
                    onClick={() => {
                      onColorClick(index);
                    }}
                    isActive={index == activeIndex}
                  />
                </>
              );
            })}
          </ColorPicker>
        </div>
      )}
    </>
  );
};

Advanced.args = { type: 'advanced' };
