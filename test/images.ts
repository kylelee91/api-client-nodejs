import { Images } from "../src";
import { assert, expect } from "chai";

export async function dockerImport(repo: string) {
    const imageName = "Test Image";
    const imageDescription = "Test Description";
    const imageRepo = repo;
    const imageTag = "latest";
    const image = {
        name: imageName,
        about: {
            description: imageDescription
        },
        repo: imageRepo,
        tag: imageTag
    };

    const resp = await Images.document().dockerhub.import({
        name: image.name,
        about: {
            description: image.about.description
        },
        repo: image.repo,
        tag: image.tag
    });

    if (!resp.ok) {
        throw new Error("It failed to import an image from dockerhub.");
    }
    if (!resp.value.data) {
        throw new Error("The data for importing an image is null.");
    }

    assert.equal(image.name, resp.value.data.name, "The image name does not match the name used to import");
    assert.equal(image.about.description, resp.value.data.about.description,
        "The image description does not match the description used to import image");
    assert.equal(image.repo, resp.value.data.source.repo, "The image repo does not match the repo used to import");
    assert.equal(image.tag, resp.value.data.source.tag, "The image tag does not match the tag used to import");

    return resp.value.data.id;
}

export async function build(id: string | undefined) {
    if (!id) {
        throw new Error("An existing image ID wasn't set. You must use an existing image ID.")
    }

    const resp = await Images.document(id).build();
    if (!resp.ok) {
        throw new Error("It failed to build an image.");
    }

    if (!resp.value.data) {
        throw new Error("The data for building an image is null.");
    }

};

export async function update(id: string | undefined) {
    if (!id) {
        throw new Error("An existing image ID wasn't set. You must use an existing image ID.")
    }
    const updateName = "Update Image";
    const updateDescription = "Update Description";
    const image = {
        name: updateName,
        about: {
            description: updateDescription
        }
    };

    const resp = await Images.document(id).update({
        name: image.name,
        about: {
            description: image.about.description
        }
    });

    if (!resp.ok) {
        throw new Error("It failed to update an image.");
    }

    if (!resp.value.data) {
        throw new Error("The data for updating an image is null.");
    }

    assert.equal(image.name, resp.value.data.name, "The updated image name does not match the name used to update");
    assert.equal(image.about.description, resp.value.data.about.description,
        "The updated image description does not match the description used to update")
}

export async function del(id: string | undefined) {
    if (!id) {
        throw new Error("An existing image ID wasn't set. You must use an existing image ID.")
    }

    const resp = await Images.document(id).delete();
    if (!resp.ok) {
        throw new Error("It failed to delete an image.");
    }
    if (!resp.value.data) {
        throw new Error("The data for deleting an image is null.");
    }
};

export async function deleteUnused() {
    const resp = await Images.document().deleteUnused();
    if (!resp.ok) {
        throw new Error("It failed to delete unused image.");
    }
    if (!resp.value.data) {
        throw new Error("The data for deleting unused images is null.");
    }
};

async function runImageTestImport(repo: string) {
    let id: string | undefined;

    before("Import", async () => {
        if (!id) {
            id = await dockerImport(repo);
        }
    });

    it("Build", async () => {
        await build(id);
    });

    it("Update", async () => {
        await update(id);
    });

    after("Delete", async () => {
        await del(id);
    });
    return id;
}

describe("Testing Images", async () => {
    describe("Import, Build, Update, and Delete", async () => {
        await Promise.all([
            runImageTestImport("cycleplatform/website-daemon"),
            runImageTestImport("cycleplatform/minecraft"),
            runImageTestImport("gitlab/gitlab-ce")
        ]);
    });

    describe("Delete unused images", async () => {
        before("Import image", async () => {
            await Promise.all([
                dockerImport("cycleplatform/website-daemon"),
                dockerImport("cycleplatform/minecraft"),
                dockerImport("gitlab/gitlab-ce")
            ]);
        });
        it("Delete", async () => {
            await deleteUnused();
        });
    });

    describe("Deleted image", async () => {
        let id: string | undefined;
        before("Import", async () => {
            id = await dockerImport("cycleplatform/website-daemon");
            await del(id);
        });
        it("Delete", () => {
            return del(id).then((resp) => {
                throw Error("Deleted a deleted image");
            }, () => {/* */});
        });

        it("Update", () => {
            return update(id).then((resp) => {
                throw Error("Updated a deleted image");
            }, () => {/* */});
        });

        it("Build", () => {
            return build(id).then((resp) => {
                throw Error("Built a deleted image");
            }, () => {/* */});
        });
    });
});
