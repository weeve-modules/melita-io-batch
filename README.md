# Melita IO

|                |                                  |
| -------------- | -------------------------------- |
| Name           | Melita IO Batch                  |
| Version        | v1.0.0                           |
| Dockerhub Link | [weevenetwork/melita-io-batch]() |
| Authors        | Mesud Pasic                      |

- [MQTT Ingress](#melita-io-batch)
  - [Description](#description)
  - [Features](#features)
  - [Environment Variables](#environment-variables)
    - [Module Specific](#module-specific)
    - [Set by the weeve Agent on the edge-node](#set-by-the-weeve-agent-on-the-edge-node)
  - [Dependencies](#dependencies)

## Description

Melita.IO API module.

## Features

- Parsing Melita.io data for thermostat
- Sends data to next module service via REST API

## Environment Variables

- INGRESS_HOST
- INGRESS_PORT
- EXECUTE_SINGLE_COMMAND
- SINGLE_COMMAND
- DEVICE_EUI_LIST

### Module Specific

### Set by the weeve Agent on the edge-node

| Environment Variables | type | Description |
| --- | --- | --- |
| MODULE_NAME | string | Name of the module |
| INGRESS_HOST | string | Host where app is running |
| INGRESS_PORT | string | Port where app is running |
| EXECUTE_SINGLE_COMMAND | string | yes/no to specify if module supports only executing single command |
| SINGLE_COMMAND | string | if EXECUTE_SINGLE_COMMAND=no, then users will have to provide in request "command" parameter with command name |
| MELITA_API_URL | string | Melita.io API URL |
| AUTHENTICATION_API_KEY | string | API key for authentication |
| ERROR_URL | string | URL for passing errors during request to melita.io API |
| DEVICE_EUI_LIST | string | List of device EUIs seperated by comma |

## Available custom commands

- createDevice
- getDevices
- getProfiles
- createProfile
- getDeviceProfile
- createContractUrl
- deleteContractUrl
- updateDeviceLabel
- getContractDevice
- updateDeviceProfile
- removeDevice
- getDeviceApiKey
- getDeviceQueue
- addDownlinkDeviceQueue
- flushDeviceQueue
- suspendResumeDevice
- getDeviceUsage

## Payload for POST request looks like, depending on the command, params can be different, but deviceEUI needs to be passed always

```js
{
	"data":{
		"command": {
			"name": "addDownlinkDeviceQueue",
			"params": {
					"confirmed": true,
					"data": "14161712131819151B22",
					"devEUI": "70B3D52DD3003E30",
					"fPort": 1
			}
		}
	}
}
```

- If command is successful output is array of results, passed to other module or returned in response as:

```js
{
	"status": true,
	"data": [
		{
			"deviceEUI": "70B3D52DD3003E30",
			"status": true,
			"data": {
				"fCnt": 58
			}
		},
		{
			"deviceEUI": "70B3D52DD3003E30",
			"status": true,
			"data": {
				"fCnt": 59
			}
		}
	]
}
```

- In the case of bad input or error, response is array of results, passed to ERROR_URL if specified or returned in response as:

```js
{
	"status": true,
	"data": [
		{
			"deviceEUI": "70B3D52DD3003E30",
			"data": {
				"status": false,
				"data": {
					"httpStatus": "BAD_REQUEST",
					"timestamp": "12-04-2022 12:07:18",
					"message": "illegal base64 data at input byte 20"
				}
			}
		},
		{
			"deviceEUI": "70B3D52DD3003E30",
			"data": {
				"status": false,
				"data": {
					"httpStatus": "BAD_REQUEST",
					"timestamp": "12-04-2022 12:07:22",
					"message": "illegal base64 data at input byte 20"
				}
			}
		}
	]
}
```

## Dependencies

```js
"dependencies": {
    "body-parser": "^1.19.2",
    "express": "^4.17.3",
    "express-winston": "^4.2.0",
    "node-fetch": "^2.6.1",
    "winston": "^3.6.0"
}
```
