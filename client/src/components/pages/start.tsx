import React from 'react';
import {useTranslation} from 'react-i18next';
import Button from '../button';
import {Link} from 'react-router-dom';
import Header from '../header';
import Informer from '../informer';

const Start:React.FC<object> = () => {
  const {t} = useTranslation();
  return (
    <>
      <Header title={t('School CI server')}>
        <Link to="/settings">
          <Button size="s" icon="settings" adaptive>{t('Settings')}</Button>
        </Link>
      </Header>
      <div className="page__scrolled-container">
        <Informer
          icon="logo"
          text={t('Configure repository connection and synchronization settings')}
          className="content content_align_vertical content_justify_center"
        >
          <Link to="/settings">
            <Button size="m" type="action">{t("Open settings")}</Button>
          </Link>
        </Informer>
      </div>
    </>
  );
}

export default Start;

