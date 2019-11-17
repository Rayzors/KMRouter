import RouteRequest from './request';
export default interface Hooks {
    before?(request: RouteRequest, next: Function): any;
    leave?(request: RouteRequest): any;
}
//# sourceMappingURL=hooks.d.ts.map