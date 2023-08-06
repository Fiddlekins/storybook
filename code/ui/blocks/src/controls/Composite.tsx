import {styled} from '@storybook/theming';
import type {FC} from 'react';
import React, {useCallback, useEffect, useState} from 'react';
import {NoControl, PrimitiveControls} from "../components/ArgsTable/ArgControl";
import {OrderedSubControls} from "./index";
import type {CompositeConfig, CompositeValue, ControlProps} from './types';

const Wrapper = styled.label({
  display: 'flex',
});

type CompositeProps = ControlProps<CompositeValue | null> & CompositeConfig;

function getOrderedSubControls(subControls: CompositeProps["subControls"]): OrderedSubControls {
  if (Array.isArray(subControls)) {
    return subControls;
  }
  return Object.keys(subControls).map((name) => {
    return {name, argType: subControls[name]};
  })
}

export const CompositeControl: FC<CompositeProps> = ({
  name,
  value,
  onChange,
  subControls,
  compose,
  parseDefault,
  onBlur,
  onFocus
}) => {
  const [inputValue, setInputValue] = useState<Record<string, any>>({});
  const [_parseError, setParseError] = useState<Error>(null);

  const orderedSubControls = getOrderedSubControls(subControls);

  const handleChange = useCallback(
    (updatedValue) => {
      const newInputValue = {
        ...inputValue,
        ...updatedValue
      };
      setInputValue(newInputValue);

      try {
        const result = compose(newInputValue);
        onChange(result);
        setParseError(null);
      } catch (err) {
        setParseError(new Error(`Failed to compose inputs: ${err.toString()}`));
      }
    },
    [onChange, setParseError]
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
  }, [value]);

  return (
    <Wrapper>
      {orderedSubControls.map(({name, argType}) => {
        const onSubChange = (newValue: any) => {
          handleChange({[name]: newValue});
        };
        const props = {name, argType, value: inputValue[name], onChange: onSubChange, onBlur, onFocus};
        const Control = PrimitiveControls[argType.control.type] || NoControl;
        return <Control {...props} {...argType.control} />;
      })}
    </Wrapper>
  );
};
