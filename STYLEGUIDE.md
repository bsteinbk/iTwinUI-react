## Style guide

### Import only React and use members from there instead of separate imports
```jsx
// Good
import React from 'react';
```
```jsx
// Bad
import React, { useState } from 'react';
```
```jsx
// Bad
import * as React from 'react';
```

### Use type instead of interface
```jsx
// Good
export type AlertProps = {...};
```
```jsx
// Bad
export interface IAlertProps {...};
```

### Comment all props in multiline using jsdoc
```jsx
// Good
export type AlertProps = {
  /**
   * Type of the alert.
   * @default 'informational'
   */
  type?: 'positive' | 'warning' | 'negative' | 'informational';
  ...
```
```jsx

// Bad (single line)
export type AlertProps = {
  /** Type of the alert. */
  type?: 'positive' | 'warning' | 'negative' | 'informational';
  ...
```
```jsx
// Bad (no comment at all)
export type AlertProps = {
  type?: 'positive' | 'warning' | 'negative' | 'informational';
  ...
```

### Add description and example how to use the component
```jsx
// Good

/**
 * A small box to quickly grab user attention and communicate a brief message.
 * @example
 * <Alert>This is a basic alert.</Alert>
 */
export const Alert = (props: AlertProps) => {
  ...
```
```jsx
// Bad (no comments)

export const Alert = (props: AlertProps) => {
  ...
```
```jsx
// Bad (no example)

/**
 * A small box to quickly grab user attention and communicate a brief message.
 */
export const Alert = (props: AlertProps) => {
  ...
```

### Destruct props and set default values
```jsx
const {
    children,
    className,
    type = 'informational',
    clickableText,
    onClick,
    onClose,
    style,
    isSticky = false,
} = props;
```