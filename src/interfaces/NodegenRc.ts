export interface Helpers {
  publishOpIds?: string[];
  subscribeOpIds?: string[];

  [helperName: string]: any;
}

export interface Injection {
  destination?: string;
  source: string;
}

export interface NodegenRc {
  nodegenDir: string;
  nodegenMockDir?: string;
  nodegenType: string;
  interfaceStyle?: string;
  segmentFirstGrouping?: number;
  segmentSecondGrouping?: number;
  helpers?: Helpers;
  injections?: Injection[];
  /**
   * Let the template project decides what files should be ignored.
   * This will be evaluated as a regex.
   *
   * For example, the `build` term is ignored by default, but if you have a
   * Gradle project the `gradle.build` your project will need it.
   */
  ignoreFiles?: string | string[];
  /**
   * Defines the extension that should be processed as a template.
   *
   * For example:
   *  renderOnlyExt: '.njk'
   */
  renderOnlyExt?: string;
  /**
   * Let the template project decides if it should run prettier.
   */
  dontPrettify?: boolean;
  /**
   * Extra options to pass to quicktype when generating types.
   * NOTE: Defaults like 'acronym-style' and 'just-types' are not overridable.
   *
   * Example, use unions instead of enums in TypeScript: {
   *   'prefer-unions': true
   * }
   */
  quickTypeOptions?: Record<string, string>;
  /**
   * Allows you to specify your own schema to types generator.
   * In case nothing is specified here, the default type generator (QuickType) will be used instead.
   *
   * Examples: "./schema-to-typescript.js", "generate-it-typegen-spec2ts"
   */
   typegen?: string;
}
