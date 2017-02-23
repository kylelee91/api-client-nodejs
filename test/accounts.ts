import { Accounts } from "../src";
import { assert, expect } from "chai";

export async function get(id: string) {
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
                    "start": "2017-02-12T21:07:02.246Z",
                    "end": "2017-03-12T21:07:02.246Z"
                },
                "tier": "574d2aea1c4568c6f3aaf8d0",
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
                "last_login": "2017-02-23T20:29:02.462Z",
                "suspension": {
                    "time": "2016-12-07T03:11:31.994Z",
                    "reason": "Trial period ended with active services.",
                    "grace_period": "2016-12-21T03:11:31.994Z",
                    "purged": "0001-01-01T00:00:00Z"
                }
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

    assert.deepEqual(account.data, resp.value.data, "The data inside account does not match the data we get.");
};

export async function update() {
    const firstname = "First";
    const lastname = "Last";
    const allowLogin = true;
    const account = {
        name: {
            first: firstname,
            last: lastname
        },
        auth: {
            allow_employee_login: allowLogin
        }
    };

    const resp = await Accounts.document().update({
        name: {
            first: account.name.first,
            last: account.name.last
        },
        auth: {
            allow_employee_login: account.auth.allow_employee_login
        }
    });
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
    describe("Getting account data", async () => {
        it("Get", async () => {
            await get("57db30401b847a549ce703e5");
        });
    });

    describe("Updating Account", async () => {
        it("Update", async () => {
            await update();
        });
    });
});
