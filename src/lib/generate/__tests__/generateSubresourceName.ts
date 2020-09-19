import generateSubresourceName from '@/lib/generate/generateSubresourceName';

it('should return /', async () => {
  const subRes = generateSubresourceName('/');
  expect(subRes).toBe('/');
});

it('should return /', async () => {
  const subRes = generateSubresourceName('/:name');
  expect(subRes).toBe('/');
});

it('should return /', async () => {
  const subRes = generateSubresourceName('/name');
  expect(subRes).toBe('/');
});

it('should return /:id', async () => {
  const subRes = generateSubresourceName('/name/:id');
  expect(subRes).toBe('/:id');
});

it('should return /:id/cow/donkey', async () => {
  const subRes = generateSubresourceName('/name/:id/cow/donkey');
  expect(subRes).toBe('/:id/cow/donkey');
});

it('should return /:id/cow/donkey/:age', async () => {
  const subRes = generateSubresourceName('/name/:id/cow/donkey/:age');
  expect(subRes).toBe('/:id/cow/donkey/:age');
});
