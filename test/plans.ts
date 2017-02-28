import { Plans } from "../src";
import { assert } from "chai";

export async function getPlan() {
    const resp = await Plans.document("5612bbbc58f23b6c0ec6df53").get();

    const contPlan = {
        "data": {
            "id": "5612bbbc58f23b6c0ec6df53",
            "name": "128MB",
            "public": false,
            "trial": true,
            "most_popular": false,
            "resources": {
                "ram": {
                    "limit": 128,
                    "reserve": 32,
                    "swap": 0
                },
                "cpu": {
                    "period": 10000,
                    "quota": 2500
                },
                "storage": {
                    "read": 50,
                    "write": 50,
                    "base_size": 512
                },
                "network": {
                    "private": 125,
                    "public": 100
                }
            },
            "price": {
                "month": 2750
            }
        }
    };

    if (!resp.ok) {
        throw new Error("It failed to retrieve container plan");
    }

    if (!resp.value.data) {
        throw new Error("The data for retrieving container plan is null");
    }

    assert.deepEqual(contPlan, resp.value, "The container plan retrieved is different than expected");
};

describe("Tests Plans", async () => {
    describe("Tests Plans", async () => {
        it("Gets Container Plan", async () => {
            await getPlan();
        });
    });
});