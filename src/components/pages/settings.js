import React, {useEffect} from 'react';
import {connect} from 'react-redux';

import {loadInitialPageData, startBuild, saveSettings} from '../../actions';

import Form from '../form/form';
import Header from '../header';

function Settings({settings, onMount, onSubmit}) {
  useEffect(() => {
    onMount();
  }, []);
  return (
    <>
      <Header></Header>
      <div className="page__scrolled-container">
        <div className="content content_type_main">
          <Form title="Settings" description="Configure repository connection and synchronization settings" metaData={[
            {
              name: 'repoName',
              label: 'GitHub repository',
              placeholder: 'user-name/repo-name',
              required: true,
              cleanable: true
            },
            {
              name: 'buildCommand',
              label: 'Build command',
              placeholder: 'bash command',
              required: true,
              cleanable: true
            },
            {
              name: 'mainBranch',
              label: 'Main branch',
              placeholder: 'branch name',
              cleanable: true
            },
            {
              name: 'period',
              label: 'Synchronize every',
              unit: 'minutes',
              type: 'number',
              horizontal: true,
              fieldClass: 'form__field_small'
            }
          ]} data={settings} onSubmit={onSubmit}>
          </Form>
        </div>
      </div>
    </>
  );
}

const mapStateToProps = ({settings}) => {
  return {
    settings
  };
};

export default connect(mapStateToProps, {
  onMount: loadInitialPageData,
  save: startBuild,
  onSubmit: saveSettings
})(Settings);

