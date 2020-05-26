import React, {useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import {connect} from 'react-redux';

import {
  loadInitialPageData, startBuild,
  saveSettings, redirect
} from '../../actions';

import Form from '../form/form';
import Header from '../header';
import { Configuration } from '../../../../server/src/services/rest/conf-dto';
import { Store } from '../../reducer';

export interface SettingsPageProps {
  settings?: Configuration
  onMount():void
  onSubmit(settings:Configuration):void
  onCancel():void

}

const Settings:React.FC<SettingsPageProps> = ({settings, onMount, onSubmit, onCancel}) => {
  const {t} = useTranslation();
  useEffect(() => {
    onMount();
  }, []);
  const [numberLabel, numberUnit] = t("Synchronize every {x} minutes").split(' {x} ');
  return (
    <>
      <Header title={t('School CI server')}></Header>
      <div className="page__scrolled-container">
        <div className="content content_type_main">
          <Form title={t('Settings')} description={t("Configure repository connection and synchronization settings")} metaData={[
            {
              name: 'repoName',
              label: t('GitHub repository'),
              placeholder: t('user-name/repo-name'),
              pattern: /^[\w-]+\/[\w-]+$/,
              required: true,
              cleanable: true
            },
            {
              name: 'buildCommand',
              label: t('Build command'),
              placeholder: t('bash command'),
              required: true,
              cleanable: true
            },
            {
              name: 'mainBranch',
              label: t('Main branch'),
              placeholder: t('branch name'),
              cleanable: true
            },
            {
              name: 'period',
              label: numberLabel,
              unit: numberUnit,
              type: 'number',
              horizontal: true,
              fieldClass: 'form__field_small'
            }
          ]} data={settings} onSubmit={onSubmit} onCancel={onCancel}>
          </Form>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = ({settings}:Store) => {
  return {
    settings
  };
};

export default connect(mapStateToProps, {
  onMount: loadInitialPageData,
  save: startBuild,
  onSubmit: saveSettings,
  onCancel: () => redirect('/')
})(Settings);

