---
layout: code
title: Deep Integrations
permalink: /maas-pro/
menu: main
description: A MaaS API, used for completing full user journeys.
---

# Introduction

## API contract

Regardless of new features launched in the future, Voi commits to supporting the current feature-set for partners and not perform braking changes to this version of the API, though we might add new endpoints. This API is not rate-limited but we expect you to cache cacheable data. More details on each point.

All major updates will be communicated with all active partners via email before they are implemented.

## Development

For a broader description of the integration-process, check out our [checklist](/checklist/).

Test your applicaition against our staging environment. In staging, we provide virtual scooters and available zone types, located in Berlin. The test-enviroment differ from the real enviroment in theese ways.

- Whenever you call the scooter with unlocking or lock it will respond with success, even if you already have a rental running, for example.

- The scooter's location will not change even if you provide an end ride location.
- The zones and scooters are spread over a much larger area than the real scooters.

## Going live

Once the development is done, reach out to our [point of contact for engineering](/poc/) to receive keys to our production environment in the cities you operate in together with your cities zoneId:s. Now you will be able to test the integration with real scooters that you can pick from the street. Test the integration in closed beta before giving access to all your users.

## Rate Limit

We have a default rate limit of 4000 requests per minute applied on our API (sum of all requests).
VOI's API follows industry best practices by providing an HTTP 429 response code when the rate limit is exceeded.

If you need a higher rate limit for your operations, please reach out to our engineering support found [here](/poc/).

## Staging & Production domains

Staging: `https://partners.stage.voiapp.io`

Production: `https://partners.voiapp.io`

# Authentication

```shell
curl "https://partners.voiapp.io/v1/...
  -H "X-Auth-Token: $TOKEN"
```

API endpoints available for the mobility partner, are protected with token authentication using the key `X-Auth-Token` in the request header with the token you received from Voi when signing up. The token lasts 3 years we will send a new token to your partner-email-address in advance of its expiration.

## Header Parameters

| Key          | Value      |
| ------------ | ---------- |
| X-Auth-Token | your-token |

# Product

A product is usually a distinct app with a different name. We keep them seperate for monitoring, invoicing and customer support. All users are associated with a single product. You can have unlimited products and they will only available with your auth token. You should use the same product for multiple platforms, for example if you run your app on both iOs and Android.

## Product model

> The product response model

```shell
{
   "data":[
      {
         "id":"48d45384-4fa6-4325-841b-3191385af8fc",
         "type":"product",
         "attributes":{
            "productName": Travelizer,
            "state":"ACTIVE"
         }
      }
   ]
}
```

### Response

| field       | type   | description                                    | presence |
| ----------- | ------ | ---------------------------------------------- | -------- |
| id          | string | The product's id (UUID version 4)              | Required |
| type        | string | For vehicles the type will always be "product" | Required |
| productName | string | Your products name                             | Required |
| state       | string | Can be acitve or inactive                      | Required |

## Register

`POST https://partners.voiapp.io/v1/product/register`

Use to register a new product.

### Payload Request

| parameter   | description                     | Presense |
| ----------- | ------------------------------- | -------- |
| productName | The actual name of the product. | Required |

### Errors

| Code                      | Detail                     | ErrorCode               |
| ------------------------- | -------------------------- | ----------------------- |
| StatusBadRequest          | Invalid request body       | InvalidRequestBody      |
| StatusBadRequest          | Empty product name         | EmptyProductName        |
| StatusInternalServerError | Failed to register product | FailedToRegisterProduct |

## List

`GET https://partners.voiapp.io/v1/product`

Will return a list of all your products

### Errors

| Code               | Detail                | ErrorCode          |
| ------------------ | --------------------- | ------------------ |
| FailedToGetProduct | Failed to get product | FailedToGetProduct |

## Update

`PUT https://partners.voiapp.io/v1/product`

Use to update a product name.

### Payload Request

| parameter   | description                               | Presense |
| ----------- | ----------------------------------------- | -------- |
| productName | The new name of your product.             | Required |
| productId   | The id of the product you want to change  | Required |

### Errors

| Code                      | Detail                   | ErrorCode             |
| ------------------------- | ------------------------ | --------------------- |
| StatusBadRequest          | Invalid request body     | InvalidRequestBody    |
| EmptyProductName          | Empty product name       | EmptyProductName      |
| StatusBadRequest          | Empty product id         | ErrEmptyProductID     |
| StatusInternalServerError | Failed to update product | FailedToUpdateProduct |
| StatusNotFound            | Product id not found     | FailedToUpdateProduct |

## Delete

`DELETE https://partners.voiapp.io/v1/product/{id}`

Use to delete a product. The product will still be listed but marked as inactive.

### Path parameters

| parameter | description                               | Presense |
| --------- | ----------------------------------------- | -------- |
| productId | The id of the product you want to delete. | Required |

# User

This section describes the possible interactions with the user domain of the API.

## User model

> The user response model.

```shell
{
  "data": {
    "id": "9b39971c-8e51-5b32-aa07-dd2fee64c2b0",
    "type": "user",
    "attributes": {
      "email": "example@mail.com",
      "firstName": "Agatha",
      "lastName": "Christie" ,
      "phoneNumber: "+441234345",
      "externalId": "12345678-abcd-0000-1111-1234567890ab"
    }
  }
}
```

All successful user interactions respond with the following user model.

| field       | type   | description                                           | presence |
| ----------- | ------ | ----------------------------------------------------- | -------- |
| id          | string | The unique id for the user (UUID Version 4)           | required |
| type        | string | The type will be "user"                               | required |
| email       | string | The user's email address                              | required |
| firstName   | string | The user's first name                                 | optional |
| lastName    | string | The user's last name                                  | optional |
| phoneNumber | string | The user's phone number                               | optional |
| externalId  | string | The user's id created in the API consumers own system | optional |

