There is 1 key rule with the current core: All request params and response objects must be declared.

Do not declare the request data directly in the path object,

For an example: https://github.com/acrontum/generate-it/blob/master/test_swagger.yml

Notice that all request and params are only referenced from within the paths. This is due to the code in the core that generates the interfaces.

> In the future it is intended to extend the core to be able to creating unique interfaces from path data without referencing a declared object.
