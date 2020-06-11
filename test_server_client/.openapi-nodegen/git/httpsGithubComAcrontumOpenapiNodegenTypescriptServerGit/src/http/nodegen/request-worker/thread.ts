import { parentPort } from 'worker_threads';
import 'openapi-nodegen-logger';
import config from '@/config';
import requestWorkerThreadLoader from '@/utils/requestWorkerThreadLoader';
import * as Domains from './domainsImporter';
import { WorkerMessage, WorkerResult } from './types';

// Check the config default config to ensure you have the
// worker attibutes: https://github.com/acrontum/openapi-nodegen-typescript-server/blob/master/src/config.ts
// Ensure you also have in the package.json:
// "worker-farm": "^1.7.0",

(async () => {
  await requestWorkerThreadLoader();
  console.warn(`[request worker] thread ready`);
  parentPort.on('message', async ({ callId, data }: WorkerMessage) => {
    const { domainName, domainFunction, domainFunctionArgs } = data;

    const timeout = setTimeout(() => {
      console.warn('[request worker] timed out');

      parentPort.postMessage({
        callId,
        error: Error('timed out')
      });

      process.exit(1);
    }, config.requestWorker.timeoutMs);

    try {
      // @ts-ignore
      const response: any = await Domains[domainName][domainFunction](...domainFunctionArgs);

      const result: WorkerResult = {
        callId,
        response
      };

      parentPort.postMessage(result);
    } catch (error) {
      const result: WorkerResult = {
        callId,
        error
      };

      parentPort.postMessage(result);
    }

    clearTimeout(timeout);
  });
})();
