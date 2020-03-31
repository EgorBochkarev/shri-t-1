import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import Button from '../button';
import Field from '../field';
import './form.scss';

function Form({className, title, description, metaData, data = {}, onSubmit}) {
  const classes = [
    'form',
    className || ''
  ];

  const [formData, setFormData] = useState(data);
  useEffect(()=> {
    setFormData(data);
  }, [data]);
  return (
    <form className={classes.join(' ')} onSubmit={(e) => e.preventDefault()}>
      <div className="form__title">
        <p className="text text_size_s text_weight_bold">{title}</p>
        <p className="text text_size_xs text_view_ghost">{description}</p>
      </div>
      {metaData.map(({fieldClass, ...fieldMetaData}) => {
        return <Field
          key={fieldMetaData.name}
          className={`form__field ${fieldClass}`}
          {...fieldMetaData}
          value={formData[fieldMetaData.name]}
          onChange={(value, name) => {
            setFormData({
              ...formData,
              [name]: value
            });
          }}/>;
      })}
      <div className="form__tools">
        <Button size="m" type="action" onClick={() => onSubmit(formData)}>Save</Button>
        <Link to="/">
          <Button size="m">Cancel</Button>
        </Link>
      </div>
    </form>
  );
}

export default Form;
