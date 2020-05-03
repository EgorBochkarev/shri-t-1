import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {loadInitialPageData, startBuild} from '../../actions';

import Card from '../card';
import Button from '../button';
import Header from '../header';
import CodePresentor from '../code-presenter/code-presenter';
import Content from '../content';

function Details({build, log, onMount, headerButtonType = 'disabled', rebuild}) {
  useEffect(() => {
    onMount();
  }, []);
  return (
    <>
      <Header>
        <Button size="s" icon="rebuild" type={headerButtonType} onClick={() => {
          rebuild(build.commitHash);
        }} adaptive>Rebuild</Button>
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
const mapStateToProps = ({build, buildLogs}) => {
  return {
    build,
    log: buildLogs,
    headerButtonType: !!build
  };
};

export default connect(mapStateToProps, {
  onMount: loadInitialPageData,
  rebuild: startBuild
})(Details);
