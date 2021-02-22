// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import cx from 'classnames';
import React from 'react';

import Button, { ButtonProps } from '../Button/Button';
import { useTheme } from '../../utils/hooks/useTheme';
import '@bentley/itwinui/css/buttons.css';

export type IconButtonProps = {
  /**
   * Button gets active style.
   * @default false
   */
  isActive?: boolean;
} & ButtonProps;

/**
 * Icon button
 * @example
 * <IconButton><SvgAdd /></IconButton>
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    const { isActive, children, className, ...rest } = props;

    useTheme();

    return (
      <Button
        ref={ref}
        className={cx(
          'iui-buttons-no-label',
          {
            'iui-buttons-active': isActive,
          },
          className,
        )}
        {...rest}
      >
        <svg className='iui-buttons-icon'>{children}</svg>
      </Button>
    );
  },
);

export default IconButton;