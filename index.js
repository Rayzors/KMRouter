let router = new KMRouter([
  {
    path: '/',
    action: function(){
      document.body.innerHTML = 'Home'
    },
    leave(request) {
      console.log('leave route');
    },
    before(request) {
      console.log('before route');
    },
  },
  {
    path: '/profile/{name:(\\w+)}',
    action: function(request) {
      document.body.innerHTML = `go to ${request.params.name} <span to="/" data-router-link>test</span>`;
    },
    leave: function(request) {
      console.log('leave route');
    },
    before: function(request) {
      console.log('before route');
    },
  },
  {
    path: '*',
    action: function(request) {
      document.body.innerHTML = `Not Found`;
    },
  },
]);

router.hooks.leave = function(request) {
  console.log('global leave');
};

router.hooks.before = function(request) {
  console.log('global before');
};
