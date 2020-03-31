import React from 'react';
import Icon from '../icon';
import './field.scss';

function Field(props) {
  const {
    className,
    name,
    label,
    horizontal,
    unit,
    cleanable,
    required,
    placeholder,
    value,
    type = 'text',
    onChange
  } = props;
  const classes = [
    'field',
    horizontal ? 'field_align_horisontal' : 'field_justify_stretch',
    className || ''
  ];
  const inputClass = `field__input field__input_type_${type}`;
  const onClickFn = (value) => {
    onChange && onChange(value, name);
  };
  const inputRef = React.createRef();
  return (
    <div className={classes.join(' ')}>
      <label className="field__label">{label}
        { required && <span className="field__require-sign">*</span> }
        <input
          ref={inputRef}
          name={name}
          className={inputClass}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => {
            onClickFn(e.target.value);
          }}
        />
        {
          cleanable &&
          <Icon
            icon="clear"
            size="l"
            className="field__clear-icon"
            onClick={() => {
              inputRef.current.value = '';
              onClickFn('');
            }}
          />
        }
        { unit && <span className="field__unit">{unit}</span> }
      </label>
    </div>
  );
}
export default Field;
