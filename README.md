# KMRouter

## Quick start

### Server configuration

Before using this router, the server must be configured. The server must redirect all the requests to `index.html`

#### Apache

You can do it in a `.htaccess` file at the root of your folder

```apache
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [L]
```

#### Nginx

```nginx
location / {
  try_files $uri /index.html;
}
```

### Package Installation

#### NPM

`npm i kmrouter`

```JS
import { KMRouter } from 'kmrouter';
```

### Routes creation

Routes are an array of object where each object is a route. A route must have 2 keys :

- path : `String`. The path of your route.
- action : `Function`. The router callback.
- before (optional) : `Function`. Function executed before the action.
- leave (optional) : `Function`. Function executed on leaving route.
- redirect (optional) : `String`. The route where you want to be redirected.

```JS
let routes = [
  {
    path: '/',
    action: function(){
      document.body.innerHTML = 'Home'
    },
    leave(request) {
      console.log('leave route');
    },
    before(request, next) {
      console.log('before route');
      next()
    },
    // redirect: '/hello'
  }
]
```

### Router initialization

The Router class takes some arguments:

- List of your routes : `Route[]`.

```JS
let router = new KMRouter(routes)
```

## Additional

### Route params

Params can be set set to your route by sepecifing a key placed between `{}`. The url params can be used in controller by the `params` propriety of the `request`argument of the controller.

```JS
let routes = [
  {
    path: '/{name}';
    action: function(request){
      document.body.innerHTML = `Hello ${request.params.name}`;
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
    action: function(request){
      document.body.innerHTML = `Hello ${request.params.name}`;
    }
  }
]
```

### 404 not found

To set a 404 page, a `*` path exist. This path allow you to have a default redirection or view when url does not match with one of your routes.

```JS
let routes = [
  {
    path: '*';
    action: function(){
      document.body.innerHTML = `<h1>404 not found</h1>`
    }
  }
]
```

### Router link

A specific data attribute `data-router-link` must be added to your links to render without refreshing the page. The `href` attribute must be the route where you want to go.

```HTML
<a href="/path/to" data-router-link>label</a>
```

### Redirection

Your can set redirection by two ways : directly in you route configuration or in your controller.

#### In route configuration

```JS
let routes = [
  {
    path: '/';
    redirect: '/path/to'
    action: function(){
      document.body.innerHTML = 'Hello world';
    }
  }
]
```

#### Or in a controller

```JS
let routes = [
  {
    path: '/';
    action: function(request){
      request.redirect('/path/to')
    }
  }
]
```
