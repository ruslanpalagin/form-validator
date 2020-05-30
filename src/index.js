
class FormValidator {
    constructor(rules = {}, language) {
        this.rules = rules;
        this.language = language;
    }
    /**
     * @return {{isValid: Boolean, errors: Object, errorsArray: Array}}
     * Example:
     *   const form = { email: 'email@com', password: 'foo' };
     *   const rules = { email: ['required', 'email'] };
     *   isValid(form, rules);
     */
    async isValid(formData, rules, language) {
        let errorsArray = [];
        const keys = Object.keys(rules);
        for (let i in keys) {
            const field = keys[i];
            const { isValid, errors } = await this.isValidField(field, formData, rules[field], language);
            if (!isValid) {
                errorsArray = errorsArray.concat(errors);
            }
        }
        const errors = {};
        errorsArray.forEach(({ field, message }) => {
            errors[field] = errors[field] || [];
            errors[field].push(message);
        });
        return { isValid: errorsArray.length === 0, errors, errorsArray };
    }

    /**
     * @return {{isValid: boolean, errors: Array}}
     * Example:
     *   const form = { email: 'email@com', password: 'foo' };
     *   isValidField('email', form, ['required', 'email']);
     */
    async isValidField(fieldName, formData, fieldRules = [], language = this.language) {
        let errors = [];
        for (let i = 0; i < fieldRules.length; i += 1) {
            const rule = fieldRules[i];
            const { validator, params } = this.extractValidator(rule);
            const validationResult = await validator({ value: formData[fieldName], params, formData, fieldName, language });
            if (validationResult !== null) {
                if (typeof validationResult === "string") {
                    errors.push({ field: fieldName, message: validationResult });
                }
                if (Array.isArray(validationResult)) {
                    errors = errors.concat(validationResult);
                }
            }
        }
        return { isValid: errors.length === 0, errors };
    }

    /**
     * Example:
     *   const form = { users: [ { name: "foo" }, { name: "" } ] };
     *   const rules = { users: [formValidator.hasMany({ name: ["required"] })] };
     *   formValidator.isValid(form, rules);
     *   // => errors: [{ field: "users[1].name", message: "Required" }]
     */
    hasMany(rules) {
        return async (value, options, attributes, fieldName) => {
            const resources = value;
            let allErrors = [];
            for (let i = 0; i < resources.length; i += 1) {
                const resource = resources[i];
                const { errorsArray = [] } = await this.isValid(resource, rules);
                for (let j = 0; j < errorsArray.length; j += 1) {
                    errorsArray[j].field = `${fieldName}[${i}].${errorsArray[j].field}`;
                }
                allErrors = allErrors.concat(errorsArray);
            }
            return allErrors;
        };
    }

    /**
     * Example:
     *   const form = { product: { "sku": "foo" } };
     *   const rules = { product: [formValidator.hasOne({ sku: ["required"] })] };
     *   formValidator.isValid(form, rules);
     *   // => errors: [{ field: "product.sku", message: "Required" }]
     */
    hasOne(rules) {
        return async (value, options, attributes, fieldName) => {
            const resource = value;
            let allErrors = [];
            const { errorsArray = [] } = await this.isValid(resource, rules);
            for (let j = 0; j < errorsArray.length; j += 1) {
                errorsArray[j].field = `${fieldName}.${errorsArray[j].field}`;
            }
            allErrors = allErrors.concat(errorsArray);
            return allErrors;
        };
    }

    isBulkObjectResultsValid(collectionOfErrorResults) {
        for (let i in collectionOfErrorResults) {
            if (this.isObjectHasErrors(collectionOfErrorResults[i])) {
                return {
                    isValid: false,
                };
            }
        }
        return {
            isValid: true,
        };
    }

    isObjectHasErrors(object) {
        for (let i in object) {
            if (object[i] && "length" in object[i] && object[i].length > 0) {
                return true;
            }
        }
        return false;
    }

    getTouchedFromSchema(schema) {
        const touched = {...schema};
        Object.keys(touched).forEach(key => touched[key] = true);
        return touched;
    }

    /** @private */
    extractValidator(rule) {
        if (typeof rule === "function") {
            return { validator: rule, params: [], message: rule.message };
        }
        if (typeof rule === "object") {
            const validator = this.rules[rule.name];
            return { validator, params: rule.params, message: rule.message };
        }
        if (typeof rule === "string") {
            const params = rule.split(":");
            const name = params.shift();
            const validator = this.rules[name];
            if (!validator) {
                throw new Error(`validator ${rule} not found`)
            }
            return { validator, params, message: rule.message };
        }
        return null;
    }
}

module.exports = FormValidator;