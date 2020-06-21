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
     * @private
     * @param {Array<Route>} routes
     * @memberof KMRouter
     */
    private _checkRoutesType;
    /**
     * @description Get the current route and execute the associated methods
     * @private
     * @param {{
     *     EventType: string;
     *     url: string;
     *     redirect?: boolean;
     *   }} {
     *     EventType,
     *     url,
     *     redirect = false,
     *   }
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
    /**
     * @description Promisify hook to wait for next() to go to the next page
     * @private
     * @param {*} fn
     * @param {RouteRequest} request
     * @returns
     * @memberof KMRouter
     */
    private _hookPromisify;
    /**
     * @description
     * @private
     * @param {{
     *     url: string;
     *     EventType: string;
     *   }} {
     *     url,
     *     EventType,
     *   }
     * @returns {RouteRequest}
     * @memberof KMRouter
     */
    private _makeRequestObject;
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
     * @param {Event} e
     * @memberof KMRouter
     */
    private onWindowLoad;
    /**
     * @description get the right route on popstate event
     * @private
     * @param {PopStateEvent} e
     * @memberof KMRouter
     */
    private handlePopState;
    /**
     * @description Allow the user to redirect and add a state in his history
     * @param {string} url
     * @memberof KMRouter
     */
    push(url: string): void;
    /**
     * @description Allow the user to redirect and replace the current state in his history
     * @param {string} url
     * @memberof KMRouter
     */
    replace(url: string): void;
}
//# sourceMappingURL=index.d.ts.map