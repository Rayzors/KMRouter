import Route from './route';

export default interface Router {
  routes: Array<Route>;
  matchedRoute: Route | undefined;
  params: {};
}
