import {
  TAG_NAME,
  TAG_OBJECT_STORAGE,
  TAG_AUTH_STATUS,
  PROFILE_IMAGE,
  RESET_AUTH,
  ALL_USER_TAG_STORAGE,
  PORTFOLIO,
  LIVE_PRICES,
} from './types';

export const getTagName = (tagName) => {
  return {
    type: TAG_NAME,
    payload: tagName,
  };
};

export const getTagStorage = (tagStorage) => {
  return {
    type: TAG_OBJECT_STORAGE,
    payload: tagStorage,
  };
};

export const getAuthStatus = (signedIn) => {
  return {
    type: TAG_AUTH_STATUS,
    payload: signedIn,
  };
};

export const getPortfolio = (portfolio) => {
  return {
    type: PORTFOLIO,
    payload: portfolio,
  };
};

export const getLivePrices = (livePrices) => {
  return {
    type: LIVE_PRICES,
    payload: livePrices,
  };
};

export const getProfileImage = (profileImage) => {
  return {
    type: PROFILE_IMAGE,
    payload: profileImage,
  };
};

export const getAllUserTagStorage = (allUserTagStorage) => {
  return {
    type: ALL_USER_TAG_STORAGE,
    payload: allUserTagStorage,
  };
};

export const resetAuth = () => {
  return {
    type: RESET_AUTH,
  };
};
