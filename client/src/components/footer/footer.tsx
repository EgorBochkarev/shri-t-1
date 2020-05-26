import React from 'react';
import { useTranslation } from 'react-i18next';
import './footer.scss';

export interface FooterProps {

}


const Footer:React.FC<FooterProps> = () => {
  const { t, i18n } = useTranslation();
  return (
    <footer className="footer">
      <div className="content content_align_horisontal">
        <div className="footer__info">
          <a className="text text_size_xs text_view_link">{t('Support')}</a>
          <a className="text text_size_xs text_view_link">{t('Learning')}</a>
          <a className="text text_size_xs text_view_link">{t('Русская версия')}</a>
        </div>
        <span className="text text_size_xs text_view_ghost">{t('© 2020 Your Name')}</span>
      </div>
    </footer>
  );
}
export default Footer;
