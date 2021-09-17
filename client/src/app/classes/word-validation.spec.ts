import { WordValidation } from './word-validation';

describe('WordValidation', () => {
  it('should create an instance', () => {
    expect(new WordValidation()).toBeTruthy();
  });

  it('should remove accents ', () => {
    let accentWord: string = 'éÈçä';
    let noAccents: string = 'eEca'
    expect(WordValidation.uniformLetters(accentWord)).toBe(noAccents);
  });

  it('shouldnt affect anything other than accents', () => {
    let noAccents = 'e3-= .ddec7qa`~';
    expect(WordValidation.uniformLetters(noAccents)).toBe(noAccents);
  })
});

