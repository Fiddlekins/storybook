import { global as globalThis } from '@storybook/global';
import type { PartialStoryFn, StoryContext } from '@storybook/types';

export default {
  component: globalThis.Components.Pre,
  decorators: [
    (storyFn: PartialStoryFn, context: StoryContext) =>
      storyFn({ args: { object: { ...context.args } } }),
  ],
  argTypes: {
    comped: {
      control: {
        type: 'composite',
        subControls: {
          foo: { control: 'number' },
          bar: { control: 'number' },
        },
        compose: ({ foo, bar }) => {
          console.error('compose');
          return foo * bar;
        },
        parseDefault: (val) => {
          console.error('parseDefault');
          return { foo: val, bar: val };
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
    comped: 6,
  },
};
