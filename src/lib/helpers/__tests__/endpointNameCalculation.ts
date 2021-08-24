import endpointNameCalculation from '@/lib/helpers/endpointNameCalculation';

describe('no grouping', () => {
  it('should return root for /', () => {
    const endpoint = endpointNameCalculation('/', {});
    expect(endpoint).toBe('root');
  });
  it('should fix path without leading /', () => {
    const endpoint = endpointNameCalculation('item', {});
    expect(endpoint).toBe('item');
  });
  it('should return the 1st segment only for no count passed', () => {
    const endpoint = endpointNameCalculation('/item', {});
    expect(endpoint).toBe('item');
  });
  it('should return the 1st segment only for no count passed', () => {
    const endpoint = endpointNameCalculation('/item/', {});
    expect(endpoint).toBe('item');
  });
  it('should return the 1st segment only for no count passed', () => {
    const endpoint = endpointNameCalculation('/item/{id}', {});
    expect(endpoint).toBe('item');
  });
  it('should return the 1st segment only for no count passed', () => {
    const endpoint = endpointNameCalculation('/item/{id}/comment', {});
    expect(endpoint).toBe('item');
  });
});

describe('1st grouping only', () => {
  it('should return the 1st segment only as 1st grouping is 0', () => {
    const endpoint = endpointNameCalculation('/item/{id}', {
      segmentFirstGrouping: 0
    });
    expect(endpoint).toBe('item');
  });

  it('should return the 1st & 2nd segment', () => {
    const endpoint = endpointNameCalculation('/item/{id}', {
      segmentFirstGrouping: 1
    });
    expect(endpoint).toBe('itemId');
  });

  it('should return the 1st segment only when the count 2  & only 2 path segments', () => {
    const endpoint = endpointNameCalculation('/item/{id}', {
      segmentFirstGrouping: 2
    });
    expect(endpoint).toBe('item');
  });

  it('should return the 1st segment only', () => {
    const endpoint = endpointNameCalculation('/item/{id}/comment', {
      segmentFirstGrouping: 2
    });
    expect(endpoint).toBe('itemComment');
  });

  it('should return itemComment and not the remaining segments', () => {
    const endpoint = endpointNameCalculation('/item/{id}/comment/thing', {
      segmentFirstGrouping: 2
    });
    expect(endpoint).toBe('itemComment');
  });

  it('should return itemThing', async () => {
    const endpoint = endpointNameCalculation('/item/{id}/comment/thing', {
      segmentFirstGrouping: 3
    });
    expect(endpoint).toBe('itemThing');
  });

  it('should return itemId', async () => {
    const endpoint = endpointNameCalculation('/item/{id}/comment/thing', {
      segmentFirstGrouping: 1
    });
    expect(endpoint).toBe('itemId');
  });
});

describe('1st and 2nd grouping', () => {
  it('should throw error when 1st is >= to 2nd', (done) => {
    try {
      endpointNameCalculation('/item/{id}/comment/thing', {
        segmentFirstGrouping: 2,
        segmentSecondGrouping: 2
      });
      done('The 1st is equal to the 2nd');
    } catch (e) {
      try {
        endpointNameCalculation('/item/{id}/comment/thing', {
          segmentFirstGrouping: 3,
          segmentSecondGrouping: 2
        });
        done('The 1st is greater than the 2nd');
      } catch (e) {
        done();
      }
    }
  });
  it('should return itemComment as the 1st grouping is 0 the same as the base segment',  () => {
    const endpoint = endpointNameCalculation('/item/{id}/comment/thing', {
      segmentFirstGrouping: 0,
      segmentSecondGrouping: 2
    });
    expect(endpoint).toBe('itemComment');
  });

  it('should return itemIdComment',  () => {
    const endpoint = endpointNameCalculation('/item/{id}/comment/thing', {
      segmentFirstGrouping: 1,
      segmentSecondGrouping: 2
    });
    expect(endpoint).toBe('itemIdComment');
  });

  it('should return itemId',  () => {
    const endpoint = endpointNameCalculation('/item/{id}/comment', {
      segmentFirstGrouping: 1,
      segmentSecondGrouping: 3
    });
    expect(endpoint).toBe('itemId');
  });

  it('should return itemIdThing',  () => {
    const endpoint = endpointNameCalculation('/item/{id}/comment/thing', {
      segmentFirstGrouping: 1,
      segmentSecondGrouping: 3
    });
    expect(endpoint).toBe('itemIdThing');
  });

  it('should return itemIdThing',  () => {
    const endpoint = endpointNameCalculation('/item/{id}/comment/thing', {
      segmentFirstGrouping: 2,
      segmentSecondGrouping: 3
    });
    expect(endpoint).toBe('itemCommentThing');
  });
});

describe('2nd grouping only', () => {
  it('should throw an error',  (done) => {
    try {
      endpointNameCalculation('/item/{id}/comment/thing', {
        segmentSecondGrouping: 2
      });
      done('Should have thrown an error when only passing segmentSecondGrouping with no segmentFirstGrouping');
    } catch (e) {
      done();
    }
  });
});

describe('1st & 2nd grouping with only 2 items in the string', () => {
  it('should throw an error', () => {
    const calcString = endpointNameCalculation('/roles/{name}', {
      segmentFirstGrouping: 2,
      segmentSecondGrouping: 4
    });
    expect(calcString).toBe('roles');
  });
});
