const reduser = (state = {offset: 0}, {type, payload}) => {
  switch ( type ) {
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: payload
      };
    case 'SET_BUILDS':
      return {
        ...state,
        builds: payload
      };
    case 'SET_BUILD':
      const result = {
        ...state,
        build: payload
      };
      return result;
    case 'SET_BUILD_LOGS':
      return {
        ...state,
        buildLogs: payload
      };
    case 'SET_BUILDS_OFFSET':
      return {
        ...state,
        offset: payload
      };
    default:
      return state;
  }
};

export default reduser;
