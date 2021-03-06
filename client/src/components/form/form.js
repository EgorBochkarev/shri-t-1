import React, {useState, useEffect} from 'react';

import Button from '../button';
import Field from '../field';
import './form.scss';

function Form({
  className, title, description, type,
  metaData, data, onSubmit, onCancel
}) {
  const classes = [
    'form',
    type ? `form_type_${type}` : '',
    className || ''
  ];

  const [formData, setFormData] = useState(!data ? {} : data);
  useEffect(()=> {
    if (data && JSON.stringify(data) !== JSON.stringify(formData)) {
      setFormData(data);
    }
  }, [data]);
  const submit = () => {
    onSubmit && onSubmit(formData);
  };
  return (
    <form className={classes.join(' ')} onSubmit={(e) => e.preventDefault()}>
      {(title || description) ? <div className="form__title">
        <p className="text text_size_s text_weight_bold">{title}</p>
        <p className="text text_size_xs text_view_ghost">{description}</p>
      </div> : null }
      {metaData.map(({fieldClass, ...fieldMetaData}) => {
        return <Field
          key={fieldMetaData.name}
          className={`form__field ${fieldClass || ''}`}
          {...fieldMetaData}
          value={formData[fieldMetaData.name]}
          onChange={(value, name) => {
            setFormData({
              ...formData,
              [name]: value
            });
          }}
        />;
      })}
      <div className="form__tools">
        <Button size="m" type="action" onClick={submit}>Save</Button>
        <Button size="m" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

export default Form;
