export type TValidator = () => any

export type TValidatorsMap = {
    [validatorName: string]: (string | TValidator)[]
}

export type TMessagesMap = {
    [validatorErrorKey: string]: string
}

export type TErrors<TFormValues> = {
    [K in keyof TFormValues]?: string[]
}

export type TError = {
    value: unknown,
    params: unknown,
    resource: unknown,
    fieldName: string,
    message: string,
    context: unknown,
    t: (messageKey: string, params: unknown) => void,
}

export type TValidatorResult<TFormValues = any> = {
    isValid: boolean
    errors: TErrors<TFormValues>
    errorsArray: TError[]
    resource: TFormValues
}

declare class Validator {
    constructor(validators?: TValidatorsMap, messages?: TMessagesMap);
    isValid(resource: any, schema: any, context?: { rootResource?: any }): Promise<TValidatorResult>
}

export default Validator;
