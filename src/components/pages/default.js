import React, {useEffect} from 'react';

import {connect} from 'react-redux';

import {loadInitialPageData} from '../../actions';
import {Redirect} from 'react-router-dom';

function Default({onMount, startPage, loaded}) {
  useEffect(() => {
    onMount();
  }, []);
  if (loaded) {
    if (startPage) {
      return <Redirect to="/history"></Redirect>;
    }
    return <Redirect to="/start"></Redirect>;
  }
  return <div>Loading...</div>;
}

const mapStateToProps = ({settings}) => {
  return {
    startPage: settings && settings.id,
    loaded: !!settings
  };
};

export default connect(mapStateToProps, {
  onMount: loadInitialPageData
})(Default);

