/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Story, Meta } from '@storybook/react';
import React from 'react';
import { ColorPicker, ColorPickerProps } from '../../src/core';

export default {
  component: ColorPicker,
  argTypes: {
    className: { control: { disable: true } },
    style: { control: { disable: true } },
    children: { control: { disable: true } },
  },
  title: 'Core/ColorPicker',
} as Meta<ColorPickerProps>;

export const Basic: Story<ColorPickerProps> = (args) => {
  return <ColorPicker {...args} />;
};

Basic.args = {
  colors: [
    '#458816',
    '#CF0000',
    '#00121D',
    '#00426B',
    '#008BE1',
    '#D4F4BD',
    '#EEF6E8',
    '#9BA5AF',
    '#CF0000',
    '#FF6300',
    '#FFC335',
  ],
};
