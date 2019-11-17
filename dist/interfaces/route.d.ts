import RouteRequest from './request';
import Hooks from './hooks';
export default interface Route extends Hooks {
    path: string;
    action(request: RouteRequest): any;
    redirect?: string;
}
export declare function isRoute(route: Route): route is Route;
//# sourceMappingURL=route.d.ts.map