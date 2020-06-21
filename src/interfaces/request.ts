export default interface RouteRequest {
  redirect(uri: string): void;
  readonly params: {};
  readonly path: string;
}
