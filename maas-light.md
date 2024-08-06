---
layout: code
title: Light Integrations
permalink: /light-integration-and-data-sharing/
menu: main
description: A read only API, containing MDS, GBFS and Zone data
---

# MDS 2.0
This section describes the Mobility Data Specification (MDS) provider API, explained in full on the Open Mobility Foundation's GitHub [v2.0](https://github.com/openmobilityfoundation/mobility-data-specification/blob/release-2.0.0/provider/README.md), [v1.2](https://github.com/openmobilityfoundation/mobility-data-specification/tree/1.2.0/provider).

## Authentication
When setting up the partner agreement with VOI, you will receive an email with a UserID and a link to set a Password, this combination will be used to request the client credentials. 

> A token request.

```shell
$ curl --location https://api.voiapp.io/v1/partner-apis/token \
     -X POST -u USER_ID:PASSWORD \
     --form 'grant_type="client_credentials"'
```

> A token response.

```shell
{
    "access_token": "<access token>",
    "expires_in": 900,
    "token_type": "bearer"
}
```

OAuth 2.0's `client_credentials grant type (outlined in [RFC6749](https://tools.ietf.org/html/rfc6749#section-4.4)) is used as the authentication and authorization scheme.
This is sometimes called a two-legged OAuth.

### HTTPS request

`POST api.voiapp.io/v1/partner-apis/token`

### Usage

The token is required in the header, using Bearer authentication over HTTPS, on all API calls to MDS and GBFS endpoints.

| Key           | Value               |
| ------------- | ------------------- |
| Authorization | Bearer access-token |

## Versioning

The MDS APIs handle requests for specific versions of the specification from the clients.
Version is communicated through the use of a custom media-type, `application/vnd.mds+json;version=2.0`.

See Open Mobility Foundation's MDS description on versioning [here](https://github.com/openmobilityfoundation/mobility-data-specification/blob/dev/general-information.md#versioning).

