# KMRouter

## Quick start

### Create your routes

Routes is an array of object where each object is a route. A route must have 2 keys :

- path : `String`. The path of your route.
- controller : `Function`. The controller of your route.
- redirect (optional) : `String`. The route where you want to be redirected.

```JS
let routes = [
  {
    path: '/';
    controller: function(){
      return 'Hello world';
    }
    // redirect: '/hello'
  }
]
```

### Initialize the router

The Router class takes some arguments:

- The container of you app where views will be rendered: `String` or `Node`.
- List of your routes : `Object[]`.

```JS
let router = new Router("#app", routes)
```

## Additional route settings

### Route params

Params can be set set to your route by sepecifing a key placed between `{}`. The url params can be used in controller by the `params` propriety.

```JS
let routes = [
  {
    path: '/{name}';
    controller: function(){
      return `Hello ${router.params.name}`;
    }
  }
]
```

### Route params format

Params format can be specified by using regular expression.

> ⚠️ Regular expression need to be escaped

```JS
let routes = [
  {
    path: '/{name:(\\w+)}';
    controller: function(){
      return `Hello ${router.params.name}`;
    }
  }
]
```

### 404 not found

To set a 404 page, a `*` path exist. This path allow you to have a default redirection or view when url does not match with one of your routes.

> ⚠️ `*` need to be escaped

```JS
let routes = [
  {
    path: '\\*';
    controller: function(){
      return `<h1>404 not found</h1>
    }
  }
]
```
