import {
  TAG_NAME,
  TAG_OBJECT_STORAGE,
  TAG_AUTH_STATUS,
  PROFILE_IMAGE,
  RESET_AUTH,
  ALL_USER_TAG_STORAGE,
  PORTFOLIO,
  LIVE_PRICES,
} from '../actions/types';

const initialState = {
  tagName: '',
  tagStorage: {},
  allUserTagStorage: [],
  portfolio: [],
  livePrices: [],
  profileImage: null,
  signedIn: true,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_AUTH:
      return initialState;
    case TAG_NAME:
      return {
        ...state,
        tagName: action.payload,
      };
    case TAG_OBJECT_STORAGE:
      return {
        ...state,
        tagStorage: action.payload,
      };
    case TAG_AUTH_STATUS:
      return {
        ...state,
        signedIn: action.payload,
      };
    case PROFILE_IMAGE:
      return {
        ...state,
        profileImage: action.payload,
      };
    case PORTFOLIO:
      return {
        ...state,
        portfolio: action.payload,
      };
    case LIVE_PRICES:
      return {
        ...state,
        livePrices: action.payload,
      };
    case ALL_USER_TAG_STORAGE:
      return {
        ...state,
        allUserTagStorage: action.payload,
      };
    default:
      return state;
  }
};

export default AuthReducer;
