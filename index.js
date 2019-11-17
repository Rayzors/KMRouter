let router = new KMRouter([
  {
    path: '/',
    action() {
      document.write('home');
    },
  },
  {
    path: '/profile/{name}',
    action(request) {
      document.write(`home ${request.params.name}`);
    },
  },
]);
