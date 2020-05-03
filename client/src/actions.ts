import RestService from './services/rest-service';
import history from './history';
import { Configuration } from '../../server/src/services/rest/conf-dto';
import { Build } from '../../server/src/services/rest/build-dto';
import { Store } from './reducer';
import { ThunkAction } from 'redux-thunk';

type ThunkResult<R> = ThunkAction<R, Store, undefined, any>;
type ThunkResultFunction<R> = () => ThunkResult<R>;


const restService = new RestService();
const BUILDS_LIMIT:number = 10;

const loadInitialPageData:ThunkResultFunction<void> = () => (dispatch) => {
  switch (location.pathname) {
    case '/':
    case '/settings':
      dispatch(loadSettings());
      break;
    case '/history':
      dispatch(loadSettings());
      dispatch(loadBuilds(0, BUILDS_LIMIT));
      dispatch(setOffset(BUILDS_LIMIT));
      break;
    default:
      if (/^\/build\/(.*)/.test(location.pathname)) {
        const match = location.pathname.match(/^\/build\/(.*)/);
        const buildId = match && match[1];
        if (buildId) {
          dispatch(loadBuild(buildId));
          dispatch(loadBuildLogs(buildId));
        }
      }
  }
};

const redirect = (path:string) => () => {
  return history.push(path);
};

const loadSettings:ThunkResultFunction<void> = () => (dispatch) => {
  return restService.getSettings().then((settings) => {
    if (typeof settings !== 'string') {
      dispatch(setSettings(settings));
    }
  });
};

const saveSettings = (settings:Configuration):ThunkResult<void> => (dispatch) => {
  return restService.setSettings(settings).then((settings) => {
    dispatch(setSettings(settings));
    dispatch(redirect('/'));
  });
};

const loadBuilds = (offset:number, limit:number):ThunkResult<void> => (dispatch) => {
  return restService.getAllBuilds(offset, limit).then((builds) => {
    dispatch(setBuilds(builds));
  });
};
const loadMoreBuilds:ThunkResultFunction<void> = () => (dispatch, getState) => {
  return restService.getAllBuilds(
      getState().offset,
      BUILDS_LIMIT
  ).then((builds) => {
    dispatch(setOffset(getState().offset + BUILDS_LIMIT));
    dispatch(setBuilds([...getState().builds, ...builds]));
  });
};
const loadBuild = (id:string):ThunkResult<void> => (dispatch, getState) => {
  return restService.getBuild(id).then((build) => {
    if (typeof build !== 'string') {
      dispatch(setBuild(build));
    }
  });
};
const loadBuildLogs = (id:string):ThunkResult<void> => (dispatch, getState) => {
  return restService.getBuildLogs(id).then((buildLogs) => {
    dispatch(setBuildLogs(buildLogs));
  });
};
const startBuild = (commitHash:string):ThunkResult<void> => (dispatch, getState) => {
  return restService.startBuild(commitHash).then((build) => {
    dispatch(setBuild(build));
    dispatch(redirect(`/build/${build.id}`));
  });
};


export type ActionObject = {
  type:string,
  payload:Configuration|Build[]|Build|string|number
}

const setSettings = (settings:Configuration):ActionObject => ({type: 'SET_SETTINGS', payload: settings});
const setBuilds = (builds:Build[]):ActionObject => ({type: 'SET_BUILDS', payload: builds});
const setBuild = (build:Build):ActionObject => ({type: 'SET_BUILD', payload: build});
const setBuildLogs = (buildLogs:string):ActionObject => ({type: 'SET_BUILD_LOGS', payload: buildLogs});
const setOffset = (offset:number):ActionObject => ({type: 'SET_BUILDS_OFFSET', payload: offset});

export {
  loadInitialPageData,
  loadSettings,
  saveSettings,
  loadBuilds,
  loadMoreBuilds,
  loadBuild,
  loadBuildLogs,
  startBuild,
  redirect
};
