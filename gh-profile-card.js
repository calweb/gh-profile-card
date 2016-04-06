(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Alite(XMLHttpRequest) {

  XMLHttpRequest = XMLHttpRequest || this.XMLHttpRequest;

  function response(req) {
    var isJson = req && req.responseText &&
        req.responseText[0] == '{' ||
        req.responseText[0] == '[';

    return {
      request: req,
      data: isJson ? JSON.parse(req.responseText) : req.responseText
    };
  }

  function ajax(httpMethod, url, params, requestHeaders) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();

      req.onreadystatechange = function () {
        if (req.readyState == 4) {
          if (req.status >= 200 && req.status < 300) {
            resolve(response(req));
          } else {
            reject(response(req));
          }
        }
      }

      req.open(httpMethod, url);
      req.setRequestHeader('content-type', 'application/json');

      if (requestHeaders) {
        for (var name in requestHeaders) {
          req.setRequestHeader(name, requestHeaders[name]);
        }
      }

      req.send(params ? JSON.stringify(params) : undefined);
    });
  }

  return {
    get: function (url, requestHeaders) {
      return ajax('GET', url, undefined, requestHeaders);
    },

    'delete': function (url, requestHeaders) {
      return ajax('DELETE', url, undefined, requestHeaders);
    },

    post: function (url, data, requestHeaders) {
      return ajax('POST', url, data, requestHeaders);
    },

    put: function (url, data, requestHeaders) {
      return ajax('PUT', url, data, requestHeaders);
    },

    patch: function (url, data, requestHeaders) {
      return ajax('PATCH', url, data, requestHeaders);
    }
  };
}

(function (root, factory) {
  var define = root.define;

  if (define && define.amd) {
    define([], factory);
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  }
}(this, function () { return Alite; }));

},{}],2:[function(require,module,exports){
var ajax = require('alite/alite')();

var ghProfileCardProto = Object.create(HTMLElement.prototype);

// lifecycle event callback when element gets created
ghProfileCardProto.createdCallback = function () {

  var shadow = this.createShadowRoot();
  var img = document.createElement('img');
  var link = document.createElement('a');

  var attrs = {
      url: "https://api.github.com/users/",
      username: this.getAttribute('data-username')
  };

  var creds = {
    'Authorization': 'token ' + 'ae8c16622d2797b2856882a0de0f0b40ef9aae7a'
  };
    ajax.get(attrs.url + attrs.username, creds)
      .then(function (ghData) {
        img.alt = attrs.username;
        img.width = '150';
        img.height = '150';
        img.className = 'avatar-img';
        img.src = ghData.data.avatar_url;
        link.className = 'avatar-name';
        link.innerText = attrs.username;
        link.href = ghData.data.html_url;

    })
      .catch(function (err) {
        console.log(err);
      });

      shadow.appendChild(img);
      shadow.appendChild(link);
  };


var ghProfileCard = document.registerElement('gh-profile-card', {
  prototype: ghProfileCardProto
});

},{"alite/alite":1}]},{},[2]);
