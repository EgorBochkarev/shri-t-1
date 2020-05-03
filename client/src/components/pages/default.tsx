import React, {useEffect} from 'react';

import {connect} from 'react-redux';

import {loadInitialPageData} from '../../actions';
import {Redirect} from 'react-router-dom';
import { Store } from '../../reducer';

interface DefaultPageProps {
  onMount():void;
  startPage:boolean;
  loaded:boolean;
}

const Default:React.FC<DefaultPageProps> = ({onMount, startPage, loaded}) => {
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

const mapStateToProps = ({settings}:Store) => {
  return {
    startPage: Boolean(settings && settings.id),
    loaded: !!settings
  };
};

export default connect(mapStateToProps, {
  onMount: loadInitialPageData
})(Default);

