import React, {useEffect, useState, useCallback} from 'react';
import {connect} from 'react-redux';

import {loadInitialPageData, loadMoreBuilds, startBuild} from '../../actions';
import Card from '../card';
import List from '../list';
import {Link} from 'react-router-dom';
import Content from '../content';
import Header from '../header';
import Button from '../button';
import PopUp from '../pop-up';
import Form from '../form/form';
import { Store } from '../../reducer';
import { Build } from '../../../../server/src/services/rest/build-dto';

const renderItem = (build:Build) => {
  return (
    <Link key={build.id} to={`/build/${build.id}`}>
      <Card data={build} clickable></Card>
    </Link>
  );
}

export interface HistoryPageProps {
  builds?: Build[]
  title: string
  onChange?(value:string, name:string):void
  onMount():void
  showMore():void
  startBuild(hash:string):void
}

type StartBuildData = {
  hash: string
}

const History:React.FC<HistoryPageProps> = ({builds = [], title, onMount, showMore, startBuild}) => {
  useEffect(() => {
    onMount();
  }, []);
  const [showPopUp, setShowPopUp] = useState(false);
  const showRunBuildWindow = useCallback(
      () => setShowPopUp(true),
      [setShowPopUp]
  );
  return (
    <>
      <Header title={title}>
        <Button size="s" icon="play" adaptive onClick={showRunBuildWindow}>
          Run build
        </Button>
        <Link to="/settings">
          <Button size="s" icon="settings"></Button>
        </Link>
      </Header>
      <div className="page__scrolled-container">
        <Content type="main" loading={!builds}>
          <List
            data={builds}
            renderItem={renderItem}
            showMore={showMore}
          />
        </Content>
      </div>
      <PopUp show={showPopUp} title="New build">
        <Form type="small"
          metaData={
            [{
              label: 'Enter the commit hash whitch you want to build',
              name: 'hash',
              placeholder: 'Commit hash',
              cleanable: true
            }]
          }
          data={{} as StartBuildData}
          onSubmit={({hash}) => startBuild(hash)}
          onCancel={() => setShowPopUp(false)}
        />
      </PopUp>
    </>
  );
}

const mapStateToProps = ({builds, settings}:Store) => {
  return {
    builds,
    title: settings && settings.repoName || ''
  };
};

export default connect(mapStateToProps, {
  onMount: loadInitialPageData,
  showMore: loadMoreBuilds,
  startBuild: startBuild
})(History);

