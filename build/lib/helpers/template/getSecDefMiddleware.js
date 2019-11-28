"use strict";
exports.__esModule = true;
exports["default"] = (function (value, swagger) {
    if (!value || !value.security || value.security.length === 0) {
        return '';
    }
    /**
  
     "security": [{
      "apiKeyAdmin": []
      },{
       "jwtToken": []
      }],
  
     */
    var names = [];
    value.security.forEach(function (secObj) {
        Object.keys(secObj).forEach(function (name) {
            names.push(name);
        });
    });
    return '[' + names.join(', ') + ']';
});
