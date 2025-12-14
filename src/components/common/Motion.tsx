'use client';

import { type MotionProps, motion } from 'framer-motion';
import type { HTMLProps } from 'react';

interface Props {
  delay?: number;
  duration?: number;
  type?: 'spring';
  stiffness?: number;
}

const onceInView = true;

const getInitialMotionProps = (
  delay = 0,
  duration = 0.2,
  type: 'spring' | undefined = undefined,
  stiffness = 100,
) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: onceInView },
  transition: {
    delay,
    duration,
    type,
    stiffness,
  },
});

export const Motion = {
  h1: ({
    delay = 0,
    duration = 0.2,
    stiffness = 100,
    type,
    ...props
  }: HTMLProps<HTMLHeadingElement> & MotionProps & Props) => {
    return (
      <motion.h1 {...{ ...getInitialMotionProps(delay, duration, type, stiffness), ...props }} />
    );
  },
  h2: ({
    delay = 0,
    duration = 0.2,
    stiffness = 100,
    type,
    ...props
  }: HTMLProps<HTMLHeadingElement> & MotionProps & Props) => {
    return (
      <motion.h2 {...{ ...getInitialMotionProps(delay, duration, type, stiffness), ...props }} />
    );
  },
  h3: ({
    delay = 0,
    duration = 0.2,
    stiffness = 100,
    type,
    ...props
  }: HTMLProps<HTMLHeadingElement> & MotionProps & Props) => {
    return (
      <motion.h3 {...{ ...getInitialMotionProps(delay, duration, type, stiffness), ...props }} />
    );
  },
  div: ({
    delay = 0,
    duration = 0.2,
    stiffness = 100,
    type,
    ...props
  }: HTMLProps<HTMLDivElement> & MotionProps & Props) => {
    return (
      <motion.div {...{ ...getInitialMotionProps(delay, duration, type, stiffness), ...props }} />
    );
  },
  p: ({
    delay = 0,
    duration = 0.2,
    stiffness = 100,
    type,
    ...props
  }: HTMLProps<HTMLParagraphElement> & MotionProps & Props) => {
    return (
      <motion.p {...{ ...getInitialMotionProps(delay, duration, type, stiffness), ...props }} />
    );
  },
  a: ({
    delay = 0,
    duration = 0.2,
    stiffness = 100,
    type,
    ...props
  }: HTMLProps<HTMLAnchorElement> & MotionProps & Props) => {
    return (
      <motion.a {...{ ...getInitialMotionProps(delay, duration, type, stiffness), ...props }} />
    );
  },
  button: ({
    delay = 0,
    duration = 0.2,
    stiffness = 100,
    type,
    ...props
  }: HTMLProps<HTMLButtonElement> & MotionProps & Props) => {
    return (
      <motion.button
        {...{ ...getInitialMotionProps(delay, duration, type, stiffness), ...props }}
      />
    );
  },
  img: ({
    delay = 0,
    duration = 0.2,
    stiffness = 100,
    type,
    ...props
  }: HTMLProps<HTMLImageElement> & MotionProps & Props) => {
    return (
      <motion.img {...{ ...getInitialMotionProps(delay, duration, type, stiffness), ...props }} />
    );
  },
  li: ({
    delay = 0,
    duration = 0.2,
    stiffness = 100,
    type,
    ...props
  }: HTMLProps<HTMLLIElement> & MotionProps & Props) => {
    return (
      <motion.li {...{ ...getInitialMotionProps(delay, duration, type, stiffness), ...props }} />
    );
  },
  span: ({
    delay = 0,
    duration = 0.2,
    stiffness = 100,
    type,
    ...props
  }: HTMLProps<HTMLSpanElement> & MotionProps & Props) => {
    return (
      <motion.span {...{ ...getInitialMotionProps(delay, duration, type, stiffness), ...props }} />
    );
  },
};
