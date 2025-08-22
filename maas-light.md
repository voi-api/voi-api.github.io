---
layout: code
title: Light Integrations
permalink: /light-integration-and-data-sharing/
menu: main
description: A read only API, containing MDS, GBFS and Zone data
---

# MDS 2.0
This section describes the Mobility Data Specification (MDS) provider API, explained in full on the Open Mobility Foundation's GitHub [v2.0](https://github.com/openmobilityfoundation/mobility-data-specification/blob/release-2.0.0/provider/README.md).

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

<aside class="warning">Current MDS 2.0 implementation only supports versions 2.0, for version 1.2 or 0.4 see [here](#mds-12-and-04).</aside>

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
# v2.0 - All vehicles
$ curl -H "Accept: application/vnd.mds+json;version=2.0"
  api.voiapp.io/v1/partner-apis/mds/1/vehicles

# V2.0 - Single device
$ curl -H "Accept: application/vnd.mds+json;version=2.0"
  api.voiapp.io/v1/partner-apis/mds/1/vehicles/703af7e8-ac8c-5543-b2ac-64ef52812d19

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

To fetch all vehicles in a zoneID
`GET api.voiapp.io/v1/partner-apis/mds/{zoneID}/vehicles`

Optionally to fetch the status of a single device
`GET api.voiapp.io/v1/partner-apis/mds/{zoneID}/vehicles/{deviceID}`

### Path parameters

| parameter | description                                  | presence |
| --------- | -------------------------------------------- | -------- |
| zoneID    | The zone id for the requested status changes | required |
| deviceID  | A specific deviceID to request               | optional |


## Vehicle Status

> A vehicle status request.

```shell
# v2.0 - All vehicles
$ curl -H "Accept: application/vnd.mds+json;version=2.0"
  api.voiapp.io/v1/partner-apis/mds/1/vehicles/status

# v2.0 - Single device 
$ curl -H "Accept: application/vnd.mds+json;version=2.0"
  api.voiapp.io/v1/partner-apis/mds/1/vehicles/status/6aca5a87-60e9-51eb-8147-c38b58100c83

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

To fetch all vehicles in a zoneID
`GET api.voiapp.io/v1/partner-apis/mds/{zoneID}/vehicles/status`

Optionally to fetch the status of a single device
`GET api.voiapp.io/v1/partner-apis/mds/{zoneID}/vehicles/status/{deviceID}`

### Path parameters

| parameter | description                                  | presence |
| --------- | -------------------------------------------- | -------- |
| zoneID    | The zone id for the requested status changes | required |
| deviceID  | A specific deviceID to request               | optional |

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

The `/events/recent` endpoint is a near real-time feed of status changes, designed to give access to as recent as possible series of events. The recent endpoint only provides data up to two weeks back in time. For more data, see [Historical events](#events-historical)

The `/events/recent` endpoint functions similarly to `/vehicles/status`.

See Open Mobility Foundation's MDS description of recent events [v2.0](https://github.com/openmobilityfoundation/mobility-data-specification/blob/release-2.0.0/provider/README.md#recent-events).

### HTTPS request

`GET api.voiapp.io/v1/partner-apis/mds/{zoneID}/events/recent`

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

`GET api.voiapp.io/v1/partner-apis/mds/{zoneID}/events/historical`

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


# GBFS v2.3

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

Authentication for GBFS is the same as for MDS and is described in the MDS section found [here](#mds-20).

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


# GBFS v3.0

Voi supports the GBFS v3.0 API.

Of the GBFS files specified in [here](https://github.com/MobilityData/gbfs/blob/v3.0/gbfs.md), Voi supports the following files.

- `gbfs.json`
- `vehicle_types.json`
- `vehicle_status.json`
- `station_status.json`
- `station_information.json`
- `system_information.json`
- `system_pricing_plans.json`
- `geofencing_zones.json`
- `system_alerts.json` (Not used)
- `system_regions.json` (Not used)


### Common response

Every JSON file presented in this specification contains the same common header information at the top level of the JSON response object:

| Field Name     | type    | Defines                                                                                                                          |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `last_updated` | Integer | POSIX timestamp indicating the last time the data in this feed was updated                                                       |
| `ttl`          | Integer | Representing the number of seconds before the data in this feed will be updated again (0 if the data should always be refreshed) |
| `version`      | String  | GBFS version number to which the feed confirms, according to the versioning framework.                                           |
| `data`         | JSON    | JSON hash containing the data fields for this response                                                                           |

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



## Auto-discovery

> A gbfs.json request.

```shell
$ curl --location --request GET https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/gbfs.json
"Authorization: Bearer <Bearer token>"
```

### Path parameters

| parameter | description                                  | presence |
| --------- | -------------------------------------------- | -------- |
| zoneID    | The zone id for the requested status changes | required |

> A gbfs.json response.

```shell
{
    "data": {
        "feeds": [
            {
                "name": "gbfs_versions",
                "url": "https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/gbfs_versions.json"
            },
            {
                "name": "system_information",
                "url": "https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/system_information.json"
            },
            {
                "name": "vehicle_types",
                "url": "https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/vehicle_types.json"
            },
            {
                "name": "station_information",
                "url": "https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/station_information.json"
            },
            {
                "name": "station_status",
                "url": "https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/station_status.json"
            },
            {
                "name": "vehicle_status",
                "url": "https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/vehicle_status.json"
            },
            {
                "name": "system_regions",
                "url": "https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/system_regions.json"
            },
            {
                "name": "system_pricing_plans",
                "url": "https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/system_pricing_plans.json"
            },
            {
                "name": "system_alerts",
                "url": "https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/system_alerts.json"
            },
            {
                "name": "geofencing_zones",
                "url": "https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/geofencing_zones.json"
            }
        ]
    },
    "last_updated": "2025-02-17T12:52:04Z",
    "ttl": 3600,
    "version": "3.0"
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
$ curl --location --request GET https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/vehicle_types.json
"Authorization: Bearer <Bearer token>"
```

### Path parameters

| parameter | description                                  | presence |
| --------- | -------------------------------------------- | -------- |
| zoneID    | The zone id for the requested status changes | required |



> A vehicle_types.json response.

```shell
{
    "data": {
        "vehicle_types": [
            {
                "color": "coral",
                "default_pricing_plan_id": "scooter-pricing-plan-1",
                "default_reserve_time": 10,
                "description": [],
                "eco_labels": [],
                "form_factor": "scooter_standing",
                "make": [
                    {
                        "language": "en",
                        "text": "Ninebot"
                    }
                ],
                "max_permitted_speed": 20,
                "max_range_meters": 80000,
                "model": [
                    {
                        "language": "en",
                        "text": "Voiager_5"
                    }
                ],
                "name": [
                    {
                        "language": "en",
                        "text": "Voiager_5"
                    }
                ],
                "pricing_plan_ids": [
                    "scooter-pricing-plan-1"
                ],
                "propulsion_type": "electric",
                "rated_power": 250,
                "return_constraint": "hybrid",
                "rider_capacity": 1,
                "vehicle_assets": {
                    "icon_last_modified": "2024-01-01",
                    "icon_url": "https://docs.voi.com/assets/images/icons/scooter.svg"
                },
                "vehicle_type_id": "172ef7a6-ee84-4320-9337-86235f2f67ac",
                "wheel_count": 2
            }
        ]
    },
    "last_updated": "2025-02-17T12:58:33Z",
    "ttl": 30,
    "version": "3.0"
}
```

`vehicle_types` describes traits of our different vehicles

### Response

The `data:` Payload `{ "vehicle_types": [] }`, is an array of objects with the following structure.

| Field Name                  | type   | Defines                                                                          |
| --------------------------- | ------ | -------------------------------------------------------------------------------- |
| `vehicle_type_id`           | String | Unique identifier of a vehicle type                                              |
| `color`                     | String | Color of the vehicle                                                             |
| `default_pricing_plan_id`   | String | Default pricing plan ID for this vehicle (see system_pricing_plans.json)         |
| `default_reserve_time`      | Number | Default reservation (booking) time in minutes                                    |
| `make`                      | Array  | Make of the vehicle                                                              |
| `max_permitted_speed`       | Number | Max allowed speed on the vehicle in km/h                                         |
| `max_range_meters`          | Number | If engine-driven, furthest travel distance before it needs to be recharged       |
| `model`                     | Array  | Public model name of relevant vehicle type                                       |
| `name`                      | Array  | Public name of relevant vehicle type                                             |
| `pricing_plan_ids`          | Array  | Other pricing plan IDs that relate to the vehicle                                |
| `propulsion_type`           | String | Primary propulsion type of the vehicle                                           |
| `rated_power`               | Number | Rated motor power of the vehicle                                                 |
| `return_constraint`         | String | Conditions for returning the vehicle                                             |
| `rider_capacity`            | Number | Number of people allowed on the vehicle (driver included)                        |
| `vehicle_assets`            | Object | Assets such as icons that relate to the vehicle type                             |
| `wheel_count`               | Number | Number of wheels on the vehicle                                                  |


## Vehicle Status

> A Vehicle Status request.

```shell
$ curl --location --request GET https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/vehicle_status.json
"Authorization: Bearer <Bearer token>"
```

### Path parameters

| parameter | description                                  | presence |
| --------- | -------------------------------------------- | -------- |
| zoneID    | The zone id for the requested status changes | required |



> A vehicle_status.json response.

```shell
{
    "data": {
        "vehicles": [
            {
                "current_fuel_percent": 0.47,
                "current_range_meters": 37600,
                "is_disabled": false,
                "is_reserved": false,
                "last_reported": "2025-02-17T13:19:04Z",
                "lat": 59.33863,
                "lon": 18.067764,
                "rental_uris": {
                    "android": "https://voi.com/deeplink?company=voiapp.io&vehicle_qr_code=gzpm",
                    "ios": "https://voi.com/deeplink?company=voiapp.io&vehicle_qr_code=gzpm"
                },
                "station_id": "31ecd9f9-7f10-4c32-89bc-7651dd1acbb2",
                "vehicle_id": "0858ba28-4404-4efb-a6aa-0dd65c8dce88",
                "vehicle_type_id": "172ef7a6-ee84-4320-9337-86235f2f67ac"
            }
        ]
    },
    "last_updated": "2025-02-17T12:58:33Z",
    "ttl": 30,
    "version": "3.0"
}
```

`vehicle_status` describes the current status of the vehicles in the city

### Response

The `data:` Payload `{ "vehicles": [] }`, is an array of objects with the following structure.

| Field Name              | type    | Defines                                                                    |
| ----------------------- | ------- | -------------------------------------------------------------------------- |
| `current_fuel_percent`  | Number  | Current battery percentage of the vehicle                                  |
| `current_range_meters`  | Number  | Current estimated range in meters                                          |
| `is_disabled`           | Boolean | Whether the vehicle is currently disabled                                  |
| `is_reserved`           | Boolean | Whether the vehicle is currently reserved                                  |
| `last_reported`         | String  | ISO 8601 timestamp when the vehicle last reported its status               |
| `lat`                   | Number  | Latitude of the vehicle's current location                                 |
| `lon`                   | Number  | Longitude of the vehicle's current location                                |
| `rental_uris`           | Object  | Contains deeplinks to rent vehicle in Android and iOS apps                 |
| `station_id`            | String  | Identifier of the station where vehicle is located (if applicable) (see XXXX)        |
| `vehicle_id`            | String  | Unique identifier of the vehicle                                           |
| `vehicle_type_id`       | String  | Identifier for the type of vehicle (see vehicle_types.json)                |


## Station Status

> A Station Status request.

```shell
$ curl --location --request GET https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/station_status.json
"Authorization: Bearer <Bearer token>"
```

### Path parameters

| parameter | description                                  | presence |
| --------- | -------------------------------------------- | -------- |
| zoneID    | The zone id for the requested status changes | required |


> A station_status.json response.

```shell
{
    "data": {
        "stations": [
            {
                "is_installed": false,
                "is_renting": true,
                "is_returning": true,
                "last_reported": "2024-08-21T14:30:52Z",
                "num_vehicles_available": 1,
                "station_id": "746fd4e0-0fc9-4275-9060-e1693c982999",
                "vehicle_types_available": [
                    {
                        "count": 1,
                        "vehicle_type_id": "172ef7a6-ee84-4320-9337-86235f2f67ac"
                    }
                ]
            }
        ]
    },
    "last_updated": "2025-02-17T12:58:33Z",
    "ttl": 30,
    "version": "3.0"
}
```

`station_status` describes the current status of our (virtual) parking stations

### Response

The `data:` Payload `{ "stations": [] }`, is an array of objects with the following structure.

| Field Name                | type    | Defines                                                                    |
| ------------------------- | ------- | -------------------------------------------------------------------------- |
| `station_id`              | String  | Identifier of the station (see station_information.json)                   |
| `is_installed`            | Boolean | Whether the station is physically installed                                |
| `is_renting`              | Boolean | Whether the station is currently renting vehicles                          |
| `is_returning`            | Boolean | Whether the station is accepting vehicle returns                           |
| `last_reported`           | String  | ISO 8601 timestamp when the station last reported its status               |
| `num_vehicles_available`  | Integer | Number of vehicles available for rental at the station                     |
| `vehicle_types_available` | Array   | Array of objects containing count and vehicle_type_id for available types  |


## Station Information

> A Station Information request.

```shell
$ curl --location --request GET https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/station_information.json
"Authorization: Bearer <Bearer token>"
```

### Path parameters

| parameter | description                                  | presence |
| --------- | -------------------------------------------- | -------- |
| zoneID    | The zone id for the requested status changes | required |



> A station_information.json response.

```shell
{
    "data": {
        "stations": [
            {
                "is_virtual_station": true,
                "lat": 59.33965,
                "lon": 18.038778,
                "name": [
                    {
                        "language": "en",
                        "text": "Flygbussarna S:t Eriksplan (B)"
                    }
                ],
                "station_area": {
                    "coordinates": [
                        [
                            [
                                [
                                    18.038727,
                                    59.33965
                                ],
                                [
                                    18.03882,
                                    59.339664
                                ],
                                [
                                    18.038834,
                                    59.33965
                                ],
                                [
                                    18.038734,
                                    59.339634
                                ],
                                [
                                    18.038727,
                                    59.33965
                                ]
                            ]
                        ]
                    ],
                    "type": "MultiPolygon"
                },
                "station_id": "1d835625-17bc-4a3a-adfe-4cb6ec85b9b5"
            }
        ]
    },
    "last_updated": "2025-02-17T12:58:33Z",
    "ttl": 3600,
    "version": "3.0"
}
```

`station_information` describes static information about the parking infrastructure in the city

### Response

The `data:` Payload `{ "stations": [] }`, is an array of objects with the following structure.

| Field Name                | type    | Defines                                                                    |
| ------------------------- | ------- | -------------------------------------------------------------------------- |
| `is_virtual_station`      | String  | Identifier of the station (see station_information.json)                   |
| `lat`                     | Number  | Latitude of the center of the parking station                              |
| `lon`                     | Number  | Longitude of the center of the parking station                             |
| `name`                    | String  | Name of the station                                                        |
| `station_area`            | Array   | GeoJSON representation of the virtual area of the parking station          |
| `station_id`              | String  | Identifier of the station                                                  |


## System Information

> A System Information request.

```shell
$ curl --location --request GET https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/system_information.json
"Authorization: Bearer <Bearer token>"
```

### Path parameters

| parameter | description                                  | presence |
| --------- | -------------------------------------------- | -------- |
| zoneID    | The zone id for the requested status changes | required |



> A system_information.json response.

```shell
{
    "data": {
        "attribution_organization_name": [
            {
                "language": "en",
                "text": "VOI Technology AB"
            }
        ],
        "attribution_url": "https://www.voi.com",
        "email": "support@voiapp.io",
        "feed_contact_email": "support@voiapp.io",
        "languages": [
            "en"
        ],
        "name": [
            {
                "language": "en",
                "text": "VOI"
            }
        ],
        "opening_hours": "24/7",
        "operator": [
            {
                "language": "en",
                "text": "VOI Technology AB"
            }
        ],
        "rental_apps": {
            "android": {
                "discovery_uri": "voiapp://open",
                "store_uri": "https://play.google.com/store/apps/details?id=io.voiapp.voi"
            },
            "ios": {
                "discovery_uri": "voiapp://",
                "store_uri": "https://apps.apple.com/us/app/voi-e-scooter-e-bike-hire/id1395921017"
            }
        },
        "system_id": "voi_Stockholm",
        "timezone": "Europe/Stockholm"
    },
    "last_updated": "2025-02-17T12:58:33Z",
    "ttl": 3600,
    "version": "3.0"
}
```

`system_information` describes static information about the system (city).

### Response

The `data:` Payload is an objects with the following structure.

| Field Name                      | type   | Defines                                                                                |
| ------------------------------- | ------ | -------------------------------------------------------------------------------------- |
| `attribution_organization_name` | Array  | Array of names identifying the organization that operates the system                   |
| `attribution_url`               | String | URL of the organization that operates the system                                       |
| `email`                         | String | Support email address                                                                  |
| `feed_contact_email`            | String | Contact email for feed-related questions                                               |
| `languages`                     | Array  | Array of supported language codes                                                      |
| `name`                          | Array  | Array of name/language pairs identifying the system name                               |
| `opening_hours`                 | String | Hours of operation                                                                     |
| `operator`                      | Array  | Array of name/language pairs identifying the system operator                           |
| `rental_apps`                   | Object | Contains discovery and store URIs for Android and iOS rental apps                      |
| `system_id`                     | String | Unique identifier for this system (city)                                               |
| `timezone`                      | String | Timezone where system is located                                                       |


## System Pricing Plans

> A System Pricing Plans request.

```shell
$ curl --location --request GET https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/system_pricing_plans.json
"Authorization: Bearer <Bearer token>"
```

### Path parameters

| parameter | description                                  | presence |
| --------- | -------------------------------------------- | -------- |
| zoneID    | The zone id for the requested status changes | required |



> A system_pricing_plans.json response.

```shell
{
    "data": {
        "plans": [
            {
                "currency": "SEK",
                "description": [
                    {
                        "language": "en",
                        "text": "Pay as you go pricing plan with unlock fee and per minute pricing"
                    }
                ],
                "is_taxable": false,
                "name": [
                    {
                        "language": "en",
                        "text": "Pay as you go"
                    }
                ],
                "per_min_pricing": [
                    {
                        "interval": 0,
                        "rate": 3,
                        "start": 0
                    }
                ],
                "plan_id": "scooter-pricing-plan-1",
                "price": 10,
                "surge_pricing": false
            }
        ]
    },
    "last_updated": "2025-02-17T13:48:19Z",
    "ttl": 3600,
    "version": "3.0"
}
```

`system_pricing_plans` describes static information about the pricing in the city.

### Response

The `data:` Payload `{ "plans": [] }`, is an array of objects with the following structure.

| Field Name        | type    | Defines                                                                                             |
| ----------------- | ------- | --------------------------------------------------------------------------------------------------- |
| `plan_id`         | String  | Unique identifier for a pricing plan in the system (referred to as pricing_plan_ids in other feeds) |
| `name`            | Array   | Short name of the pricing plan                                                                      |
| `currency`        | String  | Type of currency used in the pricing plan                                                           |
| `price`           | Number  | Fee to start ride                                                                                   |
| `is_taxable`      | Boolean | Whether the pricing plan is taxable                                                                 |
| `description`     | Array   | Long description of the pricing plan                                                                |
| `per_min_pricing` | Array   | Array of interval, rate and start pricing                                                           |
| `surge_pricing`   | Boolean | Whether surge pricing is in effect                                                                  |


## Geofencing Zones

> A Geofencing Zones request.

```shell
$ curl --location --request GET https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/geofencing_zones.json
"Authorization: Bearer <Bearer token>"
```

### Path parameters

| parameter | description                                  | presence |
| --------- | -------------------------------------------- | -------- |
| zoneID    | The zone id for the requested status changes | required |



> A geofencing_zones.json response.

```shell
{
    "data": {
        "geofencing_zones": {
            "features": [
                {
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [
                            [
                                [
                                    [
                                        18.069855,
                                        59.34351
                                    ],
                                    [
                                        18.069885,
                                        59.343519
                                    ],
                                    [
                                        18.069918,
                                        59.343515
                                    ],
                                    [
                                        18.069936,
                                        59.343501
                                    ],
                                    [
                                        18.06993,
                                        59.343484
                                    ],
                                    [
                                        18.069898,
                                        59.343475
                                    ],
                                    [
                                        18.069855,
                                        59.34351
                                    ]
                                ]
                            ]
                        ]
                    },
                    "properties": {
                        "name": [
                            {
                                "language": "en",
                                "text": "Stockholm - Rådmansgatan 7"
                            }
                        ],
                        "rules": [
                            {
                                "ride_end_allowed": true,
                                "ride_start_allowed": true,
                                "ride_through_allowed": true,
                                "station_parking": true,
                                "maximum_speed_kph": 16
                            }
                        ]
                    },
                    "type": "Feature"
                }
            ],
            "type": "FeatureCollection"
        },
        "global_rules": [
            {
                "maximum_speed_kph": 20,
                "ride_end_allowed": false,
                "ride_start_allowed": false,
                "ride_through_allowed": false,
                "station_parking": true,
                "vehicle_type_ids": [
                    "172ef7a6-ee84-4320-9337-86235f2f67ac",
                    "a71a53fa-ba78-4f7d-8406-840db031830e"
                ]
            }
        ]
    },
    "last_updated": "2025-01-29T16:07:01Z",
    "ttl": 3600,
    "version": "3.0"
}        
```

`geofencing_zones` Describes geofencing zones and their associated rules and attributes. Geofenced areas are delineated using GeoJSON in accordance with [RFC 7946](https://tools.ietf.org/html/rfc7946). 


### Response

The `geofencing_zones:` Payload `{ "features": [] }`, is an array of objects with the following structure.

| Field Name                   | type    | Defines                                                                                |
| ---------------------------- | ------- | -------------------------------------------------------------------------------------- |
| `type`                       | String  | Type of GeoJSON object.                                                                |
| `geometry`                   | Object  | GeoJSON geometry object defining the zone boundary                                     |
| `properties`                 | Object  | Properties describing the rules of the zone                                            |
| `properties.name`            | Array   | Array of name/language pairs identifying the zone                                       |
| `properties.rules`           | Array   | Array of rule objects defining what is allowed in the zone                             |
| `rules.ride_end_allowed`     | Boolean | Whether rides can end in this zone                                                     |
| `rules.ride_start_allowed`   | Boolean | Whether rides can start in this zone                                                   |
| `rules.ride_through_allowed` | Boolean | Whether vehicles can be ridden through this zone                                       |
| `rules.station_parking`      | Boolean | Whether station parking is required in this zone                                       |
| `rules.maximum_speed_kph`    | Number  | Maximum speed allowed in kilometers per hour                                           |


The `global_rules` Payload is an array of objects with the following structure

| Field Name              | type    | Defines                                                                |
| ----------------------- | ------- | ---------------------------------------------------------------------- |
| `maximum_speed_kph`     | Number  | Maximum speed allowed in kilometers per hour in the city               |
| `ride_end_allowed`      | Boolean | Whether rides can end anywhere in this city                            |
| `ride_start_allowed`    | Boolean | Whether rides can start anywhere in this city                          |
| `ride_through_allowed`  | Boolean | Whether vehicles can be ridden anywhere this city                      |
| `station_parking`       | Boolean | Whether station parking is required in this city                       |
| `vehicle_type_ids`      | Array   | Array of vehicle type IDs that these rules apply to                    |


## System Alerts

> A System Alerts request.

```shell
$ curl --location --request GET https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/system_alerts.json
"Authorization: Bearer <Bearer token>"
```

### Path parameters

| parameter | description                                  | presence |
| --------- | -------------------------------------------- | -------- |
| zoneID    | The zone id for the requested status changes | required |



> A system_alerts.json response.

```shell
{
    "data": {
        "alerts": []
    },
    "last_updated": "2025-02-17T14:40:56Z",
    "ttl": 0,
    "version": "3.0"
}
```

`system_alerts` describes any alerts around the city, e.g. temporary station closure

### Response

The `data:` Payload `{ "alerts": [] }`, is an array of objects with the following structure.

| Field Name      | type    | Defines                                                                                |
| --------------- | ------- | -------------------------------------------------------------------------------------- |
| `alert_id`      | String  | Unique identifier for this alert                                                       |
| `type`          | String  | Type of alert (e.g. station_closure)                                                   |
| `station_ids`   | Array   | Array of station IDs affected by this alert                                            |
| `times`         | Array   | Array of objects containing start and end times when alert is in effect                |
| `url`           | Array   | Array of objects containing URL and language for more information about alert          |
| `summary`       | Array   | Array of objects containing short summary text and language                            |
| `description`   | Array   | Array of objects containing detailed description text and language                     |
| `last_updated`  | String  | Timestamp indicating when this alert was last updated                                  |


## System Regions

> A System Regions request.

```shell
$ curl --location --request GET https://api.voiapp.io/v1/partner-apis/gbfs/{zoneID}/system_regions.json
"Authorization: Bearer <Bearer token>"
```

### Path parameters

| parameter | description                                  | presence |
| --------- | -------------------------------------------- | -------- |
| zoneID    | The zone id for the requested status changes | required |


> A system_regions.json response.

```shell
{
    "data": {
        "regions": []
    },
    "last_updated": "2025-02-17T14:44:18Z",
    "ttl": 3600,
    "version": "3.0"
}
```

`system_regions` describes any sub-regsion in the city

### Response

The `data:` Payload `{ "regions": [] }`, is an array of objects with the following structure.

| Field Name   | type   | Defines                                                                                                                     |
| ------------ | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| `region_id`  | String | Unique identifier for this region (e.g. "3", "4", "5", "6")                                                                 |
| `name`       | Array  | Array of objects containing name text (e.g. "North", "East", "South", "West") and language code (e.g. "en") for this region |



# Insurance providers 
This section describes the API used by Insurance providers. It is an extension of the Mobility Data Specification (MDS) provider API 2.0 schema, [see above for more on that](#mds-20). 

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

The token is required in the header, using Bearer authentication over HTTPS, on all API calls to Insurance API, MDS and GBFS endpoints.

| Key           | Value               |
| ------------- | ------------------- |
| Authorization | Bearer access-token |

## Versioning

The Insurance MDS APIs handle requests for specific versions of the specification from the clients.
Version is communicated through the use of a custom media-type, `application/vnd.insurance+json;version=2.0`.

See Open Mobility Foundation's MDS description on versioning [here](https://github.com/openmobilityfoundation/mobility-data-specification/blob/dev/general-information.md#versioning).


### Header

| Key    | Value                                |
| ------ | ------------------------------------ |
| Accept | application/vnd.insurance+json;version=2.0 |


## Trips

> A trips request.

```shell
# v2.0
$ curl -H "Accept: application/vnd.insurance+json;version=2.0"
  api.voiapp.io/v1/partner-apis/insurance/1/trips?end_time=2025-08-06T12

Do not copy ^ as the zone-ID or Accept might not match yours
```

> A trips response.

```shell
{
    "last_updated": 1755694420855,
    "version": "2.0.0",
    "trips": [
        {
            "accessibility_attributes": [],
            "city": "Berlin",
            "country": "DE",
            "device_id": "93d4e213-0d93-5839-a631-8070ded1be5a",
            "duration": 31,
            "start_location": {
                "lat": 59.338303,
                "lng": 18.06197
            },
            "start_time": 1754482925099,
            "end_location": {
                "lat": 59.9091,
                "lng": 10.74257
            },
            "end_time": 1754482956399,
            "is_group_ride": false,
            "license_plate": "2025-grün2-625bxi",
            "license_plate_id": "e72955c7-c3cc-4cd1-8d0b-4a8c5376b127",
            "provider_id": "1f129e3f-158f-4df5-af9c-a80de238e334",
            "ride_type": "solo",
            "trip_id": "020b1efc-4cf6-4dd6-b6e6-8dfe079c76c1",
            "trip_type": [
                "rider",
                "voi"
            ],
            "user_ride_count": 66,
            "vehicle_short_id": "trjs"
        }
    ]
}
```


### Response

The `trips:` Payload `{ "trips": [] }`, is an array of objects with the following structure.

| Field Name                   | type    | Defines                                                                                |
| ---------------------------- | ------- | -------------------------------------------------------------------------------------- |
| `accessibility_attributes`   | Array   | Array of accessibility features available for this trip                                |
| `city`                       | String  | City where the trip took place                                                         |
| `country`                    | String  | Country code where the trip took place                                                 |
| `device_id`                  | String  | Unique identifier for the device used                                                  |
| `duration`                   | Number  | Duration of the trip in seconds                                                        |
| `start_location`             | Object  | Object containing lat/lng coordinates where trip started                               |
| `start_time`                 | Number  | Unix timestamp when trip started                                                       |
| `end_location`               | Object  | Object containing lat/lng coordinates where trip ended                                 |
| `end_time`                   | Number  | Unix timestamp when trip ended                                                         |
| `is_group_ride`              | Boolean | Whether this was a group ride                                                          |
| `license_plate`              | String  | The Visual License plate of the vehicle                                                |
| `license_plate_id`           | String  | Unique identifier for the license plate                                                |
| `provider_id`                | String  | Unique identifier for the service provider                                             |
| `ride_type`                  | String  | Type of ride (e.g. "solo", "group-host","group-guest")                                 |
| `trip_id`                    | String  | Unique identifier for the trip                                                         |
| `trip_type`                  | Array   | Array of strings describing the trip type {"rider", "voi", "maas"}                     |
| `user_ride_count`            | Number  | Number of rides the user has taken                                                     |
| `vehicle_short_id`           | String  | Short identifier for the vehicle                                                       |



### HTTPS request

`GET api.voiapp.io/v1/partner-apis/insurance/{zoneID}/trips`

### Path parameters

| parameter | description                         | presence |
| --------- | ----------------------------------- | -------- |
| zoneID    | The zone id for the requested trips | required |

### Query parameters

| parameter | description                                                                                                                       | presence |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| end_time  | YYYY-MM-DDTHH, an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) extended DateTime representing a UTC hour between 00 and 23. | required |
