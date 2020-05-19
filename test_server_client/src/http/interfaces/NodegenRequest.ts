import express from 'express';

export default interface NodegenRequest extends express.Request {
  jwtData: object;
  originalToken: string;
  clientIp: string;
}

