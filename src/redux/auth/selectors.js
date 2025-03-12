import { BACKEND_HOST } from './operations';

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;

export const selectUser = (state) => state.auth.user;

export const selectRefreshToken = (state) => state.auth.refreshToken;

export const selectIsRefreshing = (state) => state.auth.isRefreshing;

export function selectAuthLoading(state) {
  return state.auth.loading;
}

export const selectAvatar = (state) => {
  if (state.auth.user.avatarURL) {
    return BACKEND_HOST + '/' + state.auth.user.avatarURL;
  }
  return null;
};

export function selectAuthError(state) {
  return state.auth.error;
}
