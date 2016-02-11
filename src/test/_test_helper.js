import expect, { createSpy } from 'expect';

export async function testValueForParam(value, param, handler) {
  const { fns, ctx, next } = this;
  ctx.request.body[param] = value;
  const errorHandler = createSpy().andCall(e => {
    expect(e.message)
    .toMatch(new RegExp(`${param}`))
    .toMatch(/missing|invalid input/i);
  });
  await handler(fns)(ctx, next).catch(errorHandler);
  expect(errorHandler).toHaveBeenCalled();
  expect(next).toNotHaveBeenCalled();
  for (const fn of Object.keys(fns)) {
    expect(fns[fn]).toNotHaveBeenCalled();
  }
}


export function testRequiredParam(...args) {
  return async function test() {
    await Promise.all([null, undefined, ''].map(value => (
      testValueForParam.call(this, value, ...args)
    )));
  };
}
