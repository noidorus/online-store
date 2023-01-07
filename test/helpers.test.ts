import { capitalizeExpr } from '../src/components/helpers/helpers';

test('Check capitalizeExpr', () => {
  const string1 = 'one-two';
  const string2 = 'one';

  expect(capitalizeExpr(string1)).toEqual('One Two');
  expect(capitalizeExpr(string2)).toEqual('One');
});
