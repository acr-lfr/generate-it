import { randomNumber } from './numberGenerator'

export const integerGenerator = (schemaPart) => {
  let minimum = schemaPart.minimum || 0
  let maximum = schemaPart.maximum || 100
  if (!schemaPart.exclusiveMinimum) {
    ++minimum
  }
  if (!schemaPart.exclusiveMaximum) {
    --maximum
  }
  const number = randomNumber(minimum, maximum)
  if (schemaPart.multipleOf) {
    return number * Number(schemaPart.multipleOf)
  } else {
    return number
  }
}
