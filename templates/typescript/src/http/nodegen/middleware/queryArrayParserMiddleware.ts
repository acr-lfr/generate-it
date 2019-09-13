import express = require('express');
import NodegenRequest from '../interfaces/NodegenRequest';

const getQueries = (url: string) => {
  let queries: any = {};
  if (url.indexOf('?') !== -1) {
    url = url.split('?')[1];
    let vars = url.split('&');
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=');
      queries[pair[0]] = pair[1];
    }
  }
  return queries;
};

export default () => {
  return (req: NodegenRequest, res: express.Response, next: express.NextFunction) => {
    let queries = getQueries(req.url);
    for (let key in queries) {
      let query = queries[key];
      if (query && query.includes(',')) {
        queries[key] = query.split(',').map((s: any) => decodeURIComponent((s)));
      } else {
        queries[key] = decodeURIComponent(queries[key]);
      }
    }
    req.query = queries;
    next();
  }
};
