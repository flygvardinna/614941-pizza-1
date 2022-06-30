import { setAuth } from "@/common/helpers";

export default function auth({ next, store, nextMiddleware }) {
  if (store.state.Auth.user === null) {
    const token = store.$jwt.getToken();

    if (token) {
      setAuth(store);
    } else {
      next("/");
    }
  }
  return nextMiddleware();
}
