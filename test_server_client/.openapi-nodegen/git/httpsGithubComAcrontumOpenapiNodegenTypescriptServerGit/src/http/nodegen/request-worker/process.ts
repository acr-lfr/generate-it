import { Worker } from 'worker_threads';
import config from '@/config';
import { WorkerData, WorkerMessage } from './types';
import { v4 as uuidv4 } from 'uuid';

// Check the config default config to ensure you have the
// worker attibutes: https://github.com/acrontum/openapi-nodegen-typescript-server/blob/master/src/config.ts
// Ensure you also have in the package.json:
// "worker-farm": "^1.7.0"

const initStaticPool = () => {
  let currentWorkerIndex = -1;
  const workers = new Array(config.requestWorker.threadsPerProcess).fill(null);

  const startWorker = (index: number) => (
    new Worker(
      `${process.cwd()}/build/src/http/nodegen/request-worker/thread.js`
    )
      .once('error', () => {
        workers[index] = startWorker(index);
      })
      .once('exit', () => {
        workers[index] = startWorker(index);
      })
  );

  for (let index = 0; index < workers.length; index++) {
    workers[index] = startWorker(index);
  }

  return {
    exec: (data: WorkerData) => new Promise((resolve, reject) => {
      if (++currentWorkerIndex === workers.length) {
        currentWorkerIndex = 0;
      }

      const worker = workers[currentWorkerIndex];
      const currentCallId = uuidv4();

      const handleMessage = ({ callId, error, response }: any) => {
        if (callId !== currentCallId) {
          return worker.once('message', handleMessage);
        }

        if (error) {
          return reject(error);
        }

        resolve(response);
      };

      const message: WorkerMessage = {
        callId: currentCallId,
        data
      };

      worker
        .once('message', handleMessage)
        .postMessage(message);
    })
  }
};

const workerPool = initStaticPool();

console.log('[request worker] process ready');

module.exports = async (workerData: WorkerData, callback: any) => {
  try {
    const response = await workerPool.exec(workerData);
    callback(undefined, response);
  } catch (error) {
    callback(error);
  }
};

