import { Auth } from "../src";

declare var process: {
    readonly env: any;
};

describe( "Test Authorization", async () => {
    it("Auth via API Key", async() => {
        let result = await Auth.apiKeyAuth({
            secret: process.env.APIKEY
        });

        if (!result.ok) {
            throw new Error(result.error.detail);
        }
    });
});
