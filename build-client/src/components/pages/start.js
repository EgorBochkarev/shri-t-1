import React from 'react';
import Button from '../button';
import {Link} from 'react-router-dom';
import Header from '../header';
import Informer from '../informer';

function Start() {
  return (
    <>
      <Header>
        <Link to="/settings">
          <Button size="s" icon="settings" adaptive>Settings</Button>
        </Link>
      </Header>
      <div className="page__scrolled-container">
        <Informer
          icon="logo"
          text="Configure repository connection and synchronization settings"
          className="content content_align_vertical content_justify_center"
        >
          <Link to="/settings">
            <Button size="m" type="action">Open settings</Button>
          </Link>
        </Informer>
      </div>
    </>
  );
}

export default Start;

