export interface WorkerData {
  domainName: string;
  domainFunction: string;
  domainFunctionArgs: any[];
}

export interface WorkerMessage {
  callId: string;
  data: WorkerData;
}

interface WorkerResultWithResponse {
  callId: string;
  response: any;
}

interface WorkerResultWithError {
  callId: string;
  error: any;
}

export type WorkerResult = WorkerResultWithResponse | WorkerResultWithError;