---
layout: text
title: Deeplinks
permalink: /deeplinks/
menu: main
description: Create links to views in the Voi app.
---

# How deep links work
Deeplinks are a way to send the user to a view in a mobe app. If the user doesn't have the app they are sent to the AppStore with a prompt to download the app. We are using the third-party tool adjust to deep-link and track usage from third-party apps.

# Schema

## Base URL
https://lqfa.adj.st/voiapp/open

## Parameters

|Key|Value|Description|
|---|---|---|
|adj_t|3swpnku|This is the group that should be used for all partner-integration.|
|adj_campaign|pt|Use if client is public transit|
||maas|use if the client is mobility as a service application|
|adj_adgroup|app name|Put in your app name|
|adj_creative|any grouping for example by city|optional, can be used for any grouping you want to share with us|
|adj_deeplink|voiapp deeplink|optional, URL-encoded deep links specified in [Views](#views) below|

## Example
[https://lqfa.adj.st/voiapp/open?adj_t=3swpnku&adj_campaign=campaign2&adj_adgroup=adgroup2&adj_creative=creative2&adj_deeplink=voiapp%3A%2F%2Fhome]()

# Views
select a parameter based on what view you want the user to end up in

|View|Parameter|
|---|---|
|Map|adj_deeplink=voiapp%3A%2F%2Fhome|
|Qr-code-scanner|adj_deeplink=voiapp%3A%2F%2Fscan|
|Send credits|adj_deeplink=voiapp%3A%2F%2Ffree|
|Redeem credits|adj_deeplink=voiapp%3A%2F%2Fredeem%2Fcode|
|Ride history|adj_deeplink=voiapp%3A%2F%2Fride_history|
|Loyalty Instructions|dj_deeplink=voiapp%3A%2F%2loyalty_instructions|
|Rules for riding |adj_deeplink=voiapp%3A%2F%2Frule|
|Help |adj_deeplink=voiapp%3A%2F%2Fhelp|
|Edit payment methods |adj_deeplink=voiapp%3A%2F%2Fpayment|
|View credits |adj_deeplink=voiapp%3A%2F%2Fcredit|
|Pre-select closest vehicle |adj_deeplink=voiapp%3A%2F%2Fclosest_vehicle|
||adj_deeplink=voiapp%3A%2F%2Fnearest|
|My impact dashboard |adj_deeplink=voiapp%3A%2F%2Fmy_impact|
