import React from 'react';
import Icon from '../icon';
import cn from '../../utils/class-name';
import './field.scss';

function Field(props) {
  const {
    className,
    name,
    label,
    horizontal = false,
    unit,
    cleanable,
    required,
    placeholder,
    value,
    type = 'text',
    onChange
  } = props;
  const classes = [
    cn('field')({
      horizontal,
      type
    }),
    className || ''
  ];
  const onClickFn = (value) => {
    switch (type) {
      case 'number':
        value = Number.parseFloat(value);
        break;
      default:
        value = value;
    }
    onChange && onChange(value, name);
  };
  const inputRef = React.createRef();
  return (
    <div className={classes.join(' ')}>
      <label className="field__label">{label}
        { required ? <span className="field__require-sign">*</span> : null }
        <input
          ref={inputRef}
          name={name}
          className={cn('field')('input')}
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
        { unit ? <span className="field__unit">{unit}</span> : null }
      </label>
    </div>
  );
}
export default React.memo(Field);
