import { randomNumber } from './numberGenerator'

export const booleanGenerator = () => {
  return ((randomNumber(1, 2) % 2) !== 0)
}
