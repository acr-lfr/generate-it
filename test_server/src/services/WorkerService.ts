import NodegenRequest from '@/http/interfaces/NodegenRequest';

class WorkerService {
  /**
   * This will never be overridden.
   * If the swagger path contains x-request-proxy this services is used.
   * @param req
   * @param domainName
   * @param domainFunction
   * @param domainFunctionArgs
   */
  public handleRequestWithWorker (req: NodegenRequest, domainName: string, domainFunction: string, domainFunctionArgs: any[]): Promise<any> {
    // Please remove the Promise.reject() and inject your own worker calling logic here.
    return Promise.reject(
      Error('You need to implement request proxy')
    );
  }
}

export default new WorkerService();
