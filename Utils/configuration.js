const path = require('path')
const Yaml = require('yamljs')

const moduleConfigFile = path.resolve(path.dirname(require.main.filename), 'module.yml')
const moduleConfig = Yaml.load(moduleConfigFile)

function getAllConfig () {
  return moduleConfig
}

function getConfigField (field) {
  const configFields = moduleConfig.config.filter(x => x.name == field)
  if (configFields.length == 0) {
    throw 'Configuration error, Please check module.yml'
  }
  return configFields[0].fields
}

function getFieldDefaultValue (field, name) {
  return getConfigField(field).filter(x => x.name == name)[0].default
}

module.exports = {
  getAllConfig,
  getConfigField,
  getFieldDefaultValue
}
