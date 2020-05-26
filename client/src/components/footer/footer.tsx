import React, {useCallback} from 'react';
import { useTranslation } from 'react-i18next';
import {connect} from 'react-redux';
import {changeLanguage, ThunkResult} from '../../actions';
import './footer.scss';
import { i18n } from 'i18next';

export interface FooterProps {
  onChangeLanguage(i18n:i18n):void
}


const Footer:React.FC<FooterProps> = ({onChangeLanguage}) => {
  const { t, i18n } = useTranslation();
  const changeLanguage = useCallback(() => {
    onChangeLanguage(i18n);
  }, [i18n])
  return (
    <footer className="footer">
      <div className="content content_align_horisontal">
        <div className="footer__info">
          <a className="text text_size_xs text_view_link">{t('Support')}</a>
          <a className="text text_size_xs text_view_link">{t('Learning')}</a>
  <a className="text text_size_xs text_view_link" onClick={() => {changeLanguage()}}>{t('Русская версия')}</a>
        </div>
        <span className="text text_size_xs text_view_ghost">{t('© 2020 Your Name')}</span>
      </div>
    </footer>
  );
}

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, {
  onChangeLanguage: changeLanguage,
})(Footer);
