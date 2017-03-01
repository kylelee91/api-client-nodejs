import { Accounts } from "../src";
import { assert } from "chai";

export async function get() {
    const account = {
        "data": {
            "id": "583e36ad1b847a4c714cd8c7",
            "username": "kylelee2",
            "name": {
                "first": "First",
                "last": "Last"
            },
            "teams": [],
            "position": null,
            "email": {
                "address": "zomgitskyle@gmail.com",
                "verified": true,
                "last_notice": "2016-11-30T02:17:17.285Z",
                "notices": 1,
                "added": "2016-11-30T02:17:17.097Z"
            },
            "auth": {
                "allow_employee_login": true
            },
            "billing": {
                "trial": {
                    "start": "2016-12-04T21:11:42.957Z",
                    "end": "2016-12-26T21:11:42.957Z",
                    "ended": "1901-01-01T00:00:00Z"
                },
                "term": {
                    "start": "2017-02-27T18:28:42.897Z",
                    "end": "2017-03-27T18:28:42.897Z"
                },
                "tier": "574d2e9d1c4568c6f3aaf8d4",
                "restrictions": {
                    "containers": 5
                },
                "disable": null
            },
            "state": {
                "changed": "2016-12-07T03:11:31.993Z",
                "job": {
                    "id": "",
                    "queued": "0001-01-01T00:00:00Z",
                    "queue": ""
                },
                "current": "live"
            },
            "events": {
                "created": "2016-11-30T02:17:17.097Z",
                "updated": "0001-01-01T00:00:00Z",
                "deleted": "0001-01-01T00:00:00Z",
                "last_login": "2017-02-28T00:13:18.143Z",
                "suspension": {
                    "time": "2016-12-07T03:11:31.994Z",
                    "code": "",
                    "reason": "Trial period ended with active services.",
                    "grace_period": "2016-12-21T03:11:31.994Z",
                    "purged": "0001-01-01T00:00:00Z"
                }
            }
        }
    };

    const resp = await Accounts.document().get();

    if (!resp.ok) {
        throw new Error("It failed to retrieve an account.");
    }

    if (!resp.value.data) {
        throw new Error("The data for retrieving an account is null.");
    }

    assert.deepEqual(account.data, resp.value.data, "The data inside account does not match the data we get.");
};

export async function update() {
    const account = {
        name: {
            first: "Kyle",
            last: "Lee"
        },
        auth: {
            allow_employee_login: true
        }
    };

    const resp = await Accounts.document().update(account);
    if (!resp.ok) {
        throw new Error("It failed to update your account.");
    }
    if (!resp.value.data) {
        throw new Error("The data for updating account is null.");
    }

    assert.equal(account.name.first, resp.value.data.name.first, "The updated first name does not match.");
    assert.equal(account.name.last, resp.value.data.name.last, "The updated last name does not match.");
    assert.equal(account.auth.allow_employee_login, resp.value.data.auth.allow_employee_login,
        "The updated allow employee login does not match.");


};

describe("Testing Accounts", async () => {
    // describe("Getting account data", async () => {
    //     it("Get", async () => {
    //         await get();
    //     });
    // });

    describe("Updating Account", async () => {
        it("Update", async () => {
            await update();
        });
    });
});
