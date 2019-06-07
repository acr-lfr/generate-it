import { Request, Response } from 'express';
const expressValidation = require('express-validation');

export default () => {
  return (err: any, req: Request, res: Response, next: any) => {
    // Check if the error in an instance of the express validation and output accoridngly
    if (err instanceof expressValidation.ValidationError) {
      res.status(422).json(err);
    } else {
      next(err);
    }
  };
};
