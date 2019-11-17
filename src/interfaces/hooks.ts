import RouteRequest from './request';

export default interface Hooks {
  before?(request: RouteRequest): any;
  leave?(request: RouteRequest): any;
}
