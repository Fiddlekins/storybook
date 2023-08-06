import { styled } from '@storybook/theming';
import type { FC } from 'react';
import React, { useCallback, useState } from 'react';
import { BooleanControl } from './Boolean';
import { ColorControl } from './Color';
import { DateControl } from './Date';
import { FilesControl } from './Files';
import { NumberControl } from './Number';
import { OptionsControl } from './options';
import { RangeControl } from './Range';
import { TextControl } from './Text';
import type { CompositeConfig, CompositeValue, ControlProps, OrderedSubControls } from './types';

const SubControlsContainer = styled.div(() => ({
  '&&': {
    display: 'grid',
    gridTemplateColumns: '[label] 1fr [subcontrol] 4fr',
    gridTemplateRows: 'auto',
    gap: 10,
    alignItems: 'center',
  },
}));

const LabelDiv = styled.div(() => ({
  '&&': {
    gridColumn: 'label',
  },
}));

const SubControlDiv = styled.div(() => ({
  '&&': {
    gridColumn: 'subcontrol',
  },
}));

type CompositeProps = ControlProps<CompositeValue | null> & CompositeConfig;

function getOrderedSubControls(subControls: CompositeProps['subControls']): OrderedSubControls {
  if (Array.isArray(subControls)) {
    return subControls;
  }
  return Object.keys(subControls).map((name) => {
    return { name, argType: subControls[name] };
  });
}

function getInputValue(
  value: CompositeProps['value'],
  parseDefault: CompositeProps['parseDefault']
): Record<string, any> {
  let newInputValue;
  try {
    newInputValue = parseDefault(value);
  } catch (err) {
    newInputValue = {};
  }
  return newInputValue;
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
  value,
  onChange,
  subControls,
  compose,
  parseDefault,
  onBlur,
  onFocus,
}) => {
  const [inputValue, setInputValue] = useState<Record<string, any>>(
    getInputValue(value, parseDefault)
  );

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
      } catch (err) {
        // do nothing
      }
    },
    [inputValue, setInputValue, compose, onChange]
  );

  return (
    <SubControlsContainer>
      {orderedSubControls.map(({ name: subControlName, argType }, index) => {
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
        return (
          <React.Fragment key={subControlName}>
            <LabelDiv>{subControlName}</LabelDiv>
            <SubControlDiv>
              <Control {...props} {...argType.control} />
            </SubControlDiv>
          </React.Fragment>
        );
      })}
    </SubControlsContainer>
  );
};
