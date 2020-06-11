import prettier from 'prettier';

/**
 * Prettyfies tendered tpl content
 * @param content
 * @param ext
 */
export default (content: string, ext: string) => {
  return prettier.format(content, {
    bracketSpacing: true,
    endOfLine: 'auto',
    semi: true,
    singleQuote: true,
    parser: ext === 'ts' ? 'typescript' : 'babel',
    quoteProps: 'consistent'
  });
};
