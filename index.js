var express = require('express');
var router = express.Router();

/**
 * Print in console all the verbs detected for the passed route
 */
var getRouteMethods = function(route, options) {
  var methods = [];
  options = options || {};

  for (var method in route.methods) {
    if (!options.withAll && method === '_all') continue;

    methods.push(method.toUpperCase());
  }

  return methods;
};

/**
 * Return an array if strings with all the detected endpoints
 */
var getEndpoints = function(routerStack, path, endpoints) {
  var regExp = /^\/\^\\\/(?:(\w*)|(\(\?:\(\[\^\\\/\]\+\?\)\)))\\\/.*/;

  endpoints = endpoints || [];
  path = path || '';

  routerStack.forEach(function(val) {
    var methods = [];
    var newPath = regExp.exec(val.regexp);

    if (val.route) {
      endpoints.push({
        path: path + val.route.path,
        methods: getRouteMethods(val.route, {prefix: path})
      });

    } else if (val.name === 'router' || val.name === 'bound dispatch') {
      if (newPath) {
        getEndpoints(val.handle.stack, path + '/' + newPath[1], endpoints);

      } else {
        getEndpoints(val.handle.stack, path, endpoints);
      }
    }
  });

  return endpoints;
};

module.exports = getEndpoints;
