import { setLocale } from 'yup';

setLocale({
  mixed: {
    default: 'Campo não é válido',
    required: 'O campo é obrigatório',
  },
  string: {
    email: () => 'O campo deve conter um e-mail válido',
    max: ({ max }) => `O campo deve ter no máximo ${max} caracteres`,
    min: ({ min }) => `O campo deve ter pelo menos ${min} caracteres`,
    length: (length) => `O campo deve ter exatamente ${length} caracteres`,
  },
  date: {
    min: (min) => `Deve ser maior que a data ${min}`,
    max: (max) => `Deve ser menor que a data ${max}`,
  },
  number: {
    integer: () => 'O campo deve ter um número inteiro',
    negative: () => 'O campo deve ter um número negativo',
    positive: () => 'O campo deve ter um número posítivo',
    moreThan: (more) => `O campo deve ter maior que ${more}`,
    lessThan: (less) => `O campo deve ter menor que ${less}`,
    min: (min) => `O campo deve ter no mínimo ${min} caracteres`,
    max: (max) => `O campo deve ter no máximo ${max} caracteres`,
  },
  boolean: {},
  object: {},
  array: {},
});