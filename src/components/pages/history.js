import React, {useEffect} from 'react';
import {connect} from 'react-redux';

import {loadInitialPageData, loadMoreBuilds, saveSettings} from '../../actions';
import Card from '../card';
import List from '../list';
import {Link} from 'react-router-dom';
import Content from '../content';
import Header from '../header';
import Button from '../button';

function renderItem(build) {
  return (
    <Link key={build.id} to={`/build/${build.id}`}>
      <Card data={build} clickable></Card>
    </Link>
  );
}

function History({builds = [], title, onMount, showMore, test}) {
  useEffect(() => {
    onMount();
  }, []);
  return (
    <>
      <Header title={title}>
        {/* <Link to="/build"> */}
        <Button size="s" icon="play" adaptive onClick={() => {
          test({
            'repoName': 'EgorBochkarev/tire-fitting',
            'buildCommand': 'echo "finish test"',
            'mainBranch': 'master',
            'period': 5
          });
        }}>Run build</Button>
        {/* </Link> */}
        <Link to="/settings">
          <Button size="s" icon="settings"></Button>
        </Link>
      </Header>
      <div className="page__scrolled-container">
        <Content type="main" loading={!builds}>
          <List data={builds} renderItem={renderItem} showMore={showMore}></List>
        </Content>
      </div>
    </>
  );
}

const mapStateToProps = ({builds, settings}) => {
  return {
    builds,
    title: settings && settings.repoName || ''
  };
};

export default connect(mapStateToProps, {
  onMount: loadInitialPageData,
  showMore: loadMoreBuilds,
  test: saveSettings
})(History);

