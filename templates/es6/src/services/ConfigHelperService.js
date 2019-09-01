class ConfigHelperService {
  /**
   * Ensures that the given string representation of the envVar exists.
   * @param environmentVariable
   * @returns {string | any}
   */
  required (environmentVariable) {
    const value = process.env[environmentVariable]
    if (!value) {
      console.error(`
Required environment variable ${environmentVariable} is not defined.

During development, you can configure all environment variables by
placing an .env file into the project root, with lines of the form
VARIABE=VALUE. You can use the provived .env-example as a template.
`)
      process.exit(1)
    }
    return value
  }

  /**
   * Ensures the env variable is set, else defaults to a provided default
   * @param environmentVariable
   * @param defaultValue
   * @returns {string | any | *}
   */
  withDefault (environmentVariable, defaultValue) {
    return process.env[environmentVariable] || defaultValue
  }
}

export default new ConfigHelperService()
