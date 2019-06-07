import { Request, Response } from 'express';

export default () => {
  return (err: any, req: Request, res: Response) => {
    console.error(err.stack);
    return res.status(500).send(JSON.stringify(err.stack));
  };
};
