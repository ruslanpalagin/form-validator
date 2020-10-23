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

    describe("isValid", () => {
        it("should handle crazy scenarios and pass context", async () => {
            const resource = {
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
            const schema = {
                resources: [
                    resourceValidator.hasMany({
                        posts: [
                            resourceValidator.hasMany({
                                comments: [
                                    resourceValidator.hasMany({
                                        author: resourceValidator.hasOne({ id: 'required' })
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }

            const { errors } = await resourceValidator.isValid(resource, schema);

            expect(errors['resources[0].posts[0].comments[0].author.id']).toEqual(['Required'])
        });
        it("should return original resource data as well", async () => {
            const resource = { foo: 'bar' }
            const { resource: returnedForm } = await resourceValidator.isValid(resource, {});
            expect(returnedForm).toEqual(resource)
        })
        it("should pass context", async () => {
            const resource = { posts: [{}] }
            const schema = { posts: resourceValidator.hasMany({ name: 'required' }) }
            await resourceValidator.isValid(resource, schema);

            const calls = resourceValidator.isValid.mock.calls
            expect(calls[0][2]).toBeUndefined()
            expect(calls[1][2].rootResource).toEqual(resource)
        })
        it("hasMany should pass an itemIndex with context", async () => {
            const resource = { posts: [{}, {}] }
            const schema = { posts: resourceValidator.hasMany({ name: 'required' }) }
            await resourceValidator.isValid(resource, schema);

            const calls = resourceValidator.isValid.mock.calls
            expect(calls[1][2].itemIndex).toEqual(0)
            expect(calls[2][2].itemIndex).toEqual(1)
        });
    })
    describe("length", () => {
        it("should return format message", async () => {
            const resource = { name: "ab" }
            const { errors } = await resourceValidator.isValid(resource, { name: 'length:3:7' });
            expect(errors.name[0]).toEqual("Minimum 3 symbols required")
        })
    })
});
