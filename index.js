const HttpMethodResolver = require('./method');

exports.Get = function(router) {
  return new HttpMethodResolver('GET', router);
};

exports.Post = function(router) {
  return new HttpMethodResolver('POST', router);
};

exports.Put = function(router) {
  return new HttpMethodResolver('PUT', router);
};

exports.Delete = function(router) {
  return new HttpMethodResolver('DELETE', router);
};

exports.Head = function(router) {
  return new HttpMethodResolver('HEAD', router);
};

exports.Patch = function(router) {
  return new HttpMethodResolver('PATCH', router);
};