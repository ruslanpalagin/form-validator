const t = (...args) => args
const length = require("../defaultValidators/length");

describe("defaultValidators/length", () => {
    describe("from N1 to N2", () => {
        const params = ['5', '10']
        it("success if between", async () => {
            expect(
                length({ value: "1234567", params, t })
            ).toBeUndefined()
        });
        it("success if = min", async () => {
            expect(
                length({ value: "12345", params, t })
            ).toBeUndefined()
        });
        it("success if = max", async () => {
            expect(
                length({ value: "1234512345", params, t })
            ).toBeUndefined()
        });
        it("fail if less than", async () => {
            expect(
                length({ value: "12", params, t })
            ).not.toBeUndefined()
        });
        it("fail if gt than", async () => {
            expect(
                length({ value: "1234567890:more", params, t })
            ).not.toBeUndefined()
        });
    });
    describe("from 0 to N2", () => {
        const params = ['0', '5']
        it("success if empty string", async () => {
            expect(
                length({ value: "", params, t })
            ).toBeUndefined()
        });
        it("success if null", async () => {
            expect(
                length({ value: null, params, t })
            ).toBeUndefined()
        });
        it("success if undefined", async () => {
            expect(
                length({ value: undefined, params, t })
            ).toBeUndefined()
        });
        it("success if in between", async () => {
            expect(
                length({ value: "123", params, t })
            ).toBeUndefined()
        });
        it("fail if gt", async () => {
            expect(
                length({ value: "1234567", params, t })
            ).not.toBeUndefined()
        });
    });
    describe("from undef to N2", () => {
        const params = ['', '5']
        it("success if empty string", async () => {
            expect(
                length({ value: "", params, t })
            ).toBeUndefined()
        });
        it("success if null", async () => {
            expect(
                length({ value: null, params, t })
            ).toBeUndefined()
        });
        it("success if undefined", async () => {
            expect(
                length({ value: undefined, params, t })
            ).toBeUndefined()
        });
        it("success if in between", async () => {
            expect(
                length({ value: "123", params, t })
            ).toBeUndefined()
        });
        it("fail if gt", async () => {
            expect(
                length({ value: "1234567", params, t })
            ).not.toBeUndefined()
        });
    });
    describe("from N1 to undef", () => {
        const params = ['5', '']
        it("fail if empty string", async () => {
            expect(
                length({ value: "", params, t })
            ).not.toBeUndefined()
        });
        it("fail if null", async () => {
            expect(
                length({ value: null, params, t })
            ).not.toBeUndefined()
        });
        it("fail if undefined", async () => {
            expect(
                length({ value: undefined, params, t })
            ).not.toBeUndefined()
        });
        it("success if gt than N1", async () => {
            expect(
                length({ value: "1234567", params, t })
            ).toBeUndefined()
        });
    });
});
