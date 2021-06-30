/**
 * Converts a multi-line string to a single line.
 */
export interface OASpec {
  basePath?: string;
  servers?: { url: string; }[];
}

export const parseBaseUrl = (url: string) => {
  if (url.indexOf('//') === 0) {
    url = `http:${url}`;
  }

  if (url.indexOf('/') === 0) {
    return url;
  } else {
    try {
      return new URL(url).pathname;
    } catch (e) {
      console.error(e, url);
    }
  }

  return '/';
};

export default (spec?: OASpec): string => {
  if (spec?.basePath) {
    return spec?.basePath;
  }

  if (spec?.servers?.length) {
    // tslint:disable-next-line:no-null-keyword
    let commonBasePath: string = null;

    for (const { url } of spec.servers) {
      const parsed = parseBaseUrl(url);

      if (commonBasePath === null) {
        commonBasePath = parsed;
      } else if (commonBasePath !== parsed) {
        return '/';
      }
    }

    return commonBasePath;
  }

  return '/';
};
