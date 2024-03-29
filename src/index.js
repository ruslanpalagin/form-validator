
// @ts-ignore
class Ev {
    constructor(validators = {}, messages = {}) {
        this.validators = validators;
        this.messages = messages;
        this.FORMAT_REGEXP = /(%?)%\{([^\}]+)\}/g
    }

    t(messageKey, params) {
        return this.format(this.messages[messageKey], params)
    }
    /**
     * @return {{isValid: Boolean, errors: Object, errorsArray: Array}}
     * Example:
     *   const form = { email: 'email@com', password: 'foo' };
     *   const schema = { email: ['required', 'email'] };
     *   isValid(form, schema);
     */
    async isValid(resource, schema, context = null) {
        let errorsArray = [];
        context = context || {}
        context.rootResource = context.rootResource || resource
        const keys = Object.keys(schema);
        for (let i in keys) {
            const field = keys[i];
            const { isValid, errors } = await this.isValidField(field, resource, schema[field], context);
            if (!isValid) {
                errorsArray = errorsArray.concat(errors);
            }
        }
        const errors = {};
        errorsArray.forEach(({ field, message }) => {
            errors[field] = errors[field] || [];
            errors[field].push(message);
        });
        return { isValid: errorsArray.length === 0, errors, errorsArray, resource };
    }

    /**
     * @return {{isValid: boolean, errors: Array}}
     * Example:
     *   const form = { email: 'email@com', password: 'foo' };
     *   isValidField('email', form, ['required', 'email']);
     */
    async isValidField(fieldName, resource, fieldRules = [], context) {
        fieldRules = Array.isArray(fieldRules) ? fieldRules : [fieldRules]

        let errors = [];
        for (let i = 0; i < fieldRules.length; i += 1) {
            const rule = fieldRules[i];
            const { validator, params, message } = this.parseValidator(rule);
            const validationArgs = { value: resource[fieldName], params, resource, fieldName, message, context, t: this.t.bind(this) }
            const validationResult = await validator(validationArgs);
            if (validationResult !== null) {
                if (typeof validationResult === "string") {
                    errors.push({ field: fieldName, message: this.getErrorMessage(validationResult, rule.message, validationArgs) });
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
     *   const schema = { users: [formValidator.hasMany({ name: ["required"] })] };
     *   formValidator.isValid(form, schema);
     *   // => errors: [{ field: "users[1].name", message: "Required" }]
     */
    hasMany(schema) {
        return async ({ value, fieldName, context }) => {
            const resources = value;
            let allErrors = [];
            if (!resources) {
                return allErrors;
            }
            for (let i = 0; i < resources.length; i += 1) {
                const resource = resources[i];
                const itemContext = { ...context, itemIndex: i }
                const { errorsArray = [] } = await this.isValid(resource, schema, itemContext);
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
     *   const schema = { product: [formValidator.hasOne({ sku: ["required"] })] };
     *   formValidator.isValid(form, schema);
     *   // => errors: [{ field: "product.sku", message: "Required" }]
     */
    hasOne(schema) {
        return async ({ value, fieldName, context }) => {
            const resource = value;
            let allErrors = [];
            const { errorsArray = [] } = await this.isValid(resource, schema, context);
            for (let j = 0; j < errorsArray.length; j += 1) {
                errorsArray[j].field = `${fieldName}.${errorsArray[j].field}`;
            }
            allErrors = allErrors.concat(errorsArray);
            return allErrors;
        };
    }

    format(str, params) {
        return str.replace(this.FORMAT_REGEXP, function(m0, m1, m2) {
          if (m1 === '%') {
            return "%{" + m2 + "}";
          } else {
            return String(params[m2]);
          }
        });
    }

    getValueFromPath(obj, keypath) {
        if (!v.isObject(obj)) {
          return undefined;
        }
  
        return v.forEachKeyInKeypath(obj, keypath, function(obj, key) {
          if (v.isObject(obj)) {
            return obj[key];
          }
        });
    }

    getTouchedFromSchema(schema) {
        const touched = {...schema};
        Object.keys(touched).forEach(key => touched[key] = true);
        return touched;
    }

    /** @private */
    parseValidator(rule) {
        if (typeof rule === "function") {
            return { validator: rule, params: [], message: rule.message };
        }
        if (typeof rule === "object") {
            const validator = this.validators[rule.name];
            return { validator, params: rule.params, message: rule.message };
        }
        if (typeof rule === "string") {
            const params = rule.split(":");
            const name = params.shift();
            const validator = this.validators[name];
            if (!validator) {
                throw new Error(`validator ${rule} not found`)
            }
            return { validator, params, message: rule.message };
        }
        return null;
    }

    getErrorMessage(validationResult, ruleMessage, validationArgs) {
        if (ruleMessage && typeof ruleMessage === 'string') {
            return ruleMessage
        }
        if (ruleMessage && typeof ruleMessage === 'function') {
            return ruleMessage(validationArgs)
        }
        return validationResult
    }
}

module.exports = Ev;