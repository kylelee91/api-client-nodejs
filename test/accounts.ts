import { Accounts } from "../src";
import { assert, expect } from "chai";

export async function get(id: string) {
    const account = {
        "data": {
            "id": "57db30401b847a549ce703e5",
            "username": "klee",
            "name": {
                "first": "Kyle",
                "last": "Lee"
            },
            "teams": [
                {
                    "id": "580515861b847a634da3e952",
                    "role": 1,
                    "joined": "2016-10-17T18:16:38.749Z"
                },
                {
                    "id": "58553c63593b6702b6ae0a07",
                    "role": 1,
                    "joined": "2016-12-17T13:23:47.211Z"
                },
                {
                    "id": "5858caf6593b676bddc1b283",
                    "role": 1,
                    "joined": "2016-12-20T06:08:54.661Z"
                }
            ],
            "position": "",
            "email": {
                "address": "klee@petrichor.io",
                "verified": true,
                "last_notice": "2016-11-25T02:00:00Z",
                "notices": 1,
                "added": "2016-09-15T23:35:28.58Z"
            },
            "auth": {
                "allow_employee_login": true
            },
            "billing": {
                "trial": {
                    "start": "2016-09-01T01:01:00Z",
                    "end": "2016-10-01T01:01:00Z",
                    "ended": "2016-10-01T01:01:00Z"
                },
                "term": {
                    "start": "2017-02-21T06:16:04.166Z",
                    "end": "2017-03-21T06:16:04.166Z"
                },
                "tier": "574d2ebf1c4568c6f3aaf8d7",
                "restrictions": {
                    "containers": 5
                },
                "disable": null
            },
            "state": {
                "changed": "0001-01-01T00:00:00Z",
                "job": {
                    "id": "",
                    "queued": "0001-01-01T00:00:00Z",
                    "queue": ""
                },
                "current": "live"
            },
            "events": {
                "created": "2016-09-15T23:35:28.58Z",
                "updated": "0001-01-01T00:00:00Z",
                "deleted": "0001-01-01T00:00:00Z",
                "last_login": "2017-02-22T00:24:12.937Z"
            }
        }
    };

    if (!id) {
        throw new Error("An existing account ID wasn't set. You must use an existing account ID.")
    }

    const resp = await Accounts.document().get(id);

    if (!resp.ok) {
        throw new Error("It failed to retrieve an account.");
    }

    if (!resp.value.data) {
        throw new Error("The data for retrieving an account is null.");
    }

    assert.deepEqual(account, resp.value, "The data inside account does not match the data we get.");


};

describe("Testing Accounts", async () => {
    describe("Get", async () => {
        it("Gets data", async () => {
            await get("57db30401b847a549ce703e5");
        });
    });
});
