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
        it("should pass validation", async () => {
            const form = { email: "e@xa.mpl" }
            const rules = ['required']

            const { isValid, errors } = await formValidator.isValidField('email', form, rules);

            expect(isValid).toBeTruthy()
            expect(errors).toHaveLength(0)
        });
        it("should return error", async () => {
            const form = { email: "" }
            const rules = ['required']

            const { isValid, errors } = await formValidator.isValidField('email', form, rules);

            expect(isValid).toBeFalsy()
            expect(errors).toHaveLength(1)
        });
        it("should return error from overriden message (string)", async () => {
            const form = { email: "" }
            const rules = [{ name: 'required', message: 'another message' }]

            const { errors } = await formValidator.isValidField('email', form, rules);

            expect(errors[0].message).toEqual('another message')
        });
        it("should handle error arrays", async () => {
            const form = { email: "" }
            const rules = [ () => ([{ message: "yo" }]) ]

            const { errors } = await formValidator.isValidField('email', form, rules);

            expect(errors[0].message).toEqual('yo')
        });
        it("should handle hasOne nesting", async () => {
            const form = { user: { email: "" } }
            const rules = [formValidator.hasOne({ email: ['required'] })]

            const { errors } = await formValidator.isValidField('user', form, rules);

            expect(errors[0].field).toEqual('user.email')
            expect(errors[0].message).toEqual('Required')
        });
        it("should handle hasMany nesting", async () => {
            const form = { users: [ { email: "" } ] }
            const rules = [formValidator.hasMany({ email: ['required'] })]

            const { errors } = await formValidator.isValidField('users', form, rules);

            expect(errors[0].field).toEqual('users[0].email')
            expect(errors[0].message).toEqual('Required')
        });
    });
    describe("isValid", () => {
        it("should handle crazy scenarios", async () => {
            const form = {
                resources: [
                    {
                        posts: [
                            {
                                comments: [
                                    {
                                        author: {
                                            id: null,
                                        },
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
            const rules = {
                resources: [
                    formValidator.hasMany({
                        posts: [
                            formValidator.hasMany({
                                comments: [
                                    formValidator.hasMany({
                                        author: [
                                            formValidator.hasOne({ id: ['required'] })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }

            const { errors } = await formValidator.isValid(form, rules);

            expect(errors['resources[0].posts[0].comments[0].author.id']).toEqual(['Required'])
        });
    })
    describe("getErrorMessage", () => {
        it("should return validation result if rule.message is falsy", async () => {
            const errorMessage = formValidator.getErrorMessage('required', undefined);
            expect(errorMessage).toEqual('required')
        });
        it("should return rules.message if that is string", async () => {
            const errorMessage = formValidator.getErrorMessage('required', 'override');
            expect(errorMessage).toEqual('override')
        });
        it("should call message callback if its a function", async () => {
            const errorMessage = formValidator.getErrorMessage('required', ({ fieldName }) => `${fieldName} is really required!`, { fieldName: 'email' });
            expect(errorMessage).toEqual('email is really required!')
        });
    });
});
