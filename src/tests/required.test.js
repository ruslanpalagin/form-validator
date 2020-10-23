const t = (...args) => args
const validator = require("../defaultValidators/required");

describe("defaultValidators/required", () => {
    describe("is passing", () => {
        it("for string", async () => {
            expect(
                validator({ value: "0", t })
            ).toBeUndefined()
        });
        it("for 0", async () => {
            expect(
                validator({ value: 0, t })
            ).toBeUndefined()
        });
    });
    describe("is failing", () => {
        it("for an empty string", async () => {
            expect(
                validator({ value: "", t })
            ).toBeDefined()
        });
        it("for null", async () => {
            expect(
                validator({ value: null, t })
            ).toBeDefined()
        });
        it("for undefined", async () => {
            expect(
                validator({ value: undefined, t })
            ).toBeDefined()
        });
        it("for false", async () => {
            expect(
                validator({ value: false, t })
            ).toBeDefined()
        });
    });
});
