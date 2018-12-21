import { UpperCaseFirstLetterPipe } from './upper-case-first-letter.pipe';

describe('UpperCaseFirstLetterPipe', () => {
  it('create an instance', () => {
    const pipe = new UpperCaseFirstLetterPipe();
    expect(pipe).toBeTruthy();
  });
});
