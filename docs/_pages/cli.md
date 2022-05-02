This tool is primarily designed to be used over command line.

Here are the available options:
```
Usage: generate-it [options] <swaggerFile>

Options:
  -V, --version                       output the version number
  -m, --mocked                        If passed, the domains will be configured to return dummy content.
  -o, --output <outputDir>            directory where to put the rabbitMQ files (defaults to current directory) (default: "$PWD/tmp/generate-it")
  -t, --template <path>               Full URL to a public git repo, eg github
  --dont-update-tpl-cache             If the given git url is already cached does not attempt to update (default: false)
  --dont-run-comparison-tool          Skips the stub file comparison tool and version cleanup (default: false)
  -u, --update-dependencies-from-tpl  Run the npm install scripts inline with the tpl package.json opposed to displaying for manual update (default: false)
  --segment-first-grouping <number>   If set will split a domain by group the 1 qty of segments defined in this setting, see endpointNameCalculation.ts
  --segment-second-grouping <number>  Assuming the 1st grouping is set, this will group the 2nd group into another 2 groups, see endpointNameCalculation.ts
  -$, --variables [value]             Array of variables to pass to the templates, eg "-$ httpLibImportStr=@/services/HttpService -$ apikey=321654987" (default: {})
  -v, --verbose                       Outputs verbose logging
  --very-verbose                      Outputs very verbose logging
  -y, --yes                           Assumes yes to any questions prompted by the tool. If marked yes we assume you know what you are doing and know the nodegenDir will be rewritten
  --render-only-ext <extension>       Defines which extension should be processed. If none is informed all files will be processed
  --dont-prettify                     Defines if should ignore prettier after generate the source (default: false)
  -h, --help                          display help for command
```

To inject many variables into a template just add many -$:
```
generate-it ./ms-item-d_1.0.0.yml -t https://github.com/acr-lfr/generate-it-typescript-client-to-server -$ core=123 -$ other=987
```
