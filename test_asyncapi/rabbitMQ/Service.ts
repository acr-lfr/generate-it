import { QWrapperDomain } from 'q-wrapper';
import { QWrapperSettings } from 'q-wrapper/lib/models';
import { Message as amqMessage } from 'amqplib/callback_api';
import objectReduceByMap from 'object-reduce-by-map';
import * as operationIds from './operationIds';
import * as interfaces from './interfaces'
import msAuthCacheConnectionSubscribeHandle from '../subscribeHandles/MsAuthCacheConnectionSubscribeHandle'


class RabbitMQ {
  private qWrapper: QWrapperDomain;

  public async setup (qWrapperSettings: QWrapperSettings): Promise<void> {
    this.qWrapper = new QWrapperDomain(qWrapperSettings);
    await this.qWrapper.initialize();
  }

  /**
   * Path: /ms-image/cache-user publish
   * OperationID: msImageCacheUser
   * Description: When a new connection change occurs the new cache values are emitted in the payload
   */
  publishMsImageCacheUser (payload: interfaces.MsAuthCacheUser ): void {
    this.qWrapper.sendToExchange(
      objectReduceByMap(payload, {username: String, email: String, },),
      operationIds.MSIMAGECACHEUSER
    );
  }
  /**
   * All subscribe events get handled in the respective subscribeHandles
   * Each routing key is the operation id.
   * For any routing key not subscribed to, the item from the is simply marked
   * as processed for the queue this ms is bound to.
   */
  subscribe (): void {
    this.qWrapper.consume(async (message: amqMessage) => {
      switch (message.fields.routingKey) {
        
        case operationIds.MSAUTHCACHECONNECTION: {
          try {
            await msAuthCacheConnectionSubscribeHandle(
              JSON.parse(message.content.toString())
            );
            return {
              processed: true,
              requeue: false
            };
          } catch (e) {
            console.error(e);
            return {
              processed: false,
              requeue: true
            };
          }
        }
        default:
          return {
            processed: true,
            requeue: false
          };
      }
    });
  }
}
export default new RabbitMQ();
