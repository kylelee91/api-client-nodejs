import { assert } from "chai";
import { Dns, Utils } from "../src";
const dns = require("dns");

export async function createZone() {
    const testOrigin = {
        origin: "test.com"
    };

    const resp = await Dns.Zones.document().create(testOrigin);
    if (!resp.ok) {
        throw new Error("It failed to create a DNS zone.");
    }

    if (!resp.value.data) {
        throw new Error("The data for creating a DNS zone is null.");
    }

    assert.equal(testOrigin.origin, resp.value.data.origin, "The origin used to create the DNS zone does not match the response.");

    return resp.value;
};

export async function updateZone(zone: Dns.Zones.Single) {
    if (!zone || !zone.data) {
        throw new Error("An existing DNS zone wasn't set. You must use an existing DNS zone.");
    }

    const updateOrigin = {
        origin: "Update.com"
    };

    const resp = await Dns.Zones.document(zone.data.id).update(updateOrigin);
    if (!resp.ok) {
        throw new Error("It failed to update a DNS zone.");
    }

    if (!resp.value.data) {
        throw new Error("The data for updating a DNS zone is null.");
    }

    assert.equal(updateOrigin.origin, resp.value.data.origin, "The origin used to update the DNS zone does not match the response.");
}

export async function delZone(zone: Dns.Zones.Single) {
    if (!zone || !zone.data) {
        throw new Error("An existing DNS zone wasn't set. You must use an existing DNS zone.");
    }

    const resp = await Dns.Zones.document(zone.data.id).delete();
    if (!resp.ok || !resp.value.data.job) {
        throw new Error("It failed to create job: delete DNS zone.");
    }

    const jobResp = await Utils.jobToComplete({
        id: resp.value.data.job
    });

    if (!jobResp.ok || !jobResp.value.data) {
        throw new Error("Getting job failed");
    }

    if (jobResp.value.data.state.current === "error" && jobResp.value.data.state.error) {
        throw new Error(`Job build failed: ${jobResp.value.data.state.error.message}`);
    }
};

export async function getSingleZone() {
    const zone = await createZone();

    if (!zone || !zone.data) {
        throw new Error("An existing DNS zone wasn't set. You must use an existing DNS zone.");
    }

    const resp = await Dns.Zones.document(zone.data.id).get();
    if (!resp.ok) {
        throw new Error("It failed to get a DNS zone.");
    }

    if (!resp.value.data) {
        throw new Error("The data for getting a DNS zone is null.");
    }

    assert.deepEqual(zone.data, resp.value.data, "The response from get Zone does not match the response expected");

    return zone;
};

export async function createRecord(zone: Dns.Zones.Single) {
    if (!zone || !zone.data) {
        throw new Error("An existing DNS zone wasn't set. You must use an existing DNS zone.");
    }

    const createRecord: Dns.Records.NewParams = {
        type: "a",
        assignable: true,
        name: "create",
        values: {
            ip: ""
        }
    };

    const resp = await Dns.Zones.document(zone.data.id).records().create(createRecord);

    if (!resp.ok) {
        throw new Error("It failed to create new record.");
    }

    if (!resp.value.data) {
        throw new Error("The data for creating record is null.");
    }

    assert.equal(createRecord.type, resp.value.data.type, "The record type used to update record does not match the response expected");
    assert.equal(createRecord.assignable, resp.value.data.assignable,
        "The record assignable used to update record does not match the response expected");
    assert.equal(createRecord.name, resp.value.data.name, "The record name used to update record does not match the response expected");
    assert.equal(createRecord.values.ip, resp.value.data.values.ip,
        "The record ip used to update record does not match the response expected");


    return resp.value;
};

export async function updateRecord(zone: Dns.Zones.Single, record: Dns.Records.Single) {
    if (!zone || !zone.data) {
        throw new Error("An existing DNS zone wasn't set. You must use an existing DNS zone.");
    }

    if (!record || !record.data) {
        throw new Error("An existing DNS record wasn't set. You must use an existing DNS record.");
    }

    const updateRecord: Dns.Records.NewParams = {
        type: "aaaa",
        assignable: true,
        name: "update",
        values: {
            ip: "2001:cdba:0000:0000:0000:0000:3257:9652"
        }
    };

    const resp = await Dns.Zones.document(zone.data.id).records(record.data.id).update(updateRecord);
    if (!resp.ok) {
        throw new Error("It failed to update record.");
    }
    if (!resp.value.data) {
        throw new Error("The data for updating record is null.");
    }

    assert.equal(updateRecord.type, resp.value.data.type, "The record type used to update record does not match the response expected");
    assert.equal(updateRecord.assignable, resp.value.data.assignable,
        "The record assignable used to update record does not match the response expected");
    assert.equal(updateRecord.name, resp.value.data.name, "The record name used to update record does not match the response expected");
    assert.equal(updateRecord.values.ip, resp.value.data.values.ip,
        "The record ip used to update record does not match the response expected");
};
/*
export async function delRecord(zone: Dns.Zones.Single, record: Dns.Records.Single) {
    if (!zone || !zone.data) {
        throw new Error("An existing DNS zone wasn't set. You must use an existing DNS zone.");
    }

    if (!record || !record.data) {
        throw new Error("An existing DNS record wasn't set. You must use an existing DNS record.");
    }

    const resp = await Dns.Zones.document(zone.data.id).records(record.data.id).delete();
    if (!resp.ok || !resp.value.data.job) {
        throw new Error("It failed to create job: delete DNS zone.");
    }

    const jobResp = await Utils.jobToComplete({
        id: resp.value.data.job;
    });

    if (!jobResp.ok || !jobResp.value.data) {
        throw new Error("Getting job failed");
    }

    if (jobResp.value.data.state.current === "error" && jobResp.value.data.state.error) {
        throw new Error(`Job build failed: ${jobResp.value.data.state.error.message}`);
    }
};*/

describe("Testing DNS", async () => {
    describe("Create, Update, and Delete DNS Zones", async () => {
        let zone: Dns.Zones.Single;
        before("Create", async () => {
            zone = await createZone();
        });
        it("Update", async () => {
            await updateZone(zone);
        });
        after("Delete", async () => {
            await delZone(zone);
        });
    });


    dns.setServers(["", ""]);
    dns.lookup("kylejlee.me");

    // describe("Creates DNS zone and checks response from get", async () => {
    //     let zone: Dns.Zones.Single;
    //     it("Get", async () => {
    //         zone = await getSingleZone();
    //     });
    //     after("Delete", async () => {
    //         await delZone(zone);
    //     });
    // });

    describe("Create, Update, and Delete DNS records", async () => {
        let zone: Dns.Zones.Single;
        let record: Dns.Records.Single;
        before("Create Zone and Record", async () => {
            zone = await createZone();
        });
        it("Create", async () => {
            record = await createRecord(zone);
        });
        it("Update", async () => {
            await updateRecord(zone, record);
        });
        // it("Delete", async () => {
        //     await delRecord(zone, record);
        // });
        after("Delete Zone", async () => {
            await delZone(zone);
        });
    });
});
