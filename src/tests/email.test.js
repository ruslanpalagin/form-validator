const t = (...args) => args
const email = require("../defaultValidators/email");

describe("defaultValidators/required", () => {
    describe("is passing", () => {
        it("for email", async () => {
            expect(
                email({ value: "email@example.com", t })
            ).toBeUndefined()
        });
    });
    describe("is failing", () => {
        it("for an empty string", async () => {
            expect(
                email({ value: "", t })
            ).toBeDefined()
        });
        it("for null", async () => {
            expect(
                email({ value: null, t })
            ).toBeDefined()
        });
        it("for undefined", async () => {
            expect(
                email({ value: undefined, t })
            ).toBeDefined()
        });
        it("for false", async () => {
            expect(
                email({ value: false, t })
            ).toBeDefined()
        });
    });
});
