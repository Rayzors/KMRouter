import RouteRequest from './request';
import Hooks from './hooks';

export default interface Route extends Hooks {
  path: string;
  action(request: RouteRequest): any;
  redirect?: string;
}

export function isRoute(route: Route): route is Route {
  return (
    (route as Route).path !== undefined &&
    typeof (route as Route).path === 'string' &&
    (route as Route).action !== undefined &&
    typeof (route as Route).action === 'function'
  );
}
