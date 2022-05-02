/*
Decoder documentation:
https://www.melita.io/api-documentation/
*/

const { MELITA_API_URL, AUTHENTICATION_API_KEY } = require('../config/config')
const qs = require('querystring')
const fetch = require('node-fetch')

const getAuthToken = async () => {
  let res = await fetch(`${MELITA_API_URL}/auth/generate`, {
    method: 'POST',
    headers: {
      ApiKey: AUTHENTICATION_API_KEY,
    },
  })
  if (res.ok) {
    let json = await res.json()
    return json.authToken
  } else return false
}
/*
createDevice	device	post
getDevices	devices	get
getProfiles	profiles	get
createProfile	profiles	post
getDeviceProfile	profiles/:profileId	get
createContractUrl	url/:contractId	post
deleteContractUrl	url/contractId	delete
updateDeviceLabel	:deviceEUI/:label	put
getContractDevice	:deviceEUI	get
updateDeviceProfile	:deviceEUI	put
removeDevice	:deviceEUI	delete
getDeviceApiKey	/:deviceEUI/appKey	get
getDeviceQueue	/:deviceEUI/queue	get
addDownlinkDeviceQueue	/:deviceEUI/queue	post
flushDeviceQueue	/:deviceEUI/queue	delete
suspendResumeDevice	/:deviceEUI/status	post
getDeviceUsage	/:deviceEUI/usage	get

*/
const processCommand = async json => {
  const authToken = await getAuthToken()
  if (authToken === false) return false
  // device not specified
  let method = null
  let path = null
  let command = json.command.name
  let params = json.command.params
  let deviceEUI = json.command.deviceEUI
  switch (command) {
    case 'createDevice':
      method = 'POST'
      path = '/device'
      break
    case 'getDevices':
      method = 'GET'
      path = '/devices'
      break
    case 'getProfiles':
      method = 'GET'
      path = '/profiles'
      break
    case 'createProfile':
      method = 'POST'
      path = '/profiles'
      break
    case 'getDeviceProfile':
      method = 'GET'
      path = `/profiles/${params.profileId}`
      break
    case 'createContractUrl':
      method = 'POST'
      path = `/url/${params.contractId}`
      break
    case 'deleteContractUrl':
      method = 'DELETE'
      path = `/url/${params.contractId}`
      break
    case 'updateDeviceLabel':
      method = 'PUT'
      path = `/${deviceEUI}/${params.label}`
      break
    case 'getContractDevice':
      method = 'GET'
      path = `/${deviceEUI}`
      break
    case 'updateDeviceProfile':
      method = 'PUT'
      path = `/${deviceEUI}`
      break
    case 'removeDevice':
      method = 'DELETE'
      path = `/${deviceEUI}`
      break
    case 'getDeviceApiKey':
      method = 'GET'
      path = `/${deviceEUI}/appKey`
      break
    case 'getDeviceQueue':
      method = 'GET'
      path = `/${deviceEUI}/queue`
      break
    case 'addDownlinkDeviceQueue':
      method = 'POST'
      path = `/${deviceEUI}/queue`
      break
    case 'flushDeviceQueue':
      method = 'DELETE'
      path = `/${deviceEUI}/queue`
      break
    case 'suspendResumeDevice':
      method = 'POST'
      path = `/${deviceEUI}/status`
      break
    case 'getDeviceUsage':
      method = 'GET'
      path = `/${deviceEUI}/usage`
      break
  }
  if (method === null) return false
  let q_params = ''
  if (method === 'GET') q_params = `?${qs.stringify(params)}`
  let res = await fetch(`${MELITA_API_URL}/lorawan${path}${q_params}`, {
    method: method,
    headers: {
      Authorization: `Bearer ${authToken}`,
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: method !== 'GET' ? JSON.stringify(params) : null,
  })
  if (res.ok) {
    return await res.json()
  } else {
    let err = await res.json()
    return {
      status: false,
      data: err.error,
    }
  }
}
module.exports = {
  getAuthToken,
  processCommand,
}
