import express from 'express';
import { JwtAccess } from '@/http/nodegen/interfaces';

export default interface NodegenRequest extends express.Request {
  jwtData: JwtAccess;
  originalToken: string;
  clientIp: string;
}

