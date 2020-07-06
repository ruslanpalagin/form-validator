# Why

- Advanced. Flexible. Scalable.
- Handling of nested relations (with any deep)
- Friendly to UI frameworks (vue, react, mobile)
- Async & fast

# Install

```
npm i elegant-validator
```

# Demo:
```
import ElegantValidator from 'elegant-validator'
// you may use your own set of validators or add/redefine it in runtime
import defaultValidators from 'elegant-validator/src/defaultValidators'

// you may define few instances (services) for various application features
const ev = new ElegantValidator(defaultValidators) 

// define schema for some use case
const schema = { email: ['required', 'email', 'length:7:255'], name: 'length:3:255' }

// use in controller 
const formData = { email: 'email@example.com', name: '' }
const { errors, errorsArray, isValid } = await ev.isValid(formData, schema)

// isValid => false
// errors => { 'name': ['Length is invalid'] }
// errorsArray (same as errors but in predictable data structure) => { field: 'name', message: 'Length is invalid' }
```

# Schema
Schema is a an object where key - is a field name and value is a set of validation rules. Rules set can be:

## String schema
```
const schema = { email: 'required' }
```

## Array of strings
So 3 validations will be checked here. Two parameters (7, 255) are being used by length validator 
```
const schema = { email: ['required', 'email', 'length:7:255'] }
```

## Object/Array of objects
For more complex cases string is not enough. So let's use objects
```
const schema = { email: { name: 'length', params: [7, 255], message: 'Email length must be 7-255 symbols' } }
// or in combination:
const schema = { email: ['required', { name: 'length', params: [7, 255], message: 'Email length must be 7-255 symbols' }] }
```

## Function/Array of functions
Tough case? OK - return undefined on success, return message/object on error
```
const myEmailValidationRule = ({ value }) => {
  if (!value.includes('@')) {
    return 'Email is invalid'
  }
}
const schema = { email: myEmailValidationRule }
// or in combination:
const schema = { email: ['required', myEmailValidationRule] }
```

# Custom validator parameters reference
TODO more description
```
const myFooValidator = ({ value, params, resource, fieldName, message, context }) => {
  if (!JSON.stringify(resource).includes('foo')) {
     return 'Foo is missing...'
  }
}
```

# hasMany
TODO 

# hasOne
TODO 

# More Examples:

## 1. Handling complex forms with deeply nested resources
```
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

const { errors } = await resourceValidator.isValid(form, schema);

expect(errors['resources[0].posts[0].comments[0].author.id']).toEqual(['Required'])
```
