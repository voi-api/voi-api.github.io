---
layout: code
title: Maas Light
permalink: /maas-light/
menu: main
description: A read only API, containing MDS, GBFS and Zone data
---

# MDS

This section describes the Mobility Data Specification (MDS) provider API, explained in full on the Open Mobility Foundation's GitHub [here](https://github.com/openmobilityfoundation/mobility-data-specification/tree/dev/provider).

## Authentication

> A token request.

```shell
$ curl -X POST -u user:password
  -d grant_type=client_credentials
  -H "Content-Type:application/x-www-form-urlencoded"
  mds.voiapp.io/token
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
Version is communicated through the use of a custom media-type, `application/vnd.mds.provider+json`, combined with a required version parameter in the `Accept`.

See Open Mobility Foundation's MDS description on versioning [here](https://github.com/openmobilityfoundation/mobility-data-specification/tree/dev/provider#versioning).

<aside class="warning">Current MDS implementation only supports version 0.4</aside>

### Header

| Key    | Value                                         |
| ------ | --------------------------------------------- |
| Accept | application/vnd.mds.provider+json;version=0.4 |

## Trips

> A trips request.

```shell
$ curl -H "Accept: application/vnd.mds.provider+json;version=0.4"
  mds.voiapp.io/en/9/trips?end_time=2020-01-01T23
```

A trip represents a journey taken by a customer with a geo-tagged start and stop point.
The `/trips endpoint allows a user to query historical trip data that happened within the queried hour.

See Open Mobility Foundation's MDS description on trips [here](https://github.com/openmobilityfoundation/mobility-data-specification/tree/dev/provider#trips).

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
$ curl -H "Accept: application/vnd.mds.provider+json;version=0.4"
  mds.voiapp.io/en/9/status_changes?event_time=2020-01-01T23
```

The status of the inventory of vehicles available for customer use. The `/status_changes` endpoint allows a user to query the historical availability for a system within the queried hour.

See Open Mobility Foundation's MDS description on status changes [here](https://github.com/openmobilityfoundation/mobility-data-specification/tree/dev/provider#status_changes).

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
$ curl -H "Accept: application/vnd.mds.provider+json;version=0.4"
  mds.voiapp.io/en/9/events?start_time=1580518800000&end_time=1581123600000
```

The `/events` endpoint is a near real-time feed of status changes, designed to give access to as recent as possible series of events.

The `/events` endpoint functions similarly to `/status_changes`, but does not include data older than 2 weeks.

See Open Mobility Foundation's MDS description of events [here](https://github.com/openmobilityfoundation/mobility-data-specification/tree/dev/provider#events).

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

# GBFS

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

Authentication for GBFS is the same as for MDS and is described in the MDS section found [here](#mds).

## Free bike status

> A free_bike_status request.

```shell
$ curl -H "X-Auth-Token: <access_token>"
  mds.voiapp.io/v1/gbfs/1/free_bike_status
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
| `bike_id      | String  | Unique identifier of a vehicle                                                                                                                                                                                                                      |
| `lat`         | Number  | Latitude of the bike. The field value must be a valid WGS 84 latitude in decimal degrees format. See: [World Geodetic System](http://en.wikipedia.org/wiki/World_Geodetic_System), [Decimal degrees](https://en.wikipedia.org/wiki/Decimal_degrees) |
| `lon`         | Number  | Longitude of the bike. See `lat` definition.                                                                                                                                                                                                        |
| `is_reserved` | Ìnteger | 1/0 value - is the bike currently reserved for someone else                                                                                                                                                                                         |
| `is_disabled` | Ìnteger | 1/0 value - is the bike currently disabled (broken)                                                                                                                                                                                                 |

### Extension

> A free_bike_status extended request.

```shell
$ curl -H "X-Auth-Token: <access_token>"
  -H "X-Voigbfs-Ext: Battery"
  mds.voiapp.io/v1/gbfs/1/free_bike_status
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
$ curl -H "X-Auth-Token: <access_token>"
  mds.voiapp.io/v1/gbfs/gbfs.json
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
