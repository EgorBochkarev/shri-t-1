import { Configuration } from "../../server/src/services/rest/conf-dto";
import { Build } from "../../server/src/services/rest/build-dto";
import { ActionObject } from "./actions";


export type Store = {
  settings?:Configuration,
  builds?:Build[],
  build?:Build
  buildLogs?:string,
  offset: number
}

const reduser = (state:Store = {offset: 0}, {type, payload}:ActionObject):Store => {
  switch ( type ) {
    case 'SET_SETTINGS':
      return {
        ...state,
        settings: payload as Configuration
      };
    case 'SET_BUILDS':
      return {
        ...state,
        builds: payload as Build[]
      };
    case 'SET_BUILD':
      return {
        ...state,
        build: payload  as Build
      };
    case 'SET_BUILD_LOGS':
      return {
        ...state,
        buildLogs: payload as string
      };
    case 'SET_BUILDS_OFFSET':
      return {
        ...state,
        offset: payload as number
      };
    default:
      return state;
  }
};

export default reduser;
