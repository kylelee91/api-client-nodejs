//import { IdResults, Results, ErrorResults } from "./common";
import { Environments, API } from "../src";
import { assert } from "chai";
import { CreateContainer } from "./containers";


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

    return resp.value.data.id;
};


export async function update(id: string | undefined) {
    // again
    if (!id) {
        //error - working ID wasn't set. must get id of env first
        throw new Error("An existing environment ID wasn't set. You must use an existing environment ID.");
    }
    const updateEnvName = "Update Environment";
    const updateEnvDescription = "Update envDescription";
    const env = {
        name: updateEnvName,
        about: {
            description: updateEnvDescription
        }
    };
    const resp = await Environments.document(id).update({
        name: env.name,
        about: {
            description: env.about.description
        }
    });

    if (!resp.ok) {
        throw new Error("Updating an environment has failed because a structure wasn't returned.")
    }

    if (!resp.value.data) {
        throw new Error("The data for updating an environment is null.");
    }

    assert.equal(resp.value.data.name, env.name, "The environment updated does not match the name used to update environment");
    assert.equal(resp.value.data.about.description, env.about.description,
        "The environment updated does not match the name used to create environment");
};

export async function del(id: string | undefined) {
    if (!id) {
        //error - working ID wasn't set. must get id of env first
        throw new Error("An existing environment ID wasn't set. You must use an existing environment ID.");
    }

    const resp = await Environments.document(id).delete();
    if (!resp.ok) {
        throw new Error("It failed to delete the environment");
    }

};

describe("Testing Environments", async () => {
    describe("Create, Update, Delete", async () => {
        let id: string | undefined = undefined;
        before("Creating environment", async () => {
            if (!id) {
                id = await create();
            }
        });

        it("Updating environment", async () => {
            await update(id);
        });

        after("Deleting environment", async () => {
            await del(id);
        });
    });

    describe("Deleted environment", async () => {
        let id: string | undefined = undefined;
        before("Creating environment", async () => {
            if (!id) {
                id = await create();
                await del(id);
            }
        });

        it("Update environment", async () => {
            await update(id);
        });

        it("Delete environment", async () => {
            await del(id);
        });
    });
});
