import React, {useCallback} from 'react';
import Icon from '../icon';
import cn from '../../utils/class-name';
import './field.scss';

export interface FieldProps {
  className?:string
  name:string
  label?:string
  horizontal?:boolean,
  unit?:string,
  cleanable?:boolean
  required?:boolean
  placeholder?:string
  value?:string
  pattern?:RegExp
  type?:string,
  onChange?(value:string, name:string):void
}

const Field:React.FC<FieldProps> = (props) => {
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
    pattern,
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
  const onClickFn = useCallback((value) => {
    switch (type) {
      case 'number':
        value = Number.parseFloat(value);
        break;
      default:
        value = value;
    }
    onChange && onChange(value, name);
  },[onChange]);
  const inputRef = React.createRef<HTMLInputElement>();
  const onClear = useCallback(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.value = ''
    }
    onClickFn('');
  },[onChange]);
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
          pattern={
            pattern ?
            pattern.toString().substring(1, pattern.toString().length - 1) :
            undefined
          }
          {...value ? {value} : {}}
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
            onClick={onClear}
          />
        }
        { unit ? <span className="field__unit">{unit}</span> : null }
      </label>
    </div>
  );
}
export default React.memo(Field);
