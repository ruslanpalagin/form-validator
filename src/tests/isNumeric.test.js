const t = (...args) => args
const isNumericTest = require("../defaultValidators/isNumeric");

describe("defaultValidators/isNumeric", () => {
    describe("is passing", () => {
        it("int number", async () => {
            expect(
                isNumericTest({ value: 10, t })
            ).toBeUndefined()
        });
        it("float number", async () => {
            expect(
                isNumericTest({ value: 10.1, t })
            ).toBeUndefined()
        });
        it("int string", async () => {
            expect(
                isNumericTest({ value: "10", t })
            ).toBeUndefined()
        });
        it("float string", async () => {
            expect(
                isNumericTest({ value: "10.1", t })
            ).toBeUndefined()
        });
    });
    describe("is failing", () => {
        it("for undefined", async () => {
            expect(
                isNumericTest({ value: undefined, t })
            ).toBeDefined()
        });
        it("for null", async () => {
            expect(
                isNumericTest({ value: null, t })
            ).toBeDefined()
        });
        it("for NaN", async () => {
            expect(
                isNumericTest({ value: NaN, t })
            ).toBeDefined()
        });
        it("for an empty string", async () => {
            expect(
                isNumericTest({ value: "", t })
            ).toBeDefined()
        });
        it("for a text", async () => {
            expect(
                isNumericTest({ value: "asdasdas", t })
            ).toBeDefined()
        });
    });
});
