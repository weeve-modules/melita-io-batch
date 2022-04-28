const env = require('../utils/env')

module.exports = {
  INGRESS_HOST: env('INGRESS_HOST', '127.0.0.1'),
  INGRESS_PORT: env('INGRESS_PORT', '8080'),
  MODULE_NAME: env('MODULE_NAME', 'melita-io-batch'),
  EGRESS_URL: env('EGRESS_URL', ''),
  EXECUTE_SINGLE_COMMAND: env('EXECUTE_SINGLE_COMMAND', 'no'),
  SINGLE_COMMAND: env('SINGLE_COMMAND', 'addDownlinkDeviceQueue'),
  AUTHENTICATION_API_KEY: env('AUTHENTICATION_API_KEY', ''),
  ERROR_URL: env('ERROR_URL', ''),
  MELITA_API_URL: env('MELITA_API_URL', 'https://www.melita.io/api/iot-gateway'),
  DEVICE_EUI_LIST: env('DEVICE_EUI_LIST', '70B3D52DD3003xxx,70B3D52DD3003xxx'),
}
