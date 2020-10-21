import extractOASchemaPathResponses from '@/lib/helpers/extractOASchemaPathResponses';
import OaToJs from '@/lib/helpers/OaToJs';
import OaToJsToJs from '@/lib/helpers/OaToJsToJs';

export default (responses: any) => {
  if (!responses) {
    return responses;
  }
  const schema = extractOASchemaPathResponses(JSON.parse(JSON.stringify(responses)));
  const a = OaToJs.oaToJsType(schema);
  if (a && a.required) {
    delete a.required;
  }
  if (Array.isArray(a)) {
    return '[' + OaToJsToJs.arrayWalkWrite(a) + '],';
  } else {
    return OaToJsToJs.objectWalkWrite(a);
  }
};
