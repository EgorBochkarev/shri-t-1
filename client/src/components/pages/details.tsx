import React, {useEffect, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {loadInitialPageData, startBuild} from '../../actions';

import Card from '../card';
import Button from '../button';
import Header from '../header';
import CodePresentor from '../code-presenter/code-presenter';
import Content from '../content';
import { Store } from '../../reducer';
import { Build } from '../../../../server/src/services/rest/build-dto';
import { ButtonTypes } from '../button/button';
import { useTranslation } from 'react-i18next';

export interface DetailsPageProps {
  onMount():void;
  build?:Build;
  log?:string;
  headerButtonType:ButtonTypes;
  rebuild(commitHash:string):void;
  title:string
}

const Details:React.FC<DetailsPageProps> = ({build, log, onMount, headerButtonType = 'disabled', rebuild, title}) => {
  useEffect(() => {
    onMount();
  }, []);
  const { t, i18n } = useTranslation();
  const onRebuild = useCallback(() => {
    build && rebuild(build.commitHash);
  }, [rebuild, build])
  if (!build) {
    return <div></div>
  }
  return (
    <>
      <Header title={title}>
        <Button size="s" icon="rebuild" type={headerButtonType} onClick={onRebuild} adaptive>{t("Rebuild")}</Button>
        <Link to="/settings">
          <Button size="s" icon="settings"></Button>
        </Link>
      </Header>
      <div className="page__scrolled-container">
        <Content loading={!build}>
          <Card view="detail" data={build}></Card>
        </Content>
        <Content type="main" loading={log == ''} fullAdaptive>
          <CodePresentor>{log}</CodePresentor>
        </Content>
      </div>
    </>
  );
}
const mapStateToProps = ({build, buildLogs, settings}:Store) => {
  return {
    build,
    log: buildLogs,
    headerButtonType: build ? 'disabled' : 'action' as ButtonTypes,
    title: settings && settings.repoName || ''
  };
};

export default connect(mapStateToProps, {
  onMount: loadInitialPageData,
  rebuild: startBuild
})(Details);
