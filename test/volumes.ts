import { Plans } from "../src";
import { assert } from "chai";

export async function get() {
    const volumes = {
        "data": [
            {
                "id": "56ca412958f26052f5293473",
                "name": "1GB SSD (Local/Performance)",
                "public": true,
                "type": "SSD",
                "local": true,
                "resources": {
                    "storage": 1024
                },
                "price": {
                    "month": 500
                }
            },
            {
                "id": "56ca473458f26052f5293477",
                "name": "2GB SSD (Local/Performance)",
                "public": true,
                "type": "SSD",
                "local": true,
                "resources": {
                    "storage": 2048
                },
                "price": {
                    "month": 1000
                }
            },
            {
                "id": "56ca480758f26052f529347c",
                "name": "5GB SSD (Local/Performance)",
                "public": true,
                "type": "SSD",
                "local": true,
                "resources": {
                    "storage": 5124
                },
                "price": {
                    "month": 2000
                }
            },
            {
                "id": "56ca49df58f26052f529347f",
                "name": "10GB SSD (Local/Performance)",
                "public": true,
                "type": "SSD",
                "local": true,
                "resources": {
                    "storage": 10240
                },
                "price": {
                    "month": 3500
                }
            },
            {
                "id": "574c06501c4568c6f3aaf8cb",
                "name": "20GB SSD (Local/Performance)",
                "public": true,
                "type": "SSD",
                "local": true,
                "resources": {
                    "storage": 20480
                },
                "price": {
                    "month": 7000
                }
            },
            {
                "id": "57aa56c2a7c862925262c695",
                "name": "30GB SSD (Local/Performance)",
                "public": true,
                "type": "SSD",
                "local": true,
                "resources": {
                    "storage": 30720
                },
                "price": {
                    "month": 10500
                }
            }
        ]
    };

    const resp = await Plans.Volumes.document().get();
    if (!resp.ok) {
        throw new Error("It has failed to get volumes.");
    }
    if (!resp.value.data) {
        throw new Error("The data for getting volume is null.");
    }

    assert.deepEqual(volumes.data, resp.value.data, "The data from getting volumes does not match.");

};

describe("Testing Volumes", async () => {
    describe("Getting volume data", async () => {
        it("Get", async () => {
            await get();
        });
    });
});
