import Route from './interfaces/route';
import Hooks from './interfaces/hooks';
/**
 * KMRouter
 *
 * @export
 * @class KMRouter
 */
export declare class KMRouter {
    private routes;
    private matchedRoute;
    private params;
    hooks: Hooks;
    /**
     * @description Creates an instance of Router.
     * @param {Array<Route>} routes
     * @memberof KMRouter
     */
    constructor(routes: Array<Route>);
    /**
     * @description Initialize event listeners
     * @memberof KMRouter
     */
    private _bind;
    /**
     * @description Check if the path has the right format
     * @private
     * @param {string} path
     * @returns {string}
     * @memberof KMRouter
     */
    private _formatPath;
    /**
     * @description Check if routes is an Array of Route
     * @param {Array} routes
     * @returns {Array}
     * @memberof Router
     */
    _checkRoutesType(routes: Array<Route>): void;
    /**
     * @description Get the current route and execute the associated methods
     * @private
     * @param {string} url
     * @param {boolean} [onWindowLoad=true]
     * @param {boolean} [isPushState=true]
     * @param {boolean} [redirect=false]
     * @returns
     * @memberof KMRouter
     */
    private _dispatch;
    /**
     * @description Check if the requested URL exist in the route array
     * @param {string} url
     * @returns {(Route|undefined)}
     * @memberof KMRouter
     */
    private _match;
    /**
     * @description Generate the URL Regex
     * @private
     * @param {string} path
     * @returns {RegExp}
     * @memberof KMRouter
     */
    private _generateURLRegExp;
    private _hookPromisify;
    /**
     * @description Trigger navigation on click on link with the 'data-router-link' attribute
     * @private
     * @param {MouseEvent} e
     * @memberof KMRouter
     */
    private _triggerRouterLink;
    /**
     * @description get the right route on window load event
     * @private
     * @memberof KMRouter
     */
    private onWindowLoad;
    /**
     * @description get the right route on popstate event
     * @private
     * @memberof KMRouter
     */
    private handlePopState;
}
//# sourceMappingURL=index.d.ts.map