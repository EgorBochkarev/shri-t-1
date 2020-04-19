import React, {useEffect, useState} from 'react';
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

function renderItem(build) {
  return (
    <Link key={build.id} to={`/build/${build.id}`}>
      <Card data={build} clickable></Card>
    </Link>
  );
}

function History({builds = [], title, onMount, showMore, startBuild}) {
  useEffect(() => {
    onMount();
  }, []);
  const [showPopUp, setShowPopUp] = useState(false);

  return (
    <>
      <Header title={title}>
        <Button size="s" icon="play" adaptive onClick={() => setShowPopUp(true)}>Run build</Button>
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
        <Form type="small" metaData={
          [{
            label: 'Enter the commit hash whitch you want to build',
            name: 'hash',
            placeholder: 'Commit hash',
            cleanable: true
          }]
        }
        onSubmit={({hash}) => startBuild(hash)}
        onCancel={() => setShowPopUp(false)}
        />
      </PopUp>
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
  startBuild: startBuild
})(History);

