/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { useMemo, useCallback, useState } from '@storybook/addons';
import { Body, Slider } from '../../src/core';
import { SliderProps } from '../../src/core/Slider/Slider';
import SvgSmileyHappy from '@itwin/itwinui-icons-react/cjs/icons/SmileyHappy';
import SvgSmileySad from '@itwin/itwinui-icons-react/cjs/icons/SmileySad';

export default {
  title: 'Input/Slider',
  component: Slider,
} as Meta<SliderProps>;

export const Basic: Story<SliderProps> = (args) => {
  return <Slider {...args} />;
};

Basic.args = {
  disabled: false,
  values: [50],
  minLabel: <SvgSmileyHappy />,
  maxLabel: <SvgSmileySad />,
};

export const WithCustomThumb: Story<SliderProps> = (args) => {
  return <Slider {...args} />;
};

WithCustomThumb.args = {
  thumbProps: () => {
    return {
      className: 'thumb-test-class',
      style: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#999',
        width: '36px',
        height: '26px',
        borderRadius: '4px',
        transform: 'translateX(-19.2px)',
        top: 0,
      },
      children: (
        <span
          style={{
            pointerEvents: 'none',
            marginBottom: '4px',
            userSelect: 'none',
          }}
        >
          |||
        </span>
      ),
    };
  },
  disabled: false,
  values: [50],
  minLabel: <SvgSmileyHappy />,
  maxLabel: <SvgSmileySad />,
  tooltipProps: { style: { userSelect: 'none' } },
  railContainerProps: { style: { margin: '0 8px' } },
};

export const Range: Story<SliderProps> = (args) => {
  return <Slider {...args} />;
};

Range.args = {
  min: 0,
  max: 100,
  values: [20, 80],
};

export const MultiThumbs: Story<SliderProps> = (args) => {
  return <Slider {...args} />;
};

MultiThumbs.args = {
  values: [20, 40, 60, 80],
};

export const MultiThumbsAllowCrossing: Story<SliderProps> = (args) => {
  return <Slider {...args} />;
};

MultiThumbsAllowCrossing.args = {
  thumbProps: (index: number) => {
    const color = 0 == index % 2 ? 'blue' : 'red';
    return {
      className: 'thumb-test-class',
      style: { backgroundColor: color },
    };
  },

  values: [20, 40, 60, 80],
  trackDisplayMode: 'even-segments',
  thumbMode: 'allow-crossing',
};

export const Disabled: Story<SliderProps> = (args) => {
  return <Slider {...args} />;
};

Disabled.args = {
  min: 0,
  max: 60,
  values: [30],
  disabled: true,
};

export const TooltipRight: Story<SliderProps> = (args) => {
  return <Slider {...args} />;
};

TooltipRight.args = {
  min: 0,
  max: 60,
  values: [30],
  tooltipProps: { placement: 'right' },
};

export const CustomTooltipWithTicks: Story<SliderProps> = (args) => {
  return <Slider {...args} />;
};

CustomTooltipWithTicks.args = {
  min: 0,
  max: 60,
  values: [20],
  tickLabels: ['0', '20', '40', '60'],
  tooltipRenderer: (val) => {
    return `\$${val}.00`;
  },
};

export const CustomMinLabelNoTooltip: Story<SliderProps> = (args) => {
  const [minLabel, setMinLabel] = useState('20');
  const updateLabel = useCallback((values: ReadonlyArray<number>) => {
    setMinLabel(values[0].toString());
  }, []);
  return (
    <Slider
      {...args}
      minLabel={<Body style={{ width: '60px' }}>{minLabel}</Body>}
      maxLabel=''
      onUpdate={updateLabel}
      onChange={updateLabel}
    />
  );
};

CustomMinLabelNoTooltip.args = {
  className: 'test-class',
  style: { width: '60%' },
  min: 0,
  max: 60,
  values: [20],
  tickLabels: ['0', '20', '40', '60'],
  tooltipProps: { visible: false },
};

export const DateWithCustomTickArea: Story<SliderProps> = (args) => {
  const dateFormatter = useMemo(() => {
    return new Intl.DateTimeFormat('default', {
      month: 'short',
      day: '2-digit',
      timeZone: 'UTC',
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
  }, []);

  const [currentDate, setCurrentDate] = useState(
    new Date(Date.UTC(2019, 0, 1)),
  );

  const [dateLabel, setDateLabel] = useState(() =>
    dateFormatter.format(currentDate),
  );

  const updateDate = useCallback(
    (values: ReadonlyArray<number>) => {
      const newDate = new Date(Date.UTC(2019, 0, values[0]));
      setCurrentDate(newDate);
      setDateLabel(dateFormatter.format(newDate));
    },
    [dateFormatter],
  );

  const tooltipRenderer = useCallback(() => {
    return dateFormatter.format(currentDate);
  }, [currentDate, dateFormatter]);

  return (
    <Slider
      {...args}
      tooltipRenderer={tooltipRenderer}
      onUpdate={updateDate}
      onChange={updateDate}
      tickLabels={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <Body style={{ width: '60px', marginRight: '6px' }}>{dateLabel}</Body>
        </div>
      }
    />
  );
};

DateWithCustomTickArea.args = {
  style: { width: '50%' },
  min: 1,
  max: 365,
  values: [0],
  minLabel: 'Date',
  maxLabel: '',
};

export const SmallIncrement: Story<SliderProps> = (args) => {
  return <Slider {...args} />;
};

SmallIncrement.args = {
  disabled: false,
  min: 0,
  max: 5,
  step: 0.25,
  values: [0.25],
};

export const LargeIncrement: Story<SliderProps> = (args) => {
  return <Slider {...args} />;
};

LargeIncrement.args = {
  disabled: false,
  min: 0,
  max: 500,
  step: 25,
  values: [250],
};

export const DecimalIncrement: Story<SliderProps> = (args) => {
  return <Slider {...args} />;
};

DecimalIncrement.args = {
  disabled: false,
  min: 0,
  max: 50,
  step: 2.5,
  values: [25],
};
