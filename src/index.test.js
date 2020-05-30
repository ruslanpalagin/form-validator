const FormValidator = require("./index");
const rules = require("./defaultRules");

const formValidator = new FormValidator(rules);

describe("formValidator", () => {
    describe("extractValidator", () => {
        it("should handle string definitions", async () => {
            const { validator, params } = await formValidator.extractValidator('required:foo:bar');
            expect(typeof validator).toEqual('function')
            expect(params).toEqual(['foo', 'bar'])
        });
        it("should handle object definitions", async () => {
            const { validator, params, message } = await formValidator.extractValidator({ name: 'required', params: ['foo', 'bar'], message: "Required!" });
            expect(typeof validator).toEqual('function')
            expect(params).toEqual(['foo', 'bar'])
            expect(message).toBeDefined()
        });
        it("should handle callback", async () => {
            const { validator, params } = await formValidator.extractValidator(() => "Error message");
            expect(typeof validator).toEqual('function')
            expect(params).toEqual([])
        });
        it("should throw exception if validator not found", async () => {
            expect(() => formValidator.extractValidator('nonexistingvalidator')).toThrow(Error)
        });
    });
    describe("isValidField", () => {
        it("should return error", async () => {
            const form = { email: "" }
            const rules = ['required']

            const { isValid, errors } = await formValidator.isValidField('email', form, rules);

            expect(isValid).toBeFalsy()
            expect(errors).toHaveLength(1)
        });
        it("should pass validation", async () => {
            const form = { email: "e@xa.mpl" }
            const rules = ['required']

            const { isValid, errors } = await formValidator.isValidField('email', form, rules);

            expect(isValid).toBeTruthy()
            expect(errors).toHaveLength(0)
        });
    });
});