## Register user

Register user creates a new user with a unique user id. A user is required to be registered before the rental can be started. No fields in this method have any uniqueness constraints.

<aside class="warning">There are no uniqueness constraints on any of the provided parameters, so idempotency is not guaranteed. Two identical requests to register user will create two separate users with two different user id's</aside>

### HTTPS request

`POST https://partners.voiapp.io/v1/user/register`

### Post data

| field       | type   | description                                                                                                                                                                                                  | presence |
| ----------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| email       | string | The users' email address is used by Voi customer support to identify users when contacting Voi and to send updates of terms and conditions to users, therefore you must provide the users real email adress. | required |
| firstName   | string | The user's first name                                                                                                                                                                                        | optional |
| lastName    | string | The user's last name                                                                                                                                                                                         | optional |
| phoneNumber | string | The users' phone number. (not used as identifier)                                                                                                                                                            | optional |
| externalId  | string | The users' id created in the partner system. This is used by customer support, for debugging, and as a reference in the invoicing material.                                                                  | optional |
| productId   | string | Your products Id. [You can create products as needed](#product)                                                                                                                                              | optional |

### Errors

| Code                      | Detail                               | ErrorCode                   |
| ------------------------- | ------------------------------------ | --------------------------- |
| StatusBadRequest          | Invalid request body                 | InvalidRequestBody          |
| StatusBadRequest          | This external user id already exists | ExternalUserIDAlreadyExists |
| StatusBadRequest          | Empty user email id                  | EmptyUserEmailID            |
| StatusInternalServerError |                                      |

<aside class="warning">We have some problems with older scooter models failing to unlock. For some scooters this can generate long response-times and/or StatusInternalServerError errors.</aside>

## Get user

> A get user request.

```shell
curl https://partners.voiapp.io/v1/users/9b39971c-8e51-5b32-aa07-dd2fee64c2b0
  -H "X-Auth-Token $TOKEN"
```

> A get user response.

```shell
{
  "data": {
    "id": "9b39971c-8e51-5b32-aa07-dd2fee64c2b0",
    "type": "user",
    "attributes": {
      "email": "example@mail.com",
      "firstName": "Agatha",
      "lastName": "Christie" ,
      "phoneNumber: "+441234345",
      "externalId": "12345678-abcd-0000-1111-1234567890ab"
    }
  }
}
```

Get user by user-id

### HTTPS request

`GET https://partners.voiapp.io/v1/user/id/{id}`

### Path parameters

| parameter | description                  | presence |
| --------- | ---------------------------- | -------- |
| id        | the user id (UUID version 4) | required |

### Errors

| Code                      | Detail          | ErrorCode       |
| ------------------------- | --------------- | --------------- |
| StatusBadRequest          | Invalid user id | InvalidUserId   |
| StatusNotFound            | User not found  | ErrUserNotFound |
| StatusInternalServerError |                 |

## Update user details

> An update user request.

```shell
curl -X Patch https://partners.voiapp.io/v1/users/9b39971c-8e51-5b32-aa07-dd2fee64c2b0
  -H "X-Auth-Token $TOKEN"
  -d '{"emai": "agatha.christie@gmail.com", "phoneNumber": "+46911"}'
```

> An "update user" response.

```shell
{
  "data": {
    "id": "9b39971c-8e51-5b32-aa07-dd2fee64c2b0",
    "type": "user",
    "attributes": {
      "email": "agatha.christie@gmail.com",
      "firstName": "Agatha",
      "lastName": "Christie" ,
      "phoneNumber: "+46911",
      "externalId": "12345678-abcd-0000-1111-1234567890ab"
    }
  }
}
```

Update user details allow for a user to be updated. Only fields that are sent in the patch request will be affected by the update request.

### HTTPS request

`PATCH https://partners.voiapp.io/v1/user/{id}`

### Patch parameters

| field       | type   | description              | presence |
| ----------- | ------ | ------------------------ | -------- |
| email       | string | The user's email address | optional |
| firstName   | string | The user's first name    | optional |
| lastName    | string | The user's last name     | optional |
| phoneNumber | string | The user's phone number  | optional |

### Errors

| Code                      | Detail               | ErrorCode          |
| ------------------------- | -------------------- | ------------------ |
| StatusBadRequest          | Invalid request body | InvalidRequestBody |
| StatusNotFound            | User not found       | ErrUserNotFound    |
| StatusInternalServerError |                      |

## Delete User

> A delete user request.

```shell
{
curl -X Delete https://partners.voiapp.io/v1/user/9b39971c-8e51-5b32-aa07-dd2fee64c2b0
  -H "X-Auth-Token $TOKEN"
  -d '{"emai": "agatha.christie@gmail.com", "phoneNumber": "+46911"}'
}
```

The delete user request allows you to completely remove the users account.

### HTTPS request

`DELETE https://partners.voiapp.io/v1/user/{id}`

# Rental

A rental is a domain where a user has access to a scooter. It is done by starting and ending a rental. At the end of a rental, the price will be posted so that the partner can charge the user. A user can only rent one scooter at a time and it is not possible to pre-book a scooter.

## Rental model

> The rental response model.

```shell
{
    "data": [
        {
            "id": "82267e03-f5b1-4b76-86c6-9f07df279372",
            "type": "rental",
            "attributes": {
                "rentalDurationMin": 12,
                "cost": {
                    "startPrice": 150,
                    "pricePerMinute": 30,
                    "subtotal": 429,
                    "total": {
                        "amount": 510,
                        "currency": "EUR",
                        "vat": 81,
                        "vatPercentage": 0.19
                    }
                },
                "state": "ENDED",
                "startedAt": "2020-01-13T16:02:05.44409597Z",
                "endedAt": "2020-01-13T16:13:20.44314233Z",
                "userStartLocation": {
                    "longitude": 18.07571600306901,
                    "latitude": 59.319013004372512
                },
                "userEndLocation": {
                    "longitude": 18.07571600384937,
                    "latitude": 59.319013004374839
                },
                "vehicle": {
                    "vehicleId": "7983e884-1111-2222-3333-f50ce017fcc8",
                    "vehicleCode": "xray"
                },
                "vehicleStartLocation": {
                    "longitude": 18.07571600306903,
                    "latitude": 59.319013004372515
                },
                "vehicleEndLocation": {
                    "longitude": 18.07571600384931,
                    "latitude": 59.319013004374841
                },
                receipt: {url: 'https://example.com/'}
            }
        }
    ]
}
```

All successful rental interactions responds with the following rental model.

| field                | type    | description                                                                                                                                                                                                                                                                                 | presence                                   |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| id                   | string  | The rental's unique id (UUID Version 4)                                                                                                                                                                                                                                                     | required                                   |
| type                 | string  | The type will be "rental"                                                                                                                                                                                                                                                                   | required                                   |
| rentalDurationMin    | integer | The rental's duration, in full minutes, rounded up. Used for calculating the charge.                                                                                                                                                                                                        | required                                   |
| cost                 | object  | Contains rental's cost information,                                                                                                                                                                                                                                                         | required                                   |
| startPrice           | integer | Unlock fee (null if unknown for historical data)                                                                                                                                                                                                                                            | optional                                   |
| pricePerMinute       | integer | Price per rounded-up minute (null if unknown for historical data)                                                                                                                                                                                                                           | optional                                   |
| subtotal             | integer | Total amount excluding VAT                                                                                                                                                                                                                                                                  | required                                   |
| total                | object  | Contains the rental's total cost                                                                                                                                                                                                                                                            | required                                   |
| amount               | integer | The priced amount, including VAT, in minor units (also called subunit)                                                                                                                                                                                                                      | required                                   |
| currency             | string  | The alphabetic currency code (ISO 4217)                                                                                                                                                                                                                                                     | required                                   |
| vat                  | integer | The price VAT amount in minor units (also called subunit)                                                                                                                                                                                                                                   | required                                   |
| vatPercentage        | number  | The price VAT percentage                                                                                                                                                                                                                                                                    | required                                   |
| state                | string  | The current state of the rental <br> RUNNING - During rental<br> ENDED - After rental<br> ENDED_WITH_NO_CHARGE - After rental if it was automatically ended.<br>ENDED_INTERNALLY - Ended by Voi, typically because the user forgot to. <br> [more details here](/payments/#prices-and-fees) | required                                   |
| startedAt            | string  | Time when the rental started (RFC3339 in UTC)                                                                                                                                                                                                                                               | required                                   |
| endedAt              | string  | Time when the rental ended (RFC3339 in UTC)                                                                                                                                                                                                                                                 | optional                                   |
| vehicle              | object  | Contains information about the vehicle used in the rental                                                                                                                                                                                                                                   | required                                   |
| vehicleCode          | string  | The 4-letter alphanumeric vehicle's unique code, visible on the physical vehicle                                                                                                                                                                                                            | required                                   |
| vehicleId            | string  | The vehicle's unique id (UUID Version 4)                                                                                                                                                                                                                                                    | required                                   |
| userStartLocation    | object  | The start location provided by the user                                                                                                                                                                                                                                                     | optional                                   |
| userEndLocation      | object  | The end location provided by the user                                                                                                                                                                                                                                                       | optional                                   |
| vehicleStartLocation | object  | The vehicle’s start location                                                                                                                                                                                                                                                                | required                                   |
| vehicleEndLocation   | object  | The vehicle’s end location                                                                                                                                                                                                                                                                  | optional                                   |
| longitude            | number  | The longitude component in a location                                                                                                                                                                                                                                                       | required (if parent object is present)     |
| latitude             | number  | The latitude component in a location                                                                                                                                                                                                                                                        | required (if parent object is present)     |
| receipt              |  object | The receipt object                                                                                                                                                                                                                                                                          | required for ended rides                   |
| url                  |  string |  A link to a pdf containing the receipt.                                                                                                                                                                                                                                                    | required (if the parent object is present) |

<aside class="warning">The <code>amount</code> is always in <b>minor units</b>. In most currencies the relation between the major unit and the minor unit is 1/100.<br>
<b>Example:</b> In the currency euro (EUR), 100 of the minor unit cent corresponds with one major unit of EUR. <br>
12.13 euro is sent as <code>{"amount": 1213, "currency": "EUR"}</code> </aside>
<aside class="warning">The receipt link expires after 15 minutes.</aside>
<aside class="warning">
  If location for start or end ride is provided via the API, the phones location will be used to define the end-ride postion. Otherwise. The scooters location – that is updated every 15 seconds – will be used.
</aside>

## Start rental

> A start rental request.

```shell
curl -X POST https://partners.voiapp.io/v1/rental/start
  -H "X-Auth-Token: $TOKEN"
  -d "{
           "vehicleId": "7983e884-1111-2222-3333-f50ce017fcc8",
           "userId": "c03418b3-004e-47cb-931c-36c2b0dc110a"
           "userStartLocation": {
                    "longitude": 18.07571600306903,
                    "latitude": 59.319013004372515
           },
           "userLicenseValidated": true,
           "beginnersMode": false,
      }"
```

> A start rental response.

```shell
{
    "data": [
        {
            "id": "82267e03-f5b1-4b76-86c6-9f07df279372",
            "type": "rental",
            "attributes": {
                "rentalDurationMin": 0,
                "cost": {
                    "startPrice": 30,
                    "pricePerMinute": 15,
                    "subtotal": 0,
                    "total": {
                        "amount": 0,
                        "currency": "SEK",
                        "vat": 0,
                        "vatPercentage": 0.19
                    }
                },
                "state": "RUNNING",
                "startedAt": "2020-01-13T16:02:05.44409597Z",
                "userStartLocation": {
                    "longitude": 18.07571600306903,
                    "latitude":  59.319013004372515
                },
                "vehicle": {
                    "vehicleId": "7983e884-1111-2222-3333-f50ce017fcc8",
                    "vehicleCode": "xray"
                },
                "vehicleStartLocation": {
                    "longitude": 18.07571600306903,
                    "latitude": 59.319013004372515
                },
            }
        }
    ]
}
```

Start rental makes a vehicle accessible to ride. The vehicle-Id is usually retrieved by either the user selecting the [scooter in the app](#get-vehicles-by-zone) or the user scanning the [vehicle code](#get-vehicle-by-code) present on the scooter. The partner decides what, if any, limitations should be set on who can start a ride.

### HTTPS request

`POST https://partners.voiapp.io/v1/rental/start`

### JSON body data

| field                | type    | description                                       | presence |
| -------------------- | ------- | ------------------------------------------------- | -------- |
| userId               | string  | The id of the user for whom the rental is started | required |
| vehicleId            | string  | The id of the vehicle which will be rented.       | required |
| userStartLocation    | object  | The user’s location when starting the rental      | optional |
| userLicenseValidated | boolean | The user driving license is validated             | optional |
| beginnersMode        | boolean | Start rental with beginner mode speed             | optional |

The `beginners mode` is a feature that limits the speed of the vehicle to the zone reduced speed. This is a feature that is used to make the scooter more accessible to new users.

<aside class="notic">It is upto the partner to decide if the user reached the minimum number of required rides to be able to start a rental without beginners mode.</aside>

### Errors

| Code                      | Detail                                          | ErrorCode                       |
| ------------------------- | ----------------------------------------------- | ------------------------------- |
| StatusBadRequest          | Invalid request body                            | InvalidRequestBody              |
| StatusBadRequest          | Invalid user id                                 | InvalidUserId                   |
| StatusBadRequest          | Invalid vehicle id                              | InvalidVehicleId                |
| StatusBadRequest          | User does not exist                             | UserNotFound                    |
| StatusBadRequest          | This user already has a rental                  | RentalAlreadyExists             |
| StatusBadRequest          | Vehicle not found                               | VehicleNotFound                 |
| StatusBadRequest          | User must validate their driver's license       | UserLicenceVerificationRequired |
| StatusMethodNotAllowed    | User is located too far from the vehicle        | UserTooFarFromVehicle           |
| StatusMethodNotAllowed    | Rental not allowed during sleep hours           | ZoneIsSleeping                  |
| StatusMethodNotAllowed    | Vehicle is unavailable (e.g. pending repair)    | VehicleNotAvailable             |
| StatusMethodNotAllowed    | Zone is currently not permitting rentals        | ZoneIsSleeping                  |
| StatusInternalServerError | Internal error while communicating with vehicle | FailedToUpdateVehicle           |
| StatusInternalServerError | Internal error while trying to unlock vehicle   | FailedToUnlockVehicle           |
| StatusInternalServerError | Unexpected Internal Error                       | FailedToStartRental             |

## Manual Disarm

The Manual Disarm is dedicated to vehicles that are equipped with a lock that requires manual steps from a user such as (e-bikes).
This endpoint is required only when the vehicle type is `bicycle`

> An Manual Disarm request.

```shell
curl -X POST https://partners.voiapp.io/v1/rental/82267e03-f5b1-4b76-86c6-9f07df279372/disarm
  -H "X-Auth-Token: $TOKEN"
  -d "{
           "userEndLocation": {
                    "longitude": 18.07571600384937,
                    "latitude": 59.319013004374839
           }
      }"
```

### HTTPS request

`POST https://partners.voiapp.io/v1/rental/<rentalId>/disarm`

### Path parameters

| parameter | description          |
| --------- | -------------------- |
| rentalId  | The id of the rental |

### Post data

| field           | type   | description                                 | presence |
| --------------- | ------ | ------------------------------------------- | -------- |
| userEndLocation | object | The user’s location when disarm the vehicle | optional |

### Errors

| Code                      | Detail                        | ErrorCode                  |
| ------------------------- | ----------------------------- | -------------------------- |
| StatusBadRequest          | Invalid rental id             | InvalidRentalID            |
| StatusNotFound            | Rental ID does not exist      | RentalIDDoesNotExist       |
| StatusMethodNotAllowed    | Vehicle not manually lockable | VehicleNotManuallyLockable |
| StatusMethodNotAllowed    | Vehicle is already locked     | VehicleAlreadyLocked       |
| StatusInternalServerError |                               |

## End rental

End rental locks the vehicle and makes it available for other users to use. The partner typically initiates the payment process when ending the rental.
After 10 minutes of inactivity during an ongoing rental (i.e. the vehicle hasn't moved for 10 minutes), the vehicle locks automatically and the rental is ended, if the vehicle is located in a place where ending the rental is permitted.

When the rental has ended the total cost of the rental is returned in the end rental response.

> An end rental request.

```shell
curl -X POST https://partners.voiapp.io/v1/rental/82267e03-f5b1-4b76-86c6-9f07df279372/end
  -H "X-Auth-Token: $TOKEN"
  -d "{
           "userEndLocation": {
                    "longitude": 18.07571600384937,
                    "latitude": 59.319013004374839
           }
      }"
```

> An end rental response.

```shell
{
    "data": [
        {
            "id": "82267e03-f5b1-4b76-86c6-9f07df279372",
            "type": "rental",
            "photoUploadURL": "https://storage.googleapis.com/some-bucket/eeee6666-7777-dddd-aaaa-ffff00001111.jpeg?Expires=1683724202&GoogleAccessId=sa-wi-some-thing%40other-thing.gserviceaccount.com&Signature=dGhpcy1pcy1ub3QtYS12YWxpZC1zaWduYXR1cmUtLWRvbnQtZXZlbi10cnk=",
            "attributes": {
                "rentalDurationMin": 12,
                "cost": {
                    "startPrice": 150,
                    "pricePerMinute": 30,
                    "subtotal": 429,
                    "total": {
                        "amount": 510,
                        "currency": "EUR",
                        "vat": 81,
                        "vatPercentage": 0.19
                    }
                },
                "state": "ENDED",
                "startedAt": "2020-01-13T16:02:05.44409597Z",
                "endedAt": "2020-01-13T16:13:20.44314233Z",
                "userStartLocation": {
                    "longitude": 18.07571600306901,
                    "latitude": 59.319013004372512
                },
                "userEndLocation": {
                    "longitude": 18.07571600384937,
                    "latitude": 59.319013004374839
                },
                "vehicle": {
                    "vehicleId": "7983e884-1111-2222-3333-f50ce017fcc8",
                    "vehicleCode": "xray"
                },
                "vehicleStartLocation": {
                    "longitude": 18.07571600306903,
                    "latitude": 59.319013004372515
                },
                "vehicleEndLocation": {
                    "longitude": 18.07571600384931,
                    "latitude": 59.319013004374841
                }
            }
        }
    ]
}
```

### HTTPS request

`POST https://partners.voiapp.io/v1/rental/<rentalId>/end`

### Path parameters

| parameter | description                              |
| --------- | ---------------------------------------- |
| rentalId  | The id of the rental that is to be ended |

### Post data

| field           | type   | description                                | presence |
| --------------- | ------ | ------------------------------------------ | -------- |
| userEndLocation | object | The user’s location when ending the rental | optional |

### Errors

| Code                      | Detail                                     | ErrorCode                  |
| ------------------------- | ------------------------------------------ | -------------------------- |
| StatusBadRequest          | Invalid rental id                          | InvalidRentalID            |
| StatusNotFound            | Rental ID does not exist                   | RentalIDDoesNotExist.      |
| StatusBadRequest          | Rental is already ended for this rental id | RentalAlreadyEnded         |
| StatusMethodNotAllowed    | This is no parking area,Can not end rental | FailedToEndRentalNoParking |
| StatusInternalServerError | Unable to end rental: Internal Error.      | FailedToEndRental          |

### On pricing

Pricing is under active development and constantly evolving, but it typically consists of a fixed fee and a minute fee. Below are other conditions that will also affect the price of the ride. Regardless, the actual price will always be returned when ending the ride.

**End ride fines** If the user leaves the scooter without locking it, Voi will manually end the ride with a cost corresponding to the time when the scooter stopped moving and send a warning to the user. If the user leaves the scooter unlocked again, we will end the ride with a cost corresponding to the time when the scooter stopped moving and in additon add a fee of 25€. This fee will be included in the end-ride charge.

**Short rides** For rides **before** 1st of January 2024, If the users ride for less than 100 meters or less than 2 minutes, we will not charge for the ride. It is optional for the partner to present receipts and/or add these rides to the invoicing material. after 1st of January 2024, we will charge for all rides.

**Refunds** The partner is responsible for performing refunds. When this is done it is defined in the customer support criteria. Sometimes, Voi customer support also requests the partner to perform refunds.

**Parking fees and other charges post-ride** Voi does not perform any charges after the ride is ended.

## Upload Parking Photo

> Parking Photo Upload Request.

```shell
curl -X PUT "https://storage.googleapis.com/url-from-end-rental-response" --upload-file filename.jpg -H 'Content-Type: image/jpeg'
```

After ending a rental, the API returns (among other things) a unique, cryptographically signed URL (`photoUploadURL`)
that allows to upload a photo of the parked vehicle. Currently, this photo is stored for compliance reasons only and not
validated in any way.

### Restrictions

- The PUT URL expires after 30 minutes
- The photo must be a JPEG image.
- The photo must be taken in `portrait` mode only!
- The photo must only use the regular lens (not the wide angle lens).
- The HTTP requests must use the PUT verb.
- The request must specify the content-type header as `image/jpeg`.

## Rental by id

```shell
curl https://partners.voiapp.io/v1/rental/82267e03-f5b1-4b76-86c6-9f07df279372
  -H "Authorization: Bearer $TOKEN"

```

Returns the [rental model](#rental-model)

### HTTPS request

`GET https://partners.voiapp.io/v1/rental/<id>`

### Path parameters

| parameter | description                           |
| --------- | ------------------------------------- |
| id        | The rental id of the requested rental |

## Active rental by user

> A get users active rental request.

```shell
curl https://partners.voiapp.io/v1/rental/user/82267e03-f5b1-4b76-86c6-9f07df279372/active
  -H "Authorization: Bearer $TOKEN"

```

Returns the [rental model](#rental-model) for the currently active rental.

### HTTPS request

`GET https://partners.voiapp.io/v1/rental/user/<id>/active`

### Path parameters

| parameter | description                          |
| --------- | ------------------------------------ |
| id        | The user id for the requested rental |

### Errors

| Code                      | Detail                       | ErrorCode            |
| ------------------------- | ---------------------------- | -------------------- |
| StatusBadRequest          | Invalid input                | InvalidInput         |
| StatusNotFound            | Unable to find active rental | ActiveRentalNotFound |
| StatusInternalServerError |                              |

## Rentals by user

```shell
curl https://partners.voiapp.io/v1/rental/user/82267e03-f5b1-4b76-86c6-9f07df279372
  -H "Authorization: Bearer $TOKEN"

```

Returns the [rental model](#rental-model) for users all rentals.

### HTTPS request

`GET https://partners.voiapp.io/v1/rental/user/<id>`

### Path parameters

| parameter | description                           |
| --------- | ------------------------------------- |
| id        | The user id for the requested rentals |

### Errors

| Code                      | Detail          | ErrorCode       |
| ------------------------- | --------------- | --------------- |
| StatusBadRequest          | Invalid input   | InvalidInput    |
| StatusBadRequest          | Invalid user id | InvalidUserId   |
| StatusNotFound            | User not found  | ErrUserNotFound |
| StatusInternalServerError |                 |

# Pricing

The cost of renting a Voi can differ, amongst others based on where the scooter is located and what time it is. When the user starts the ride, we commit to the price presented at that time. Some exceptions will cause the price to change, [more details here](/maas-pro/#end-rental). All prices are in the local currency.

## Pricing model

> The vehicle response model.

```shell
{
  "data": {
    "type": "pricing",
    "id": "12345678-1337-abcd-1234-1234abcd0002",
    "attributes": {
      "currency": "EUR",
      "pricePerMinute": 15,
      "startPrice": 100,
      "vat": 0.25
    }
  }
}
```

All successful pricing interactions responds with the following pricing model.

| field          | type    | description                                                         | presence |
| -------------- | ------- | ------------------------------------------------------------------- | -------- |
| id             | string  | The vehicle's id (UUID version 4) for which the pricing is derived  | required |
| type           | string  | For pricing the type will always be "pricing"                       | required |
| pricePerMinute | integer | the price per minute, including Vat, in minor units                 | required |
| startPrice     | integer | the start price, including Vat in minor units (also called subunit) | required |
| currency       | string  | the three-letter alphabetic currency code (ISO 4217)                | required |
| vat            | integer | the VAT percentage                                                  | required |

## Get price

> A get pricing request.

```shell
curl https://partners.voiapp.io/v1/pricing/vehicle/12345678-1337-abcd-1234-1234abcd0002
  -H "X-Auth-Token: $TOKEN"
```

> A get pricing response.

```shell
{
  "data": {
    "type": "pricing",
    "id": "12345678-1337-abcd-1234-1234abcd0002",
    "attributes": {
      "currency": "EUR",
      "pricePerMinute": 15,
      "startPrice": 100,
      "vat": 0.25
    }
  }
}
```

Pricing information can be accessed for a particular vehicle by referencing the vehicle’s id. Prices are updated dynamically so do not cache price information, but rather request it when it's needed by the user.

### HTTPS request

`GET https://partners.voiapp.io/v1/pricing/vehicle/{id}`

### Path parameters

| parameter | description                      | presence |
| --------- | -------------------------------- | -------- |
| id        | The vehicle id (UUID version 4). | required |

### Errors

| Code                      | Detail             | ErrorCode        |
| ------------------------- | ------------------ | ---------------- |
| StatusBadRequest          | Invalid vehicle id | InvalidVehicleId |
| StatusInternalServerError |                    |

# Vehicle

## Vehicle model

> The vehicle response model.

```shell
{
  "data": [
    {
      "type": "vehicle",
      "vehicle_type": "scooter",
      "id": "12345678-1337-abcd-1234-1234abcd0001",
      "attributes": {
        "batteryLevel": 95,
        "location": {
            "latitude": 47.213553,
            "longitude": 17.382606,
         },
        "code": "L33T",
        "zoneId": "145",
        "locked": true
      }
    },
  ]
}
```

All successful vehicle interactions responds with the following vehicle model.

| field          | type    | description                                                                                    | presence |
| -------------- | ------- | ---------------------------------------------------------------------------------------------- | -------- |
| id             | string  | The vehicle's id (UUID version 4)                                                              | required |
| type           | string  | For vehicles the type will always be "vehicle"                                                 | required |
| vehicle_type   | string  | The vehicles type , values are `scooter`, `bicycle`                                            | required |
| batteryLevel   | integer | The state of charge of the vehicles' battery in percent (0-100)                                | required |
| location       | object  | The vehicle’s location                                                                         | required |
| longitude      | number  | The longitude component of the location                                                        | required |
| latitude       | number  | The latitude component of the location                                                         | required |
| code           | string  | The 4-letter alphanumeric vehicle code, also available on the physical vehicle and as QR-code. | required |
| price          | object  | The vehicle price                                                                              | required |
| pricePerMinute | integer | the price per minute, including Vat, in minor units                                            | required |
| startPrice     | integer | the start price, including Vat in minor units (also called subunit)                            | required |
| currency       | string  | the three-letter alphabetic currency code (ISO 4217)                                           | required |
| vat            | integer | the VAT percentage                                                                             | required |

## Get vehicles by zone

> A get vehicles by zone request.

```shell
curl https://partners.voiapp.io/v1/vehicles/?zoneID=9
  -H "X-Auth-Token: $TOKEN"
```

> A get vehicles by zone response.

```shell
{
  "data": [
    {
      "type": "vehicle",
      "vehicle_type": "scooter",
      "id": "12345678-1337-abcd-1234-1234abcd0001",
      "attributes": {
        "batteryLevel": 95,
        "location": {
            "latitude": 47.213553,
            "longitude": 17.382606,
         },
        "code": "L33T",
        "zoneId": "145",
        "locked": true
      },
      "price": {
        "currency": "EUR",
        "pricePerMinute": 15,
        "startPrice": 100,
        "vat": 0.25
      }
    },
      {
      "type": "vehicle",
      "vehicle_type": "bicycle",
      "id": "12345678-1337-abcd-1234-1234abcd0002",
      "attributes": {
        "batteryLevel": 86,
        "location": {
            "latitude": 48.213553,
            "longitude": 16.382606,
        },
        "code": "D0IT",
        "zoneId": "145",
        "locked": true
      },
      "price": {
        "currency": "EUR",
        "pricePerMinute": 15,
        "startPrice": 100,
        "vat": 0.25
      }
    },
  ]
}
```

To be able to start a rental or get pricing, the vehicle which is subject to the rental or the pricing needs to be referenced with its id. Only vehicles available for rental will be part of the response. We recommend updating the vehicle model every 7 seconds. There is no technical limit to the number of vehicles in a Zone.

### HTTPS request

`GET https://partners.voiapp.io/v1/vehicles/?zoneID={zoneID}`

### Query parameters

| parameter | description                  | presence |
| --------- | ---------------------------- | -------- |
| zoneID    | The id of the requested zone | required |

<aside class="warning">You can only get vehicles from the operational zones you have access to.</aside>

### Errors

| Code                      | Detail | ErrorCode |
| ------------------------- | ------ | --------- |
| StatusInternalServerError |        |

## Get Vehicle by code

On each scooters handlebars, the code, 4 alphanumeric characters, are written in plain text and as a QR-code.

> A get vehicle by code request.

```shell
curl https://partners.voiapp.io/v1/vehicles/code/L33T
  -H "X-Auth-Token: $TOKEN"
```

> A get vehicle by code response.

```shell
{
  "data": [
      {
         "type": "vehicle",
         "vehicle_type": "scooter",
         "id": "12345678-1337-abcd-1234-1234abcd0001",
         "attributes": {
           "batteryLevel": 95,
           "location": {
               "latitude": 47.213553,
               "longitude": 17.382606,
            },
           "code": "L33T",
           "zoneId": "145",
          "locked": true
         },
         "price": {
           "currency": "EUR",
           "pricePerMinute": 15,
           "startPrice": 100,
           "vat": 0.25
         }
    },
  ]
}
```

### HTTPS request

`GET https://partners.voiapp.io/v1/vehicles/code/{code}`

### Path parameters

| parameter | description                                                                              | presence |
| --------- | ---------------------------------------------------------------------------------------- | -------- |
| code      | the 4-letter alphanumeric vehicle code, visually available on the vehicle in text and as | required |

## Get Vehicle by id

> A get vehicle by id request.

```shell
curl https://partners.voiapp.io/v1/vehicles/id/12345678-1337-abcd-1234-1234abcd0002
  -H "X-Auth-Token: $TOKEN"
```

> A get vehicle by id response.

```shell
{
  "data": [
      {
      "type": "vehicle",
      "vehicle_type": "scooter",
      "id": "12345678-1337-abcd-1234-1234abcd0002",
      "attributes": {
        "batteryLevel": 86,
        "location": {
            "latitude": 48.213553,
            "longitude": 16.382606,
        },
        "code": "D0IT",
        "zoneId": "145",
        "locked": true
      },
      "price": {
        "currency": "EUR",
        "pricePerMinute": 15,
        "startPrice": 100,
        "vat": 0.25
      }
    },
  ]
}
```

### HTTPS request

`GET https://partners.voiapp.io/v1/vehicles/id/{id}`

### Query parameters

| parameter | description                       | presence |
| --------- | --------------------------------- | -------- |
| id        | The vehicle's id (UUID version 4) | required |

### Errors

| Code                      | Detail | ErrorCode |
| ------------------------- | ------ | --------- |
| StatusInternalServerError |        |

# Zone

## ~~Get zone areas v1~~ (deprecated - please use [the v2 endpoint](#get-zone-areas-v2) below)

<aside class="warning">This endpoint has been deprecated and will be removed by 2023-12-31 !</aside>

> The zones response model.

```shell
{
  "data": {
    "id": "1",
    "type": "area",
    "attributes": {
      "areas": [
        {
          "id": "651d1341-775d-4e0a-a5d3-310add50ef7f",
          "area_type": "no-parking",
          "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
              [
                [
                  [
                    18.04053783416748,
                    59.33789244534906
                  ],
                  [
                    18.04053783416748,
                    59.33789244534906
                  ]
                ]
              ]
            ]
          }
        },
        {
          "id": "839073a2-a6fe-4d7b-8dce-7d1896d014a7",
          "area_type": "slow-zone",
          "geometry": {
            "type": "MultiPolygon",
            "coordinates": [
              [
                [
                  [
                    10.732870101928711,
                    59.949568270842
                  ],
                  [
                    10.732870101928711,
                    59.949568270842
                  ]
                ]
              ]
            ]
          }
        }
      ]
    }
  }
}
```

Every city has it's own operational zone. Within each operational zone, there are zone areas, such as no-parking areas, slow areas, and operational areas. To display Zone areas in a partner app, the geolocation can be received using the get zones endpoint. Zone areas are rarely updated so we recommend caching Zone areas no more than once every 6 hours.

### Supported Zone Areas

| area type     | Description                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| operations    | The operational area, where Voi operates                                                                  |
| no-parking    | An area where rentals can't be ended\*                                                                    |
| parking-spot  | An area where a rental must be ended\*                                                                    |
| slow-zone     | An area where a vehicle's max-speed will be lowered, the maximum speed is not available.                  |
| no-riding     | An area vehicles may stop(depending on configuration) and you cannot end the ride.                        |
| incentive     | An area where users are incentivized to park                                                              |
| free-floating | An area where rental can be ended without restrictions (only from [Area V2](#get-zone-areas-v2) endpoint) |

Each operational zone operates with either mandatory parking spots or a free-floating fleet. That means a zone can only have either no-parking or parking-spot zone areas, never both.

Some of our operational zones have vehicle sleep times. During vehicle sleep time no rentals can be started.

### HTTPS request

`GET https://partners.voiapp.io/v1/zone/id/{zoneId}`

### Path parameters

| parameter | description                  |
| --------- | ---------------------------- |
| zoneId    | The id of the requested zone |

<aside class="warning">All behavior connected to the areas in a zone is enforced by the system. But for good A user experience, we recommend explaining the areas and their implication TO the user.</aside>

### Response

| field      | type   | description                              | presence |
| ---------- | ------ | ---------------------------------------- | -------- |
| id         | string | ID of the operational zone               | required |
| type       | string | For zones the type will always be "area" | required |
| attributes | object | Operation attributes                     | required |

#### Attributes

| field | type  | description               | presence |
| ----- | ----- | ------------------------- | -------- |
| areas | array | Array of operations areas | required |

#### Area

| field     | type   | description                                                                | presence |
| --------- | ------ | -------------------------------------------------------------------------- | -------- |
| id        | string | The id of the area                                                         | required |
| type      | string | The type of the area                                                       | required |
| area_type | string | The area type [Area Types](#supported-zone-areas)                          | required |
| geometry  | object | Describes the geometry for the area (geoJSON), described as multipolygons. | required |

### Errors

| Code                      | Detail            | ErrorCode   |
| ------------------------- | ----------------- | ----------- |
| StatusBadRequest          | Zone id was empty | EmptyZoneID |
| StatusInternalServerError |                   |

## Get zone areas v2

This endpoint returns the same data as version one except free-floating as an extra area type.

### HTTPS request

`GET https://partners.voiapp.io/v2/zone/id/{zoneId}`

## Get parking zone occupancy

> The parking zone occupancy response model

```shell
"data": [
        {
            "id": "044bb70b-8ac6-605c-984f-2244776800a5",
            "occupancy": 8,
            "capacity": 10
        },

```

This endpoint allows you to identify the number of available parking spots in all parking-spot areas in the relevant operational zone.

### HTTPS request

`GET https://partners.voiapp.io/v1/zone/id/{id}/areasOccupancy`

Replace {id} with relevant zoneID

### Response

| field     | type   | description                                                         |
| --------- | ------ | ------------------------------------------------------------------- |
| Id        | String | Specific parking-spot area id                                       |
| Occupancy | Number | Number of parked scooters in the parking-spot area                  |
| Capacity  | Number | Maximum Capacity of number of scooters inside the parking-spot area |

## Get operational zones

> The partner's zone response model.

```shell
{
  "data":{
    "id":"4EAC93B2-CB40-4FFD-B905-F4505E2E3BAD",
    "type":"zone",
    "attributes":{
      "zones":[
        {
          "zoneId":"1",
          "zoneName":"Stockholm",
          "parkingMode": "free-floating",
          "licenceVerificationRequired": false,
          "speedConfig": {
            "maxSpeed": 25,
            "minRequiredRides": 3,
            "reducedSpeed": 11,
            "speedUnit": "km/h"
          }
        },
        {
          "zoneId":"145",
          "zoneName":"Berlin",
          "parkingMode": "parking-spot",
          "licenceVerificationRequired": true
        }
      ]
    }
  }
}
```

Get all operational zones that a partner has access to.

### HTTPS request

`GET https://partners.voiapp.io/v1/zone/info`

### Response

| field                       | type    | description                                          |
| --------------------------- | ------- | ---------------------------------------------------- |
| zones                       | object  | A zone object                                        |
| zoneId                      | Number  | Vois unique id of the operational Zone               |
| zoneName                    | Number  | The name of the city                                 |
| parkingMode                 | string  | default parking mode. [Parking modes](#parking-mode) |
| licenceVerificationRequired | boolean | verifying user driving licence is required           |
| speedConfig                 | object  | Zone speed restrictions                              |
| isSleeping                  | boolean | Zone is in sleep mode so vehicle will be unavailable |

#### Parking mode

| parking mode  | description                                                                       |
| ------------- | --------------------------------------------------------------------------------- |
| free-floating | Users can end their ride anywhere, except for in No parking zone & No Riding Zone |
| parking-spot  | Users will only be able to end their ride inside a Parking spot                   |

#### Speed config

| parking mode     | description                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- |
| maxSpeed         | Maximum speed for the zone, for unit see `speedUnit`.                                                                 |
| minRequiredRides | Minimum required rides defined for a zone to be eligible to upgrade from beginners (speed) mode to normal speed mode. |
| reducedSpeed     | Reduced speed for beginners mode given in the unit defined in `speedUnit`.                                            |
| speedUnit        | The unit for the speed, it could be km/h or mph.                                                                      |

# Miscellaneous

## GDPR requests

Since the right to be forgotten and other GDPR-requests require that we go through all our internal systems manually. Requests are handled by contacting [customer support](/poc/).

## Endpoints not planned

For clarity, here we list endpoints that are nost available. We have not planned to build them as of yet but will notify all our partners if we do.

- It's not possible to delete users in our system
- Ask user to contact our customer support for the right to be forgotten.
- We have not included lock and reserve in our API, since the feature is not widely used.
