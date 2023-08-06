import { global as globalThis } from '@storybook/global';
import type { PartialStoryFn, StoryContext } from '@storybook/types';

export default {
  component: globalThis.Components.Pre,
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) =>
      storyFn({ args: { object: { ...context.args } } }),
  ],
  tags: ['autodocs'],
  argTypes: {
    outputObject: {
      control: {
        type: 'composite',
        subControls: {
          foo: { control: { type: 'number' } },
          bar: { control: { type: 'text' } },
        },
        compose: ({ foo, bar }: { foo: number; bar: string }) => {
          return { a: foo, b: bar };
        },
        parseDefault: (val: { a: number; b: string }) => {
          return { foo: val.a, bar: val.b };
        },
      },
    },
    outputNumber: {
      control: {
        type: 'composite',
        subControls: {
          x: { control: { type: 'number' } },
          y: { control: { type: 'number' } },
          z: { control: { type: 'number' } },
        },
        compose: ({ x, y, z }: { x: number; y: number; z: number }) => {
          return x * y * z;
        },
        parseDefault: (val: number) => {
          return { x: val / 2, y: 2, z: 1 };
        },
      },
    },
    outputString: {
      control: {
        type: 'composite',
        subControls: {
          name: { control: { type: 'text' } },
          age: { control: { type: 'number' } },
        },
        compose: ({ name, age }: { name: string; age: number }) => {
          return `Name: ${name}, Age: ${age}`;
        },
        parseDefault: (val: string) => {
          const [, name, ageString] = val.match(/^Name: (.*?), Age: (.*?)$/);
          return { name, age: parseInt(ageString, 10) };
        },
      },
    },
    withSelect: {
      control: {
        type: 'composite',
        subControls: {
          symbol: { control: { type: 'select' }, options: ['$', '£', '€'] },
          amount: { control: { type: 'number' } },
        },
        compose: ({ symbol, amount }: { symbol: string; amount: number }) => {
          return `${symbol}${amount}`;
        },
        parseDefault: (val: string) => {
          return { symbol: val.charAt(0), amount: parseInt(val.slice(1), 10) };
        },
      },
    },
  },
};

export const Undefined = {
  args: {},
};

export const Defined = {
  args: {
    outputObject: { a: 1, b: 'b' },
    outputNumber: 6,
    outputString: 'Name: Alice, Age: 10',
    withSelect: '$600',
  },
};
