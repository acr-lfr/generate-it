import endpointNameCalculation from '@/lib/helpers/endpointNameCalculation';

it('should return the 1st segment only for no count passed', async () => {
  const endpoint = endpointNameCalculation('/item/{id}', {});
  expect(endpoint).toBe('item');
});

it('should return the 1st segment only when the count 2  & only 2 path segments', async () => {
  const endpoint = endpointNameCalculation('/item/{id}', {
    segmentFirstGrouping: 2
  });
  expect(endpoint).toBe('item');
});

it('should return the 1st segment only', async () => {
  const endpoint = endpointNameCalculation('/item/{id}/comment', {
    segmentFirstGrouping: 2
  });
  expect(endpoint).toBe('itemComment');
});

it('should return itemComment', async () => {
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
