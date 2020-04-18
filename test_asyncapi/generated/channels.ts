import { QWrapperDomain } from 'q-wrapper';
import { QWrapperSettings } from 'q-wrapper/lib/models';
import { Message as amqMessage } from 'amqplib/callback_api';
import * as operationIds from './operationIds';
import eventBus from '@/utils/eventBus';

class RabbitMQService {
  private qWrapper: QWrapperDomain;

  public async setup (qWrapperSettings: QWrapperSettings): Promise<void> {
    this.qWrapper = new QWrapperDomain(qWrapperSettings);
    await this.qWrapper.initialize();
    this.listenForInternalAppEvents();
  }

  public listenForInternalAppEvents () {
console.log('EVENT ');
  eventBus.on( operationIds.MSAUTHCONNECTIONDELETEDPUBLISH, (payload: any) => this.qWrapper.sendToExchange(payload, operationIds.MSAUTHCONNECTIONDELETEDPUBLISH));
console.log('EVENT ');
  eventBus.on( operationIds.MSAUTHCONNECTIONUPDATEDPUBLISH, (payload: any) => this.qWrapper.sendToExchange(payload, operationIds.MSAUTHCONNECTIONUPDATEDPUBLISH));
}

  public listenForRabbitMQ (): void {
    this.qWrapper.consume((message: amqMessage) => {
      switch (message.fields.routingKey) {
    case operationIds.MSAUTHCONNECTIONUPDATEDSUBSCRIBE: {
            // Start doing something with the message...
            // Return a response
            return {
              processed: true,
              requeue: false
            }
          }
      default:
          return {
            processed: true,
            requeue: false
          }
      }
    });
  }
}

export default new RabbitMQService();

const a = {"package":{"name":"streetlights-api"},"swagger":{"asyncapi":"2.0.0","info":{"title":"Streetlights API","version":"1.0.0","description":"G2 RabbitMQ routing keys","license":{"name":"Apache 2.0","url":"https://www.apache.org/licenses/LICENSE-2.0"}},"defaultContentType":"application/json","channels":{"msAuthConnectionDeleted":{"description":"When a connection is deleted","parameters":{"updatedId":{"description":"ID String","schema":{"type":"string"}}},"publish":{"operationId":"msAuthConnectionDeletedPublish","message":{"contentType":"application/json","payload":{"type":"object","properties":{"username":{"type":"string"},"connections":{"type":"array","items":{"type":"object","properties":{"updated":{"type":"string","format":"date"},"state":{"type":"string"},"username":{"type":"string"}}}}}}},"x-request-definitions":{"publish":{"name":"","params":["components.parameters.updatedId"],"interfaceText":{"outputString":"export interface  {\n  'undefined'?:string,  \n } "}}},"x-response-definitions":"ms_auth-cache-connection"},"subscribe":{"operationId":"msAuthConnectionDeletedSubscribe","message":{"contentType":"application/json","payload":{"type":"object","properties":{"username":{"type":"string"},"connections":{"type":"array","items":{"type":"object","properties":{"updated":{"type":"string","format":"date"},"state":{"type":"string"},"username":{"type":"string"}}}}}}},"x-request-definitions":{"subscribe":{"name":"","params":["components.parameters.updatedId"],"interfaceText":{"outputString":"export interface  {\n  'undefined'?:string,  \n } "}}},"x-response-definitions":"ms_auth-cache-connection"}},"msAuthConnectionUpdated":{"description":"When a connection is updated","parameters":{"updatedId":{"description":"ID String","schema":{"type":"string"}}},"publish":{"operationId":"msAuthConnectionUpdatedPublish","message":{"contentType":"application/json","payload":{"type":"object","properties":{"username":{"type":"string"},"connections":{"type":"array","items":{"type":"object","properties":{"updated":{"type":"string","format":"date"},"state":{"type":"string"},"username":{"type":"string"}}}}}}},"x-request-definitions":{"publish":{"name":"","params":["components.parameters.updatedId"],"interfaceText":{"outputString":"export interface  {\n  'undefined'?:string,  \n } "}}},"x-response-definitions":"ms_auth-cache-connection"},"subscribe":{"operationId":"msAuthConnectionUpdatedSubscribe","message":{"contentType":"application/json","payload":{"type":"object","properties":{"username":{"type":"string"},"connections":{"type":"array","items":{"type":"object","properties":{"updated":{"type":"string","format":"date"},"state":{"type":"string"},"username":{"type":"string"}}}}}}},"x-request-definitions":{"subscribe":{"name":"","params":["components.parameters.updatedId"],"interfaceText":{"outputString":"export interface  {\n  'undefined'?:string,  \n } "}}},"x-response-definitions":"ms_auth-cache-connection"}}},"components":{"parameters":{"updatedId":{"description":"ID String","schema":{"type":"string"}}},"schemas":{"ms_auth-cache-connection":{"type":"object","properties":{"username":{"type":"string"},"connections":{"type":"array","items":{"type":"object","properties":{"updated":{"type":"string","format":"date"},"state":{"type":"string"},"username":{"type":"string"}}}}}}}},"interfaces":[{"name":"ms_auth-cache-connection","content":{"outputString":"export interface MsAuthCacheConnection {\n    connections?: Connection[];\n    username?:    string;\n}\n\nexport interface Connection {\n    state?:    string;\n    updated?:  Date;\n    username?: string;\n}\n\n"}}],"operationIds":["msAuthConnectionDeletedSubscribe","msAuthConnectionDeletedPublish","msAuthConnectionUpdatedSubscribe","msAuthConnectionUpdatedPublish"],"basePath":"","endpoints":[]},"definitions":[],"endpoints":[],"additionalTplObject":{},"nodegenRc":{"nodegenDir":"generated","nodegenMockDir":"/__mocks__","nodegenType":"server","helpers":{"stub":{"jwtType":"JwtAccess","requestType":"NodegenRequest"},"channelOpIdsIgnore":["msAuthConnectionDeletedPublish"]}}}
