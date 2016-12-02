# Cycle Platform API [![Build Status](https://travis-ci.org/cycleplatform/api-client-nodejs.svg?branch=master)](https://travis-ci.org/cycleplatform/api-client-nodejs) [![npm version](https://badge.fury.io/js/cycle-api.svg)](https://badge.fury.io/js/cycle-api)
https://cycle.io

## What is Cycle?
Cycle is a Containers as a Service (CaaS) platform that through container-native features into a simple, yet powerful way to deploy and scale to bare-metal infrastructure around the world.

## Installation
`npm install --save cycle-api`

## API Overview

A token is required in order to access any endpoint using Cycle's API. 
When you authenticate using your API Key (generate one in the [portal](https://portal.cycle.io/integrations/api-keys)), a token/refresh token combo is generated and stored. 
This token will expire after two hours, it is up to the user to manage token refreshing. 

```typescript
    import { Auth } from "cycle-api"

    async function authenticate() {
        const result = await Auth.apiKeyAuth({
            secret: "YOUR_API_KEY"
        });

        if (!result.ok) {
            throw new Error(result.error.detail);
        }
    }

    authenticate();

```

The token is stored in an internal cache, but can be overridden if desired. 
This is useful if you want to write your token into a local storage device. 

Every resource method returns an API Response wrapped in an awaitable promise. 
An API response contains the following properties:

```typescript
    interface APIResult<T> {
        ok: boolean;
        value?: T;
        error?: {
            status?: number;
            code?: ErrorCode;
            title?: string;
            detail?: string;
            source?: string;
        }
    }
```

where T is the type of resource you are attempting to access. 
This format is extremely powerful when using Typescript > 2.0, due to tagged unions. 
When using Typescript > 2.0, you MUST check the response of the call and verify no error is present
before you are able to access the value. 

```typescript
    import { Environments } from "cycle-api" 

    async function getEnvironmentsList() {
        const resp = await Environments.document().get();
        if (!resp.ok) {
            // Handle your error here
            return;
        }

        console.log(resp.value); // Your list of environments
    }

    getEnvironmentsList();
```

## Settings

- Setting a team:
```typescript
    import { Settings } from "cycle-api";
    Settings.team = "YOUR_TEAM_ID";
```
- Utilize an internal resource cache - If the same call is made within x seconds, it'll use a cached version of the results for speed
```typescript
    import { Settings } from "cycle-api";
    Settings.cache.use = true;
    Settings.cache.refresh = 1000 //ms
```
- Set up token storage - Requires an interface with three functions: read, write, and delete
```typescript
    import { Settings } from "cycle-api";
    
    interface StorageInterface {
        read(): Token | undefined;
        write(t: Token): void;
        delete(): void;
    }

    Settings.storage = new StorageInterface(); // Replace with class that matches interface
```