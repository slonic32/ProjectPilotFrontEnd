import { selectAuthError, selectAuthLoading } from "./auth/selectors";

export function selectLoading(state) {
  return selectAuthLoading(state);
}

export function selectError(state) {
  return selectAuthError(state);
}