<aside class="warning">Current MDS 2.0 implementation only supports versions 2.0, for version 1.2 or 0.4 see [here](#MDS 1.2 and 0.4).</aside>

### Header

| Key    | Value                                |
| ------ | ------------------------------------ |
| Accept | application/vnd.mds+json;version=2.0 |


## Trips

> A trips request.

```shell
# v2.0
$ curl -H "Accept: application/vnd.mds+json;version=2.0"
  api.voiapp.io/v1/partner-apis/mds/1/trips?end_time=2024-06-13T10

Do not copy ^ as the zone-ID or Accept might not match yours
```

> A trips response.

```shell
{
    "last_updated": {
        "last_updated": 1722932136606
    },
    "ttl": {
        "ttl": 0
    },
    "version": "2.0.0",
    "trips": [
        {
            "accessibility_attributes": [],
            "device_id": "d48ac4f0-d971-4cd0-be18-9658ebde9c75",
            "distance": 8329,
            "duration": 1652,
            "end_location": {
                "lat": 59.306113,
                "lng": 18.107582
            },
            "end_time": 1718272978417,
            "provider_id": "1f129e3f-158f-4df5-af9c-a80de238e334",
            "start_location": {
                "lat": 59.311543,
                "lng": 18.059523
            },
            "start_time": 1718271326209,
            "trip_id": "95ba3c85-8087-457d-9fed-8469ffb2dad7",
            "trip_type": [
                "rider"
            ]
        }
    ]
}
```


A trip represents a journey taken by a customer with a geo-tagged start and stop point.
The `/trips endpoint allows a user to query historical trip data that happened within the queried hour.

See Open Mobility Foundation's MDS description on trips [v2.0](https://github.com/openmobilityfoundation/mobility-data-specification/blob/release-2.0.0/provider/README.md#trips).

### HTTPS request

`GET api.voiapp.io/v1/partner-apis/mds/{zoneID}/trips`

### Path parameters

| parameter | description                         | presence |
| --------- | ----------------------------------- | -------- |
| zoneID    | The zone id for the requested trips | required |

### Query parameters

| parameter | description                                                                                                                       | presence |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| end_time  | YYYY-MM-DDTHH, an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) extended DateTime representing a UTC hour between 00 and 23. | required |

## Vehicles

> A vehicles request.

```shell
# v2.0
$ curl -H "Accept: application/vnd.mds+json;version=2.0"
  api.voiapp.io/v1/partner-apis/mds/1/vehicles

Do not copy ^ as the zone-ID or Accept might not match yours
```

> A vehicles response.

```shell
{
    "version": "2.0.0",
    "vehicles": [
        {
            "device_id": "703af7e8-ac8c-5543-b2ac-64ef52812d19",
            "maximum_speed": 20,
            "propulsion_types": [
                "electric"
            ],
            "provider_id": "1f129e3f-158f-4df5-af9c-a80de238e334",
            "vehicle_id": "b383",
            "vehicle_type": "scooter_standing"
        },
    ],
    "links": {}
}
```

The status of the inventory of vehicles available for customer use. The `/vehicles` endpoint returns all vehicles in the zone and their type.

See Open Mobility Foundation's MDS description on status changes [v2.0](https://github.com/openmobilityfoundation/mobility-data-specification/blob/release-2.0.0/provider/README.md#vehicles).

### HTTPS request

`GET mds.voiapp.io/en/{zoneID}/vehicles`

### Path parameters

| parameter | description                                  | presence |
| --------- | -------------------------------------------- | -------- |
| zoneID    | The zone id for the requested status changes | required |


## Vehicle Status

> A vehicle status request.

```shell
# v2.0
$ curl -H "Accept: application/vnd.mds+json;version=2.0"
  api.voiapp.io/v1/partner-apis/mds/1/vehicles/status

Do not copy ^ as the zone-ID or Accept might not match yours
```

> A vehicle status response.

```shell
{
    "last_updated": {
        "last_updated": 0
    },
    "ttl": {
        "ttl": 0
    },
    "version": "2.0.0",
    "vehicles_status": [
        {
            "device_id": "6aca5a87-60e9-51eb-8147-c38b58100c83",
            "last_event": {
                "battery_percent": 54,
                "device_id": "6aca5a87-60e9-51eb-8147-c38b58100c83",
                "event_id": "276ced41-0b6d-482a-85b0-84755b7dc97f",
                "event_types": [
                    "trip_end"
                ],
                "location": {
                    "lat": 59.31385,
                    "lng": 18.075726
                },
                "provider_id": "1f129e3f-158f-4df5-af9c-a80de238e334",
                "timestamp": 1722841638075,
                "trip_ids": [
                    "9456de24-eb22-46bb-b8af-b114b29d496e"
                ],
                "vehicle_state": "available"
            },
            "last_telemetry": {
                "battery_percent": 50,
                "device_id": "6aca5a87-60e9-51eb-8147-c38b58100c83",
                "journey_id": null,
                "location": {
                    "lat": 59.31388,
                    "lng": 18.075653
                },
                "provider_id": "1f129e3f-158f-4df5-af9c-a80de238e334",
                "telemetry_id": "926adb5b-45a2-51e3-a9d4-dbd472f50d31",
                "timestamp": 1722932388272,
                "trip_ids": null
            },
            "provider_id": "1f129e3f-158f-4df5-af9c-a80de238e334"
        }
    ]
}
```

The status of the inventory of vehicles available for customer use. The `/vehicles/status` endpoint returns all vehicles in the zone along with their most recent event and telemetry.

See Open Mobility Foundation's MDS description on status changes [v2.0](https://github.com/openmobilityfoundation/mobility-data-specification/blob/release-2.0.0/provider/README.md#vehicle-status).

### HTTPS request

`GET mds.voiapp.io/en/{zoneID}/vehicles/status`

### Path parameters

| parameter | description                                  | presence |
| --------- | -------------------------------------------- | -------- |
| zoneID    | The zone id for the requested status changes | required |


## Events, recent

> A recent events request.

```shell
# v2.0
$ curl -H "Accept: application/vnd.mds+json;version=2.0"
  api.voiapp.io/v1/partner-apis/mds/1/events/recent?start_time=1722931200000&end_time=1722934800000

Do not copy ^ as the zone-ID or Accept might not match yours
```

> A recent events response.

```shell
{
    "last_updated": {
        "last_updated": 1722935579741
    },
    "ttl": {
        "ttl": 0
    },
    "version": "2.0.0",
    "events": [
        {
            "battery_percent": 33,
            "device_id": "1786c844-82e7-5fcd-88cf-e2b0869030d5",
            "event_id": "222117b0-8cbb-4021-9eb7-799522ae9b54",
            "event_types": [
                "trip_start"
            ],
            "location": {
                "lat": 59.33512,
                "lng": 18.067327
            },
            "provider_id": "1f129e3f-158f-4df5-af9c-a80de238e334",
            "timestamp": 1722931201181,
            "trip_ids": [
                "504387ca-ac49-4198-845f-76e508fd5b73"
            ],
            "vehicle_state": "on_trip"
        },
    ],
    "links": {}
}
```

The `/events/recent` endpoint is a near real-time feed of status changes, designed to give access to as recent as possible series of events. The recent endpoint only provides data up to two weeks back in time. For more data, see [Historical events](#events,historical)

The `/events/recent` endpoint functions similarly to `/vehicles/status`.

See Open Mobility Foundation's MDS description of recent events [v2.0](https://github.com/openmobilityfoundation/mobility-data-specification/blob/release-2.0.0/provider/README.md#recent-events).

### HTTPS request

`GET mds.voiapp.io/en/{zoneID}/events/recent`

### Path parameters

| parameter | description                          | presence |
| --------- | ------------------------------------ | -------- |
| zoneID    | The zone id for the requested events | required |

### Query parameters

| parameter  | description                                      | presence |
| ---------- | ------------------------------------------------ | -------- |
| start_time | timestamp, integer milliseconds since Unix epoch | required |
| end_time   | timestamp, integer milliseconds since Unix epoch | required |

## Events, historical

> A recent events request.

```shell
# v2.0
$ curl -H "Accept: application/vnd.mds+json;version=2.0"
  api.voiapp.io/v1/partner-apis/mds/1/events/historical?event_time=2024-06-13T10

Do not copy ^ as the zone-ID or Accept might not match yours
```

> A historical events response.

```shell
{
    "last_updated": {
        "last_updated": 1722935878725
    },
    "ttl": {
        "ttl": 0
    },
    "version": "2.0.0",
    "events": [
        {
            "battery_percent": 84,
            "device_id": "5a90ff25-a0eb-5995-a7e5-dc2f29091cd0",
            "event_id": "5e61f822-46e1-462f-bbbe-9e8e8fd51191",
            "event_types": [
                "trip_start"
            ],
            "location": {
                "lat": 59.314285,
                "lng": 18.063965
            },
            "provider_id": "1f129e3f-158f-4df5-af9c-a80de238e334",
            "timestamp": 1718272800160,
            "trip_ids": [
                "f4249d42-80ae-467c-90cc-8b53bc070054"
            ],
            "vehicle_state": "on_trip"
        },
    ],
    "links": {}
}
```

The `/events/historical` endpoint is a hourly historical version of the `recent` events. It provides data that is older than two weeks (can also query data newer than two weeks) in chunks of one hour.  

See Open Mobility Foundation's MDS description of historical events [v2.0](https://github.com/openmobilityfoundation/mobility-data-specification/blob/release-2.0.0/provider/README.md#events).

### HTTPS request

`GET mds.voiapp.io/en/{zoneID}/events/historical`

### Path parameters

| parameter | description                          | presence |
| --------- | ------------------------------------ | -------- |
| zoneID    | The zone id for the requested events | required |

### Query parameters

| parameter   | description                                                                                                                       | presence |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| event_time  | YYYY-MM-DDTHH, an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) extended DateTime representing a UTC hour between 00 and 23. | required |


# MDS 1.2 and 0.4

This section describes the Mobility Data Specification (MDS) provider API, explained in full on the Open Mobility Foundation's GitHub [v0.4](https://github.com/openmobilityfoundation/mobility-data-specification/tree/0.4.1/provider) and [v1.2](https://github.com/openmobilityfoundation/mobility-data-specification/tree/1.2.0/provider).

## Authentication

> A token request.

```shell
$ curl --location https://mds.voiapp.io/token \
     -X POST -u USER_ID:PASSWORD \
     --form 'grant_type="client_credentials"'
```

> A token response.

```shell
{
    "access_token": "<access token>",
    "expires_in": 900,
    "token_type": "bearer"
}
```

OAuth 2.0's `client_credentials grant type (outlined in [RFC6749](https://tools.ietf.org/html/rfc6749#section-4.4)) is used as the authentication and authorization scheme.
This is sometimes called a two-legged OAuth.

### HTTPS request

`POST mds.voiapp.io/token`

### Usage

The token is required in the header, using Bearer authentication over HTTPS, on all API calls to MDS and GBFS endpoints.

| Key           | Value               |
| ------------- | ------------------- |
| Authorization | Bearer access-token |

## Versioning

The MDS APIs handle requests for specific versions of the specification from the clients.
Version is communicated through the use of a custom media-type, `application/vnd.mds.provider+json` or `application/vnd.mds+json`, combined with a required version parameter.

See Open Mobility Foundation's MDS description on versioning [here](https://github.com/openmobilityfoundation/mobility-data-specification/blob/dev/general-information.md#versioning).

<aside class="warning">Current MDS implementation only supports versions 0.4 and 1.2</aside>

### Header

| Key    | Value                                         |
| ------ | --------------------------------------------- |
| Accept | application/vnd.mds.provider+json;version=0.4 |
| Accept | application/vnd.mds+json;version=1.2          |

## Trips

> A trips request.

```shell
# v0.4
$ curl -H "Accept: application/vnd.mds.provider+json;version=0.4"
  mds.voiapp.io/en/9/trips?end_time=2020-01-01T23

# v1.2
$ curl -H "Accept: application/vnd.mds+json;version=1.2"
  mds.voiapp.io/en/9/trips?end_time=2020-01-01T23

Do not copy ^ as the zone-ID or Accept might not match yours
```

A trip represents a journey taken by a customer with a geo-tagged start and stop point.
The `/trips endpoint allows a user to query historical trip data that happened within the queried hour.

See Open Mobility Foundation's MDS description on trips [v0.4](https://github.com/openmobilityfoundation/mobility-data-specification/tree/0.4.1/provider#trips), [v1.2](https://github.com/openmobilityfoundation/mobility-data-specification/tree/1.2.0/provider#trips).

### HTTPS request

`GET mds.voiapp.io/en/{zoneID}/trips`

### Path parameters

| parameter | description                         | presence |
| --------- | ----------------------------------- | -------- |
| zoneID    | The zone id for the requested trips | required |

### Query parameters

| parameter | description                                                                                                                       | presence |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| end_time  | YYYY-MM-DDTHH, an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) extended DateTime representing a UTC hour between 00 and 23. | required |

## Status Changes

> A status changes request.

```shell
# v0.4
$ curl -H "Accept: application/vnd.mds.provider+json;version=0.4"
  mds.voiapp.io/en/9/status_changes?event_time=2020-01-01T23

# v1.2
$ curl -H "Accept: application/vnd.mds+json;version=1.2"
  mds.voiapp.io/en/9/status_changes?event_time=2020-01-01T23

Do not copy ^ as the zone-ID or Accept might not match yours
```

The status of the inventory of vehicles available for customer use. The `/status_changes` endpoint allows a user to query the historical availability for a system within the queried hour.

See Open Mobility Foundation's MDS description on status changes [v0.4](https://github.com/openmobilityfoundation/mobility-data-specification/tree/0.4.1/provider#status-changes), [v1.2](https://github.com/openmobilityfoundation/mobility-data-specification/tree/1.2.0/provider#status-changes).

### HTTPS request

`GET mds.voiapp.io/en/{zoneID}/status_changes`

### Path parameters

| parameter | description                                  | presence |
| --------- | -------------------------------------------- | -------- |
| zoneID    | The zone id for the requested status changes | required |

### Query parameters

| parameter  | description                                                                                                                       | presence |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| event_time | YYYY-MM-DDTHH, an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) extended DateTime representing a UTC hour between 00 and 23. | required |

## Events

> An events request.

```shell
# v0.4
$ curl -H "Accept: application/vnd.mds.provider+json;version=0.4"
  mds.voiapp.io/en/9/events?start_time=1580518800000&end_time=1581123600000

# v1.2
$ curl -H "Accept: application/vnd.mds+json;version=1.2"
  mds.voiapp.io/en/9/events?start_time=1580518800000&end_time=1581123600000

Do not copy ^ as the zone-ID or Accept might not match yours
```

The `/events` endpoint is a near real-time feed of status changes, designed to give access to as recent as possible series of events.

The `/events` endpoint functions similarly to `/status_changes`, but does not include data older than 2 weeks.

See Open Mobility Foundation's MDS description of events [v0.4](https://github.com/openmobilityfoundation/mobility-data-specification/tree/0.4.1/provider#events), [v1.2](https://github.com/openmobilityfoundation/mobility-data-specification/tree/1.2.0/provider#events).

### HTTPS request

`POST mds.voiapp.io/en/{zoneID}/events`

### Path parameters

| parameter | description                          | presence |
| --------- | ------------------------------------ | -------- |
| zoneID    | The zone id for the requested events | required |

### Query parameters

| parameter  | description                                      | presence |
| ---------- | ------------------------------------------------ | -------- |
| end_time   | timestamp, integer milliseconds since Unix epoch | required |
| start_time | timestamp, integer milliseconds since Unix epoch | required |

## Vehicles

> An vehicles request.

```shell
# v0.4
$ curl -H "Accept: application/vnd.mds.provider+json;version=0.4"
  mds.voiapp.io/en/9/vehicles

# v1.2
$ curl -H "Accept: application/vnd.mds+json;version=1.2"
  mds.voiapp.io/en/9/vehicles

Do not copy ^ as the zone-ID or Accept might not match yours
```

The `/vehicles` endpoint returns the current status of vehicles on the PROW. Only vehicles that are currently in available, unavailable, or reserved states should be returned in this payload.

See Open Mobility Foundation's MDS description of events [v0.4](https://github.com/openmobilityfoundation/mobility-data-specification/tree/0.4.1/provider#vehicles), [v1.2](https://github.com/openmobilityfoundation/mobility-data-specification/tree/1.2.0/provider#vehicles).

### HTTPS request

`GET mds.voiapp.io/en/{zoneID}/vehicles`

### Path parameters

| parameter | description                          | presence |
| --------- | ------------------------------------ | -------- |
| zoneID    | The zone id for the requested events | required |

# GBFS v1

Voi provides a flavored version of the GBFS (The General Bikeshare Feed Specification) API.

Since the vehicles Voi currently provide are considered dockless and since GBFS does not fully support this means of transport, some API endpoints in the GBFS specification doesn’t apply.

Of the GBFS files specified in [here](https://github.com/NABSA/gbfs/blob/master/gbfs.md), Voi supports the following files.

- `gbfs.json`
- `system_information.json`
- `free_bike_status`

### Common response

Every JSON file presented in this specification contains the same common header information at the top level of the JSON response object:

| Field Name     | type    | Defines                                                                                                                          |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `last_updated` | Integer | POSIX timestamp indicating the last time the data in this feed was updated                                                       |
| `ttl`          | Integer | Representing the number of seconds before the data in this feed will be updated again (0 if the data should always be refreshed) |
| `version`      | String  | GBFS version number to which the feed confirms, according to the versioning framework.                                           |
| `data`         | JSON    | JSON hash containing the data fields for this response                                                                           |

## Authentication

Authentication for GBFS is the same as for MDS and is described in the MDS section found [here](#MDS 1.2 and 0.4).

## Free bike status

> A free_bike_status request.

```shell
$ curl --location --request GET mds.voiapp.io/v1/gbfs/1/free_bike_status
"Authorization: Bearer <Bearer token>"

```

> A free_bike_status response.

```shell
{
    "last_updated": 1574954898,
    "ttl": 0,
    "data": {
        "bikes": [
            {
                "bike_id": "0fae06eb-aaaa-0000-cccc-77f696a30000",
                "lat": 48.871983,
                "lon": 2.303089,
                "is_reserved": 1,
                "is_disabled": 0,
            },
            {
                "bike_id": "8c0940ec-aaaa-0000-cccc-3057d9820000",
                "lat": 48.853252,
                "lon": 2.343597,
                "is_reserved": 0,
                "is_disabled": 0,
            }
        ]
    }
}
```

`free_bike_status` describes the available vehicles in real-time. This endpoint comes with the option to extend the response outside the current GBFS standard.

It returns an array of vehicles and their current status per the specification found [here](https://github.com/NABSA/gbfs/blob/master/gbfs.md#free_bike_statusjson).

### Response

The `data:` Payload `{ "bikes": [] }`, is an array of objects with the following structure.

| Field Name    | type    | Defines                                                                                                                                                                                                                                             |
| ------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bike_id`     | String  | Unique identifier of a vehicle                                                                                                                                                                                                                      |
| `lat`         | Number  | Latitude of the bike. The field value must be a valid WGS 84 latitude in decimal degrees format. See: [World Geodetic System](http://en.wikipedia.org/wiki/World_Geodetic_System), [Decimal degrees](https://en.wikipedia.org/wiki/Decimal_degrees) |
| `lon`         | Number  | Longitude of the bike. See `lat` definition.                                                                                                                                                                                                        |
| `is_reserved` | Ìnteger | 1/0 value - is the bike currently reserved for someone else                                                                                                                                                                                         |
| `is_disabled` | Ìnteger | 1/0 value - is the bike currently disabled (broken)                                                                                                                                                                                                 |

### Extension

> A free_bike_status extended request.

```shell
$ curl --location --request GET mds.voiapp.io/v1/gbfs/1/free_bike_status
"Authorization: Bearer <Bearer token>"
  -H "X-Voigbfs-Ext: Battery"
```

> A free_bike_status extended response.

```shell
{
    "last_updated": 1574954898,
    "ttl": 0,
    "data": {
        "bikes": [
            {
                "bike_id": "0fae06eb-aaaa-0000-cccc-77f696a30000",
                "lat": 48.871983,
                "lon": 2.303089,
                "is_reserved": 1,
                "is_disabled": 0,
                "battery": 51
            },
            {
                "bike_id": "8c0940ec-aaaa-0000-cccc-3057d9820000",
                "lat": 48.853252,
                "lon": 2.343597,
                "is_reserved": 0,
                "is_disabled": 0,
                "battery": 59
            }
        ]
    }
}
```

The response from `free_bike_status` can be extended to include a `battery` field describing the state of charge of the battery in each vehicle in the response array.

| Field Name | type    | Defines                           |
| ---------- | ------- | --------------------------------- |
| `battery`  | Integer | The state of charge for a vehicle |

To access this field, add the request header `X-Voigbfs-Ext` with the requested field name header value.

| Key           | Value   |
| ------------- | ------- |
| X-Voigbfs-Ext | Battery |

## Auto-discovery

> A gbfs.json request.

```shell
$ curl --location --request GET mds.voiapp.io/v1/gbfs/gbfs.json
"Authorization: Bearer <Bearer token>"
```

> A gbfs.json response.

```shell
{
    "last_updated": 1574950567,
    "ttl": 0,
    "data": {
        "en": {
            "feeds": [
                {
                    "name": "system_information",
                    "url": "https://mds.voiapp.io/v1/gbfs/en/1/system_information"
                },
                {
                    "name": "free_bike_status",
                    "url": "https://mds.voiapp.io/v1/gbfs/en/1/free_bike_status"
                }
            ]
        }
    }
}
```

`gbfs.json` is an auto-discovery file that links to all of the other files published by the system.

A successful response contains which GBFS endpoints that the user's role can access.

### Response

The following fields are all attributes within the main data object for this feed.

| Field Name | type   | Defines                                                                                                                              |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `language` | String | The language that all of the contained files will be published in. This language must match the value in the system_information file |
| `feeds`    | Array  | An array of all of the feeds that are published by this auto-discovery file                                                          |
| `name`     | String | Key identifying the type of feed this is (e.g. "system_information", "station_information")                                          |
| `url`      | String | Full URL for the feed                                                                                                                |

## System information

The following fields are all the required attributes within the main data object for this feed.

| Field Name  | type   | Defines                                                                                                                                                                                                                                                                                                    |
| ----------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `system_id` | String | The identifier for this system. This is globally unique (even between different systems). Also, this value is intended to remain the same over the life of the system                                                                                                                                      |
| `language`  | String | An IETF language tag indicating the language that will be used throughout the rest of the files. This defines a single language tag only. See [bcp47](https://tools.ietf.org/html/bcp47) and [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) for details about the format of this tag |
| `name`      | String | Full name of the system to be displayed to customers                                                                                                                                                                                                                                                       |
| `timezone`  | String | The time zone where the system is located. Time zone names never contain the space character but may contain an underscore. Please refer to the "TZ" value [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for a list of valid values                                                 |

# GBFS v2

Voi provides a flavored version of the GBFS (The General Bikeshare Feed Specification) API.

Since the vehicles Voi currently provide are considered dockless and since GBFS does not fully support this means of transport, some API endpoints in the GBFS specification doesn’t apply.

Of the GBFS files specified in [here](https://github.com/NABSA/gbfs/blob/v2.2/gbfs.md), Voi supports the following files.

- `gbfs.json`
- `system_information.json`
- `vehicle-types.json`
- `system_pricing_plans.json`
- `system_regions.json`
- `free_bike_status.json`

### Common response

Every JSON file presented in this specification contains the same common header information at the top level of the JSON response object:

| Field Name     | type    | Defines                                                                                                                          |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `last_updated` | Integer | POSIX timestamp indicating the last time the data in this feed was updated                                                       |
| `ttl`          | Integer | Representing the number of seconds before the data in this feed will be updated again (0 if the data should always be refreshed) |
| `version`      | String  | GBFS version number to which the feed confirms, according to the versioning framework.                                           |
| `data`         | JSON    | JSON hash containing the data fields for this response                                                                           |

### Authentication

Authentication for GBFS is the same as for MDS and is described in the MDS section found [here](#mds).

## Auto-discovery

> A gbfs.json request.

```shell
$ curl --location --request GET api.voiapp.io/gbfs/v2/gbfs.json
"Authorization: Bearer <Bearer token>"
```

> A gbfs.json response.

```shell
{
    "last_updated": 1623912196,
    "ttl": 0,
    "version": "2.2",
    "data": {
        "en": {
            "feeds": [
                {
                    "name": "gbfs",
                    "url": "https://api.voiapp.io/gbfs/gbfs.json"
                },
                {
                    "name": "system_information",
                    "url": "https://api.voiapp.io/gbfs/v2/system_information.json"
                },
                {
                    "name": "vehicle_types",
                    "url": "https://api.voiapp.io/gbfs/v2/vehicle_types.json"
                },
                {
                    "name": "gbfs_versions",
                    "url": "https://api.voiapp.io/gbfs/v2/gbfs_versions.json"
                },
                {
                    "name": "system_alerts",
                    "url": "https://api.voiapp.io/gbfs/v2/system_alerts.json"
                },
                {
                    "name": "system_pricing_plans",
                    "url": "https://api.voiapp.io/gbfs/v2/system_pricing_plans.json"
                },
                {
                    "name": "system_regions",
                    "url": "https://api.voiapp.io/gbfs/v2/system_regions.json"
                },
                {
                    "name": "free_bike_status",
                    "url": "https://api.voiapp.io/gbfs/v2/free_bike_status.json"
                }
            ]
        }
    }
}
```

`gbfs.json` is an auto-discovery file that links to all of the other files published by the system.

A successful response contains which GBFS endpoints that the user's role can access.

### Response

The following fields are all attributes within the main data object for this feed.

| Field Name | type   | Defines                                                                                                                              |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `language` | String | The language that all of the contained files will be published in. This language must match the value in the system_information file |
| `feeds`    | Array  | An array of all of the feeds that are published by this auto-discovery file                                                          |
| `name`     | String | Key identifying the type of feed this is (e.g. "system_information", "station_information")                                          |
| `url`      | String | Full URL for the feed                                                                                                                |

## Vehicle Types

> A Vehicle Types request.

```shell
$curl --location --request GET api.voiapp.io/gbfs/v2/vehicle_types.json
"Authorization: Bearer <Bearer token>"
```

`vehicle_types` describes traits of our different vehicles

### Response

The `data:` Payload `{ "vehicle_types": [] }`, is an array of objects with the following structure.

| Field Name         | type   | Defines                                                                          |
| ------------------ | ------ | -------------------------------------------------------------------------------- |
| `vehicle_type_id`  | String | Unique identifier of a vehicle type                                              |
| `form_factor`      | String | The vehicle's general form factor e.g. `scooter` or `bicycle`                    |
| `propulsion_type`  | String | The primary propuslion type of the vehicle, e.g. `electric` or `electric_assist` |
| `name`             | String | Public name of relevant vehicle type                                             |
| `max_range_meters` | Number | If engine-driven, furthest travel distance before it needs to be recharged       |

## Free Bike Status

> A free_bike_status request.

```shell
$ curl --location --request GET api.voiapp.io/gbfs/v2/free_bike_status.json
"Authorization: Bearer <Bearer token>"
```

> A free_bike_status response.

```shell
{
    "last_updated": 1574954898,
    "ttl": 0,
    "data": {
        "bikes": [
            {
                "bike_id": "0fae06eb-aaaa-0000-cccc-77f696a30000",
                "last_reported": 1629273261,
                "lat": 48.871983,
                "lon": 2.303089,
                "is_reserved": true,
                "is_disabled": false,
                "vehicle_type_id": "voi_scooter",
                "current_range_meters": 17750,
                "pricing_plan_id": "plan-scooter-1",
                "rental_uris": {
                    "android": "https://lqfa.adj.st/open?adj_t=b2hnabv&adj_deep_link=voiapp%3A%2F%2Fopen&adj_campaign=all_all_general-bikeshare-feed-specification_all_all_voiapp.io_all_central_all__",
                    "ios": "https://lqfa.adj.st/closest_vehicle?adj_t=b2hnabv&adj_deep_link=voiapp%3A%2F%2Fclosest_vehicle&adj_campaign=all_all_general-bikeshare-feed-specification_all_all_voiapp.io_all_central_all__"
                }
            },
            {
                "bike_id": "8c0940ec-aaaa-0000-cccc-3057d9820000",
                "last_reported": 1629273261,
                "lat": 48.853252,
                "lon": 2.343597,
                "is_reserved": false,
                "is_disabled": false,
                "vehicle_type_id": "voi_scooter",
                "current_range_meters": 20250,
                "pricing_plan_id": "plan-scooter-1",
                "rental_uris": {
                    "android": "https://lqfa.adj.st/open?adj_t=b2hnabv&adj_deep_link=voiapp%3A%2F%2Fopen&adj_campaign=all_all_general-bikeshare-feed-specification_all_all_voiapp.io_all_central_all__",
                    "ios": "https://lqfa.adj.st/closest_vehicle?adj_t=b2hnabv&adj_deep_link=voiapp%3A%2F%2Fclosest_vehicle&adj_campaign=all_all_general-bikeshare-feed-specification_all_all_voiapp.io_all_central_all__"
                }
            },
```

`free_bike_status` describes the available vehicles in real-time.

It returns an array of vehicles and their current status per the specification found [here](https://github.com/NABSA/gbfs/blob/v2.2/gbfs.md#free_bike_statusjson).

### Response

The `data:` Payload `{ "bikes": [] }`, is an array of objects with the following structure.

| Field Name             | type    | Defines                                                                                                                                                                                                                                             |
| ---------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bike_id`              | String  | Unique identifier of a vehicle                                                                                                                                                                                                                      |
| `lat`                  | Number  | Latitude of the bike. The field value must be a valid WGS 84 latitude in decimal degrees format. See: [World Geodetic System](http://en.wikipedia.org/wiki/World_Geodetic_System), [Decimal degrees](https://en.wikipedia.org/wiki/Decimal_degrees) |
| `lon`                  | Number  | Longitude of the bike. See `lat` definition.                                                                                                                                                                                                        |
| `is_reserved`          | Ìnteger | True/False value - is the bike currently reserved for someone else                                                                                                                                                                                  |
| `is_disabled`          | Ìnteger | True/False value - is the bike currently disabled (broken)                                                                                                                                                                                          |
| `vehicle_type_id`      | String  | Vehicle type. Scooter or E-bike                                                                                                                                                                                                                     |
| `current_range_meters` | Number  | Furthest possible travel distance before the vehicle needs to be charged.                                                                                                                                                                           |
| `pricing_plan_id`      | String  | The relevant pricing plan ID for the vehicle.                                                                                                                                                                                                       |
| `rental uris`          | String  | Rental URIs for Android, iOS, and web in the android, ios, and web fields.                                                                                                                                                                          |

## System Regions

> A System Regions request.

```shell
$ curl --location --request GET api.voiapp.io/gbfs/v2/system_regions.json
"Authorization: Bearer <Bearer token>"
```

`system_regions.json` gives information about what region(s)/zone(s) that you have access to

### Response

The `data:` Payload `{ "Regions": [] }`, is an array of objects with the following structure.

| Field Name  | type   | Defines                      |
| ----------- | ------ | ---------------------------- |
| `name`      | String | Name of region/zone          |
| `region_id` | Number | Unique ID of the region/zone |

## Geofencing Zones

> A geofencing_zones.json request.

```shell
$ curl --location --request GET api.voiapp.io/gbfs/v2/geofencing_zones.json
"Authorization: Bearer <Bearer token>"
```

```shell
{
    "last_updated": 1629449078,
    "ttl": 0,
    "version": "2.2",
    "data": {
        "geofencing_zones": {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "coordinates": [
                            [
                                [
                                    [
                                        24.875300734352997,
                                        60.19677933939972
                                    ],
                                    [
                                        24.876078184389293,
                                        60.196571432148964
                                    ],
                                    [
                                        24.87618605249522,
                                        60.196363399088206
                                    ],
                                    [
                                        24.87612938343937,
                                        60.196150842370635
                                    ],
                                    [
                                        24.876268792954143,
                                        60.19603585542455
                                    ],
                                    [
                                        24.875936651214566,
                                        60.195825393537206
                                    ],
                                    [
                                        24.87535786580092,
                                        60.19587858148064
                                    ],
                                    [
                                        24.87417440192842,
                                        60.196221845407074
                                    ],
                                    [
                                        24.87424014658589,
                                        60.1962826561851
                                    ],
                                    [
                                        24.874309465537962,
                                        60.196509407109204
                                    ],
                                    [
                                        24.87445114116146,
                                        60.19664629043662
                                    ],
                                    [
                                        24.874682265477432,
                                        60.196743969755794
                                    ],
                                    [
                                        24.874975995084554,
                                        60.19678359902475
                                    ],
                                    [
                                        24.875300734352997,
                                        60.19677933939972
                                    ]
                                ]
                            ]
                        ],
                        "type": "MultiPolygon"
                    },
                    "properties": {
                        "name": "Helsinki - Munkka NRZ",
                        "rules": [
                            {
                                "vehicle_type_id": [
                                    "voi_scooter"
                                ],
                                "ride_allowed": false,
                                "ride_through_allowed": false,
                                "maximum_speed_kph": 25
                            }
                        ]
                    }
                }
```

`geofencing_zones.json` gives you information about area zones inside relevant regions.

| Field Name             | type    | Defines                                                                           |
| ---------------------- | ------- | --------------------------------------------------------------------------------- |
| `name`                 | String  | Name of specific zone                                                             |
| `rules`                | String  | contains the different rules in the zone                                          |
| `vehicle_type_id`      | String  | Unique identifyer of a vehicle type, type of accessible vehicles in specific zone |
| `ride_allowed`         | Integer | True/False - Is the ride allowed to start and end in this area?                   |
| `ride_through_allowed` | Integer | True/False - Are users allowed to ride through the area?                          |
| `maximum_speed_kph`    | Number  | The maximum speed allowed in the zone, kilometers per hour                        |

Each operational zone operates with either mandatory parking spots or a free-floating fleet. That means a zone can only have either no-parking or parking-spot zone areas, never both.

## System requests

### System Pricing Plans

> A System Pricing Plans request.

```shell
$ curl --location --request GET api.voiapp.io/gbfs/v2/system_pricing_plans.json
"Authorization: Bearer <Bearer token>"
```

`system_pricing_plans` describes the current available pricing plans.

### Response

The `data:` Payload `{ "Plans": [] }`, is an array of objects with the following structure.

| Field Name        | type    | Defines                                     |
| ----------------- | ------- | ------------------------------------------- |
| `plan_id`         | String  | Identifier for a pricing plan in the system |
| `name`            | String  | Name of pricing plan                        |
| `currency`        | String  | Type of currency used in the pricing plan   |
| `price`           | Number  | Fee to start ride                           |
| `is_taxable`      | integer | True/False                                  |
| `description`     | String  | Clarification for pricing plan              |
| `per_min_pricing` | Number  | Includes start, rate and interval price     |

### System Information

> A System Information request.

```shell
$ curl --location --request GET api.voiapp.io/gbfs/v2/system_information.json
"Authorization: Bearer <Bearer token>"
```

`system_information`, details regarding the relevant system

### Response

The following fields are all attributes within the main data object for this feed.

| Field Name    | type   | Defines                                                                                                                                                                                                                                                                                                    |
| ------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `system_id`   | String | The identifier for this system. This is globally unique (even between different systems). Also, this value is intended to remain the same over the life of the system                                                                                                                                      |
| `language`    | String | An IETF language tag indicating the language that will be used throughout the rest of the files. This defines a single language tag only. See [bcp47](https://tools.ietf.org/html/bcp47) and [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) for details about the format of this tag |
| `name`        | String | Full name of the system to be displayed to customers                                                                                                                                                                                                                                                       |
| `timezone`    | String | The time zone where the system is located. Time zone names never contain the space character but may contain an underscore. Please refer to the "TZ" value [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for a list of valid                                                        |
| `email`       | String | Voi's support email                                                                                                                                                                                                                                                                                        |
| `url`         | String | Voi's official website                                                                                                                                                                                                                                                                                     |
| `rental_apps` | String | Information about access to the voiapp, android and ios                                                                                                                                                                                                                                                    |
