import React, {useState, useEffect, PropsWithChildren, useCallback} from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../button';
import Field from '../field';
import './form.scss';
import { FieldProps } from '../field/field';

export interface FormMetaData extends FieldProps {
  fieldClass?:string
}

export interface FormProps<T> {
  className?:string
  title?:string
  description?:string
  type?:"small",
  metaData:FormMetaData[]
  data?:T
  onSubmit(data:T):void
  onCancel():void
}

const Form = <T extends object,>({
  className, title, description, type,
  metaData, data = {} as T, onSubmit, onCancel
}:PropsWithChildren<FormProps<T>>) => {
  const classes = [
    'form',
    type ? `form_type_${type}` : '',
    className || ''
  ];

  const [formData, setFormData] = useState(data);
  const { t, i18n } = useTranslation();

  useEffect(()=> {
    if (data && JSON.stringify(data) !== JSON.stringify(formData)) {
      setFormData(data);
    }
  }, [data]);
  const submit = useCallback(() => {
    if (formData) {
      onSubmit && onSubmit(formData);
    }
  }, [onSubmit, formData]);
  const onChange = useCallback((value, name) => {
    setFormData({
      ...formData,
      [name]: value
    });
  }, [formData])
  return (
    <form className={classes.join(' ')} onSubmit={(e) => e.preventDefault()}>
      {(title || description) ? <div className="form__title">
        <p className="text text_size_s text_weight_bold">{title}</p>
        <p className="text text_size_xs text_view_ghost">{description}</p>
      </div> : null }
      {metaData.map(({fieldClass, ...fieldMetaData}) => {
        const name = fieldMetaData.name;
        let value:string = '';
        for (var prop in formData) {
          if (prop === name) {
            value = String(formData[prop]);
          }
        }
        return <Field
          key={fieldMetaData.name}
          className={`form__field ${fieldClass || ''}`}
          {...fieldMetaData}
          value={value}
          onChange={onChange}
        />;
      })}
      <div className="form__tools">
        <Button size="m" type="action" onClick={submit}>{t('Save')}</Button>
        <Button size="m" onClick={onCancel}>{t('Cancel')}</Button>
      </div>
    </form>
  );
}

export default Form;
