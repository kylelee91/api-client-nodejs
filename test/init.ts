// import * as Cycle from "../src";
// import "mocha";

// Cycle.setSettings({
//     url: "https://api.dev.cycle.io",
//     auth: {
//         tokenUrl: "https://portal.dev.cycle.io/auth/token",
//         refreshUrl: "https://portal.dev.cycle.io/auth/refresh"
//     }
// });

// describe("Images", () => {
//     it("Gets Environments", async () => {
//         let e = await Cycle.Environments.document().get();
//         if (!e.ok) {
//             console.error(e.error);
//             return;
//         }

//         console.log(e.value);
//     });
// });

// async function test() {
//     let t = await Cycle.Accounts.document().get();
//     if (t.ok) {
//         console.log(t.value);
//         return;
//     }
//     console.log(t.error);
// }

// test();
