/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ColorSwatch } from './ColorSwatch';

it('should render in its most basic state', () => {
  const { container } = render(<ColorSwatch color='#9BA5AF' />);

  const swatch = container.querySelector('.iui-color-swatch');
  expect(swatch).toBeTruthy();
  expect(swatch).toHaveStyle({ backgroundColor: '#9BA5AF' });
});

it('should add className and style correctly', () => {
  const { container } = render(
    <ColorSwatch
      color='#9BA5AF'
      className='test-class'
      style={{ width: '100px' }}
    />,
  );

  const swatch = container.querySelector(
    '.iui-color-swatch.test-class',
  ) as HTMLElement;
  expect(swatch).toBeTruthy();
  expect(swatch.style.width).toBe('100px');
});

it('should render active color swatch', () => {
  const { container } = render(<ColorSwatch color='#9BA5AF' isActive={true} />);

  const swatch = container.querySelector('.iui-color-swatch');
  expect(swatch?.classList).toContain('iui-active');
});

it('should set --swatch-color', () => {
  window.CSS = { supports: () => true, escape: (i) => i };

  const { container } = render(<ColorSwatch color='#9BA5AF' />);
  const swatch = container.querySelector('.iui-color-swatch') as HTMLElement;
  expect(swatch).toBeTruthy();
  expect(swatch.style.getPropertyValue('--swatch-color')).toEqual('#9BA5AF');
});

it('should handle color swatch onClick', () => {
  const onColorClick = jest.fn();

  const { container } = render(
    <ColorSwatch color='#D4F4BD' onClick={onColorClick} />,
  );

  const swatch = container.querySelector('.iui-color-swatch') as HTMLElement;
  fireEvent.click(swatch);
  expect(onColorClick).toHaveBeenCalledTimes(1);
});