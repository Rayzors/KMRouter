import RouteRequest from './request';
export default interface Route {
    path: string;
    before?(): any;
    action(request: RouteRequest): any;
    leave?(): any;
    redirect?: string;
}
//# sourceMappingURL=route.d.ts.map