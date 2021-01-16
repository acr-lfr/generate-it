import checkRcOpIdArrIsValid from '@/lib/helpers/checkRcOpIdArrIsValid';
import { NodegenRc } from '@/interfaces/NodegenRc';

const nodegenRc: NodegenRc = {
  nodegenDir: 'blah',
  nodegenType: 'blah',
  helpers: {
    publishOpIds: ['bob'],
    subscribeOpIds: ['smith']
  }
};

const openapi = {
  'paths': {}
};

const asyncapi = {
  channels: {
    somepath: {
      publish: {
        operationId: 'bob'
      }
    },
    someotherpath: {
      subscribe: {
        operationId: 'smith'
      }
    }
  }
};

it('should not throw an error for openapi', async (done) => {
  checkRcOpIdArrIsValid(openapi, nodegenRc);
  done();
});

it('should not throw an error for asyncapi', async (done) => {
  checkRcOpIdArrIsValid(asyncapi, nodegenRc);
  done();
});

it('should throw an error for asyncapi with invalid subscribe id', async (done) => {
  nodegenRc.helpers.subscribeOpIds.push('timmy');
  try {
    checkRcOpIdArrIsValid(asyncapi, nodegenRc);
    done('should have errored');
  } catch (e) {
    nodegenRc.helpers.subscribeOpIds.pop();
    done();
  }
});

it('should throw an error for asyncapi with invalid publish id', async (done) => {
  nodegenRc.helpers.publishOpIds.push('timmy');
  try {
    checkRcOpIdArrIsValid(asyncapi, nodegenRc);
    done('should have errored');
  } catch (e) {
    nodegenRc.helpers.publishOpIds.pop();
    done();
  }
});

it('should throw an error for asyncapi with any duplicate id', async (done) => {
  nodegenRc.helpers.publishOpIds.push('smith');
  try {
    checkRcOpIdArrIsValid(asyncapi, nodegenRc);
    done('should have errored');
  } catch (e) {
    nodegenRc.helpers.publishOpIds.pop();
    done();
  }

  nodegenRc.helpers.subscribeOpIds.push('bob');
  try {
    checkRcOpIdArrIsValid(asyncapi, nodegenRc);
    done('should have errored');
  } catch (e) {
    nodegenRc.helpers.publishOpIds.pop();
    done();
  }
});
