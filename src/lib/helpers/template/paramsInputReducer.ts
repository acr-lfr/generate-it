import oa2OrOa3 from '@/lib/helpers/oa2OrOa3';
import OaToJs from '@/lib/helpers/OaToJs';
import OaToJsToJs from '@/lib/helpers/OaToJsToJs';

export default (parameters: any) => {
  let body = {};
  let query = {};
  let params = {};
  if (parameters) {
    parameters = JSON.parse(JSON.stringify(parameters));
    parameters.forEach((param: any) => {
      if (param.in === 'body') {
        body = Object.assign(body, param.schema.properties);
      }
      if (param.in === 'query') {
        query = Object.assign(query, oa2OrOa3(param));
      }
      if (param.in === 'path') {
        params = Object.assign(params, oa2OrOa3(param));
      }
    });
    OaToJs.objectWalk(body);
    OaToJs.objectWalk(query);
    OaToJs.objectWalk(params);
    return OaToJsToJs.objectWalkWrite({
      body, query, params,
    });
  }
  return `{
    body: {},
    query: {},
    params: {},
  },
`;
};
