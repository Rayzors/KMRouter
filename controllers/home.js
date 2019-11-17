export const index = (request) => {
  console.log(request);
  return `Hello ${request.params.name}`;
};
