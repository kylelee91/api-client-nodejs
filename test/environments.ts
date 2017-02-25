declare function require(name: string): any;

//import { IdResults, Results, ErrorResults } from "./common";
import { Environments, Utils } from "../src";
import { assert } from "chai";


export async function create() {
    const envName = "Test Environments";
    const envDescription = "Test envDescription";
    const env = {
        name: envName,
        about: {
            description: envDescription
        }
    };

    // call create
    const resp = await Environments.document().create({
        name: envName,
        about: {
            description: envDescription
        }
    });

    if (!resp.ok) {
        //throw;
        throw new Error("It failed to create data for your environment.");
    }

    if (!resp.value.data) {
        // No data, error because we should have an env. in the data
        throw new Error("The data for creating a environment is null.");

    }

    assert.equal(resp.value.data.name, env.name, "The environment created does not match the name used to create environment");
    assert.equal(resp.value.data.about.description, env.about.description,
        "The environment created does not match the name used to create environment");
    // everything good, print success

    return resp.value;
};


export async function update(env: Environments.Single | undefined) {
    // again
    if (!env || !env.data) {
        //error - working ID wasn't set. must get id of env first
        throw new Error("An existing environment wasn't set. You must use an existing environment.");
    }
    const updateEnvName = "Update Environment";
    const updateEnvDescription = "Update envDescription";
    const newEnv = {
        name: updateEnvName,
        about: {
            description: updateEnvDescription
        }
    };
    const resp = await Environments.document(env.data.id).update({
        name: newEnv.name,
        about: {
            description: newEnv.about.description
        }
    });

    if (!resp.ok) {
        throw new Error("Updating an environment has failed because a structure wasn't returned.");
    }

    if (!resp.value.data) {
        throw new Error("The data for updating an environment is null.");
    }

    assert.equal(newEnv.name, resp.value.data.name, "The environment updated does not match the name used to update environment");
    assert.equal(newEnv.about.description, resp.value.data.about.description,
        "The environment updated does not match the name used to create environment");
};

export async function del(env: Environments.Single | undefined) {
    if (!env || !env.data) {
        //error - working ID wasn't set. must get id of env first
        throw new Error("An existing environment wasn't set. You must use an existing environment.");
    }

    const resp = await Environments.document(env.data.id).delete();
    if (!resp.ok || !resp.value.data.job) {
        throw new Error("It failed to create job: delete environment.");
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

export async function getSingle() {
    let id: string | undefined;

    const env = await create();
    if (!env.data) {
        //error - working ID wasn't set. must get id of env first
        throw new Error("An existing environment wasn't set. You must use an existing environment.");
    }
    id = env.data.id;

    const resp = await Environments.document(id).get();
    if (!resp.ok) {
        throw new Error("It failed to get a single environment.");
    }

    if (!resp.value.data) {
        throw new Error("The data for getting a single environment is null.");
    }
    assert.deepEqual(env.data, resp.value.data, "The response from get does not match the response expected.");


    return env;
};

export async function getCollection() {
    const resp = await Environments.document().get();

    if (!resp.ok) {
        throw new Error("It failed to get a collection of environment.");
    }

    if (!resp.value.data) {
        throw new Error("The data for getting a collection of environments is null.");
    }
}

// describe("Testing Environments", async () => {
//     describe("Create, Update, and Delete", async () => {
//         let env: Environments.Single | undefined;
//         before("Create", async () => {
//             if (!env) {
//                 env = await create();
//             }
//             return env;
//         });

//         it("Update", async () => {
//             await update(env);
//         });

//         after("Delete", async () => {
//             await del(env);
//         });
//     });

//     describe("Deleted environment", async () => {
//         let env: Environments.Single | undefined;
//         before("Creating environment", async () => {
//             if (!env) {
//                 env = await create();
//                 await del(env);
//             }
//         });

//         it("Update", () => {
//             return update(env).then(() => {
//                 throw Error("Updated a deleted environment");
//             }, () => {/* */ });
//         });

//         it("Delete", () => {
//             return del(env).then((resp) => {
//                 throw Error("Deleted a deleted environment");
//             }, () => {/* */ });
//         });
//     });

//     describe("Creates environment and checks response from get", async () => {
//         let env: Environments.Single | undefined;
//         it("Get", async () => {
//             env = await getSingle();
//             return env;
//         });

//         after("Deletes environment", async () => {
//             await del(env);
//         });
//     });

//     describe("Get collection of environments", async () => {
//         it("Get", async () => {
//             await getCollection();
//         });
//     });
// });
