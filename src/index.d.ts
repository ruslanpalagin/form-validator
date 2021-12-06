export = Validator;
/*~ Write your module's methods and properties in this class */
declare class Validator {
    constructor(validators?: {}, messages?: {});

    isValid(resource: any, schema: any, context: { rootResource?: any }): Promise<ValidatorResult>
}

type ValidatorResult = {
    isValid: boolean
    errors: Object
    errorsArray: Array<any>
    resource: any
}