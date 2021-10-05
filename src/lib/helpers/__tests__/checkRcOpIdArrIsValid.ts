import checkRcOpIdArrIsValid from '@/lib/helpers/checkRcOpIdArrIsValid';
import { NodegenRc } from '@/interfaces/NodegenRc';

const nodegenRc: NodegenRc = {
  nodegenDir: 'blah',
  nodegenType: 'blah',
  helpers: {
    publishOpIds: ['bob', 'pubAndSubOnSameService'],
    subscribeOpIds: ['smith', 'pubAndSubOnSameService']
  }
};

const openapi = {
  'paths': {}
};

const asyncapi = {
  channels: {
    doBoth: {
      publish: {
        operationId: 'pubAndSubOnSameService'
      }
    },
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

it('should not throw an error for openapi', (done) => {
  checkRcOpIdArrIsValid(openapi, nodegenRc);
  done();
});

it('should not throw an error for asyncapi', (done) => {
  checkRcOpIdArrIsValid(asyncapi, nodegenRc);
  done();
});

it('should throw an error for asyncapi with invalid subscribe id', (done) => {
  nodegenRc.helpers.subscribeOpIds.push('timmy');
  try {
    checkRcOpIdArrIsValid(asyncapi, nodegenRc);
    done('should have errored');
  } catch (e) {
    nodegenRc.helpers.subscribeOpIds.pop();
    done();
  }
});

it('should throw an error for asyncapi with invalid publish id', (done) => {
  nodegenRc.helpers.publishOpIds.push('timmy');
  try {
    checkRcOpIdArrIsValid(asyncapi, nodegenRc);
    done('should have errored');
  } catch (e) {
    nodegenRc.helpers.publishOpIds.pop();
    done();
  }
});

it('should throw an error for asyncapi with any duplicate id in the pub list', (done) => {
  nodegenRc.helpers.publishOpIds.push('bob');
  try {
    checkRcOpIdArrIsValid(asyncapi, nodegenRc);
    done('should have errored');
  } catch (e) {
    nodegenRc.helpers.publishOpIds.pop();
    done();
  }
});

it('should throw an error for asyncapi with any duplicate id', (done) => {
  nodegenRc.helpers.subscribeOpIds.push('smith');
  try {
    checkRcOpIdArrIsValid(asyncapi, nodegenRc);
    done('should have errored');
  } catch (e) {
    nodegenRc.helpers.publishOpIds.pop();
    done();
  }
});
