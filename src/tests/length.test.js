const t = (...args) => args
const length = require("../defaultValidators/length");

const params = ['1', '3']

describe("defaultValidators/length", () => {
    describe("is passing", () => {
        it("for max", async () => {
            expect(
                length({ value: "ABC", params, t })
            ).toBeUndefined()
        });
        it("for between", async () => {
            expect(
                length({ value: "AB", params, t })
            ).toBeUndefined()
        });
        it("for min", async () => {
            expect(
                length({ value: "a", params, t })
            ).toBeUndefined()
        });
    });
    describe("is failing", () => {
        it("for length < min", async () => {
            expect(
                length({ value: "", params, t })
            ).toBeDefined()
        });
        it("for length > max", async () => {
            expect(
                length({ value: "abcd", params, t })
            ).toBeDefined()
        });
        it("for null", async () => {
            expect(
                length({ value: null, params, t })
            ).toBeDefined()
        });
        it("for undefined", async () => {
            expect(
                length({ value: undefined, params, t })
            ).toBeDefined()
        });
        it("for false", async () => {
            expect(
                length({ value: false, params, t })
            ).toBeDefined()
        });
        it("for number", async () => {
            expect(
                length({ value: 1, params, t })
            ).toBeDefined()
        });
    });
});
