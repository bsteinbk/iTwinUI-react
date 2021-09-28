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
} from '../../src/core';
import { action } from '@storybook/addon-actions';

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

  const [activeIndex, setCurrentActiveIndex] = React.useState<number>();

  const onColorClick = (index: number) => {
    action(`Clicked ${ColorsList[index].name}`)();
    setCurrentActiveIndex(index);
  };

  return (
    <>
      <IconButton onClick={() => setOpened(!opened)}>
        <span
          style={{
            backgroundColor: activeIndex
              ? ColorsList[activeIndex].color
              : '#FFF',
            border: '1px solid',
          }}
        />
      </IconButton>
      <span style={{ marginLeft: 16 }}>
        {activeIndex ? ColorsList[activeIndex].name : 'No color selected.'}
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
