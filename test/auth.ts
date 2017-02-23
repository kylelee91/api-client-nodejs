import { Auth, Accounts } from "../src";

declare var process: {
    readonly env: any;
};

describe("Test Authorization", async () => {
    it("Auth via API Key", async () => {
        let result = await Auth.apiKeyAuth({
            secret: process.env.APIKEY
        });

        if (!result.ok) {
            throw new Error(result.error.detail);
        }
    });

    // describe("Change password Test", async () => {
    //     let newPass: string;
    //     before("Generate random password", () => {
    //         newPass = Math.random().toString(36).substring(7);
    //     });

    //     it("Change", async () => {
    //         let acct = await Accounts.document().get();
    //         if (!acct.ok) {
    //             return;
    //         }
    //         let changePassResp = await Accounts.document().changePassword({
    //             current: process.env.PASSWORD,
    //             new: newPass
    //         });
    //         if (!changePassResp.ok) {
    //             throw new Error(changePassResp.error.title);
    //         }
    //         const authResp = await Auth.passwordAuth({
    //             username: process.env.USERNAME,
    //             password: newPass
    //         });
    //         if (!authResp.ok) {
    //             throw new Error(authResp.error.title);
    //         }
    //     });

    //     after("Change password back", async () => {
    //         let resp = await Accounts.document().changePassword({
    //             current: newPass,
    //             new: process.env.PASSWORD
    //         });
    //         if (!resp.ok) {
    //             throw new Error(`Password could not be changed back, your password is ${newPass}`);
    //         }
    //     });
    // });
});
