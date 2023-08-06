import { styled } from '@storybook/theming';
import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { BooleanControl } from './Boolean';
import { ColorControl } from './Color';
import { DateControl } from './Date';
import { FilesControl } from './Files';
import { NumberControl } from './Number';
import { OptionsControl } from './options';
import { RangeControl } from './Range';
import { TextControl } from './Text';
import type { CompositeConfig, CompositeValue, ControlProps, OrderedSubControls } from './types';

const Wrapper = styled.label({
  display: 'flex',
});

type CompositeProps = ControlProps<CompositeValue | null> & CompositeConfig;

function getOrderedSubControls(subControls: CompositeProps['subControls']): OrderedSubControls {
  if (Array.isArray(subControls)) {
    return subControls;
  }
  return Object.keys(subControls).map((name) => {
    return { name, argType: subControls[name] };
  });
}

const PrimitiveControls: Record<string, FC> = {
  boolean: BooleanControl,
  color: ColorControl,
  date: DateControl,
  number: NumberControl,
  check: OptionsControl,
  'inline-check': OptionsControl,
  radio: OptionsControl,
  'inline-radio': OptionsControl,
  select: OptionsControl,
  'multi-select': OptionsControl,
  range: RangeControl,
  text: TextControl,
  file: FilesControl,
};

const NoControl = () => <>-</>;

export const CompositeControl: FC<CompositeProps> = ({
  name,
  value,
  onChange,
  subControls,
  compose,
  parseDefault,
  onBlur,
  onFocus,
}) => {
  const [inputValue, setInputValue] = useState<Record<string, any>>({});
  // const [parseError, setParseError] = useState<Error>(null);

  const orderedSubControls = getOrderedSubControls(subControls);

  const handleChange = useCallback(
    (updatedValue) => {
      const newInputValue = {
        ...inputValue,
        ...updatedValue,
      };
      setInputValue(newInputValue);

      try {
        const result = compose(newInputValue);
        onChange(result);
        // setParseError(null);
      } catch (err) {
        // setParseError(new Error(`Failed to compose inputs: ${err.toString()}`));
      }
    },
    [inputValue, setInputValue, compose, onChange]
    // [onChange, setParseError]
  );

  useEffect(() => {
    let newInputValue;
    try {
      newInputValue = parseDefault(value);
    } catch (err) {
      newInputValue = {};
    }
    if (inputValue !== newInputValue) {
      setInputValue(value);
    }
  }, [value, parseDefault, setInputValue]);

  console.log(name, subControls);

  return (
    <Wrapper>
      {orderedSubControls.map(({ name: subControlName, argType }) => {
        const onSubChange = (newValue: any) => {
          handleChange({ [subControlName]: newValue });
        };
        const props = {
          name: subControlName,
          argType,
          value: inputValue[subControlName],
          onChange: onSubChange,
          onBlur,
          onFocus,
        };
        const Control = PrimitiveControls[argType.control.type] || NoControl;
        return <Control key={subControlName} {...props} {...argType.control} />;
      })}
    </Wrapper>
  );
};
