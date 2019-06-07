const hooks = require('hooks');

hooks.afterAll((transactions, done) => {
  done();
});


hooks.beforeEach((transaction, done) => {
  transaction.request.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJwYWsiOiIwNDY1NyIsInRpdGxlIjoibXIiLCJlbWFpbCI6InJldmFoQGFjcm9udHVtLmRlIiwiZmlyc3ROYW1lIjoiRWxpIiwibGFzdE5hbWUiOiJSZXZhaCIsImlzUGNhIjp0cnVlLCJpc1NrZCI6dHJ1ZSwicm9sZXMiOlsiYm13Il0sImFjdGl2ZSI6dHJ1ZSwiY3JlYXRlZEF0IjoiMjAxOS0wMS0xN1QxNTo0NDowNC42NTRaIiwidXBkYXRlZEF0IjoiMjAxOS0wMS0xN1QxNjozNDoxMi45NDRaIn0sImlhdCI6MTU0NzgyMjYzNCwiZXhwIjoxNTQ3ODI2MjM0fQ.KM3bkZlroG_h-1pAOYC2dzbLMVYbqIvnFakMMmb6d8s';
  transaction.expected.headers['Content-Type'] = 'application/json; charset=utf-8';
  done();
});