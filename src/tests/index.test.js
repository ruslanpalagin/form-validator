const FormValidator = require("../index");
const validators = require("../defaultValidators");
const messagesEn = require("../defaultMessagesEn");

const resourceValidator = new FormValidator(validators, messagesEn);

describe("resourceValidator", () => {
    beforeAll(() => {
        resourceValidator.isValid = jest.fn(resourceValidator.isValid)
    })
    afterEach(() => {
        resourceValidator.isValid.mockClear()
    })

    describe("parseValidator", () => {
        it("should handle string definitions", async () => {
            const { validator, params } = await resourceValidator.parseValidator('required:foo:bar');
            expect(typeof validator).toEqual('function')
            expect(params).toEqual(['foo', 'bar'])
        });
        it("should handle object definitions", async () => {
            const { validator, params, message } = await resourceValidator.parseValidator({ name: 'required', params: ['foo', 'bar'], message: "Required!" });
            expect(typeof validator).toEqual('function')
            expect(params).toEqual(['foo', 'bar'])
            expect(message).toEqual("Required!")
        });
        it("should handle callback", async () => {
            const { validator, params } = await resourceValidator.parseValidator(() => "Error message");
            expect(typeof validator).toEqual('function')
            expect(params).toEqual([])
        });
        it("should throw exception if validator not found", async () => {
            expect(() => resourceValidator.parseValidator('nonexistingvalidator')).toThrow(Error)
        });
    });
    describe("isValidField", () => {
        it("should pass validation", async () => {
            const resource = { email: "e@xa.mpl" }
            const schema = ['required']

            const { isValid, errors } = await resourceValidator.isValidField('email', resource, schema);

            expect(isValid).toBeTruthy()
            expect(errors).toHaveLength(0)
        });
        it("should return error", async () => {
            const resource = { email: "" }
            const schema = ['required']

            const { isValid, errors } = await resourceValidator.isValidField('email', resource, schema);

            expect(isValid).toBeFalsy()
            expect(errors).toHaveLength(1)
        });
        it("should return error from overriden message (string)", async () => {
            const resource = { email: "" }
            const schema = [{ name: 'required', message: 'another message' }]

            const { errors } = await resourceValidator.isValidField('email', resource, schema);

            expect(errors[0].message).toEqual('another message')
        });
        it("should handle error arrays", async () => {
            const resource = { email: "" }
            const schema = [ () => ([{ message: "yo" }]) ]

            const { errors } = await resourceValidator.isValidField('email', resource, schema);

            expect(errors[0].message).toEqual('yo')
        });
        it("should handle hasOne nesting", async () => {
            const resource = { user: { email: "" } }
            const schema = [resourceValidator.hasOne({ email: ['required'] })]

            const { errors } = await resourceValidator.isValidField('user', resource, schema);

            expect(errors[0].field).toEqual('user.email')
            expect(errors[0].message).toEqual('Required')
        });
        it("should handle hasMany nesting", async () => {
            const resource = { users: [ { email: "" } ] }
            const schema = [resourceValidator.hasMany({ email: ['required'] })]

            const { errors } = await resourceValidator.isValidField('users', resource, schema);

            expect(errors[0].field).toEqual('users[0].email')
            expect(errors[0].message).toEqual('Required')
        });
        it("should support none arrays as a rule to simplify definitions", async () => {
            const resource = { email: '' }
            const schema = 'required'

            const { errors } = await resourceValidator.isValidField('email', resource, schema);

            expect(errors[0].field).toEqual('email')
            expect(errors[0].message).toEqual('Required')
        });
    });
    describe("getErrorMessage", () => {
        it("should return validation result if rule.message is falsy", async () => {
            const errorMessage = resourceValidator.getErrorMessage('required', undefined);
            expect(errorMessage).toEqual('required')
        });
        it("should return schema.message if that is string", async () => {
            const errorMessage = resourceValidator.getErrorMessage('required', 'override');
            expect(errorMessage).toEqual('override')
        });
        it("should call message callback if its a function", async () => {
            const errorMessage = resourceValidator.getErrorMessage('required', ({ fieldName }) => `${fieldName} is really required!`, { fieldName: 'email' });
            expect(errorMessage).toEqual('email is really required!')
        });
    });
    describe("getTouchedFromSchema", () => {
        it("should return key => true for simple objects", async () => {
            const schema = {
                email: ['required'],
                password: ['required'],
            }
            const touched = resourceValidator.getTouchedFromSchema(schema)
            expect(touched).toEqual({
                email: true,
                password: true,
            })
        });
        it("should return key => true for hasMany", async () => {
            const nestedSchema = { name: ['required'] }
            const schema = {
                email: ['required'],
                password: ['required'],
            }
            const touched = resourceValidator.getTouchedFromSchema(schema)
            expect(touched).toEqual({
                email: true,
                password: true,
            })
        });
    });
    describe("format", () => {
        it("should format", async () => {
            const message = resourceValidator.format("Foo: %{foo}", { foo: "bar" })
            expect(message).toEqual("Foo: bar")
        });
    });
    describe("t integration", () => {
        it("should translate using string message", async () => {
            const specialResourceValidator = new FormValidator(validators, {
                required: "Required!!"
            });
            const resource = { foo: '' }
            const { errors } = await specialResourceValidator.isValid(resource, { foo: "required" });
            expect(errors.foo[0]).toEqual("Required!!")
        });
    });
});
