import RestService from './services/rest-service';

const restService = new RestService();
const BUILDS_LIMIT = 10;

const loadInitialPageData = () => (dispatch, getState) => {
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
        const buildId = location.pathname.match(/^\/build\/(.*)/)[1];
        dispatch(loadBuild(buildId));
        dispatch(loadBuildLogs(buildId));
      }
  }
};

const loadSettings = () => (dispatch, getState) => {
  return restService.getSettings().then((settings) => {
    dispatch(setSettings(settings));
  });
};

const saveSettings = (settings) => (dispatch, getState) => {
  return restService.setSettings(settings).then((settings) => {
    return dispatch(setSettings(settings));
  });
};

const loadBuilds = (offset, limit) => (dispatch, getState) => {
  return restService.getAllBuilds(offset, limit).then((builds) => {
    dispatch(setBuilds(builds));
  });
};
const loadMoreBuilds = () => (dispatch, getState) => {
  return restService.getAllBuilds(getState().offset, BUILDS_LIMIT).then((builds) => {
    dispatch(setOffset(getState().offset + BUILDS_LIMIT));
    dispatch(setBuilds([...getState().builds, ...builds]));
  });
};
const loadBuild = (id) => (dispatch, getState) => {
  return restService.getBuild(id).then((build) => {
    dispatch(setBuild(build));
  });
};
const loadBuildLogs = (id) => (dispatch, getState) => {
  return restService.getBuildLogs(id).then((buildLogs) => {
    dispatch(setBuildLogs(buildLogs));
  });
};
const startBuild = (commitHash) => (dispatch, getState) => {
  return restService.startBuild(commitHash).then((build) => {
    dispatch(setBuild(build));
  });
};

const setSettings = (settings) => ({type: 'SET_SETTINGS', payload: settings});
const setBuilds = (builds) => ({type: 'SET_BUILDS', payload: builds});
const setBuild = (build) => ({type: 'SET_BUILD', payload: build});
const setBuildLogs = (build) => ({type: 'SET_BUILD_LOGS', payload: build});
const setOffset = (offset) => ({type: 'SET_BUILDS_OFFSET', payload: offset});

export {
  loadInitialPageData,
  loadSettings,
  saveSettings,
  loadBuilds,
  loadMoreBuilds,
  loadBuild,
  loadBuildLogs,
  startBuild
};
