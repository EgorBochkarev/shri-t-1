import React, {useState, useEffect} from 'react';
import Icon from '../icon';
import './button.scss';


function Button({icon, text, size, type, className, adaptive, children, onClick, ...props}) {
  text = text || children;
  const [buttonType, setButtonType] = useState(type);
  useEffect(()=> {
    setButtonType(type);
  }, [type]);
  const classes = [
    'button',
    size ? `button_size_${size}` : '',
    buttonType ? `button_type_${buttonType}` : '',
    className || ''
  ];
  return (
    <button className={classes.join(' ')} disabled={type === 'disabled'} {...props} onClick={() => {
      if (onClick) {
        setButtonType('disabled');
        Promise.resolve(onClick()).then(() => {
          setButtonType(type);
        }).catch((e) => {
          setButtonType(type);
          console.error('Error on ckick', e);
        });
      }
    }}>
      { icon && <Icon icon={icon}></Icon> }
      { text && <span className={'text text_size_xxs button__text' + (adaptive ? ' button__text_adaptive' : '')}>{text}</span> }
    </button>
  );
}
export default Button;
