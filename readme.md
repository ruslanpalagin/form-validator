# Why

- Framework agnostic
- Advanced. Flexible. Scalable.
- Supports nesting
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
Schema is a map of validation rules to be applied.

## Schema -> String
```
const schema = { email: 'required' }
```

## Schema -> Array of strings
So 3 validations will be checked here. Two parameters (7, 255) are being used by length validator 
```
const schema = { email: ['required', 'email', 'length:7:255'] }
```

## Schema -> Object/Array of objects
For more complex cases string is not enough. So let's use objects
```
const schema = { email: { name: 'length', params: [7, 255], message: 'Email length must be 7-255 symbols' } }
// or in combination:
const schema = { email: ['required', { name: 'length', params: [7, 255], message: 'Email length must be 7-255 symbols' }] }
```

## Schema -> Function/Array of functions
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

## Schema -> hasMany
In this example we ensure position has valid technologies count and schema: 
```
const ev = new ElegantValidator(defaultValidators) 

const technologySchema = { name: ['required'], experience: ['length:0:2'] }
const positionSchema = { title: ['required', 'length:10:255'], technologies: ['arrayLength:1:10', ev.hasMany(technologySchema)] }

const formData = {
  title: "Validator developer",
  technologies: [
    { name: "nodejs", experience: "10" },
    { name: "donejs", experience: "2" },
  ]
}

const { isValid, errors } = await ev.isValid(formData, positionSchema)
```

## Schema -> hasOne
Pretty the same as hasMany but for a single item references:
```
const ev = new ElegantValidator(defaultValidators) 

const addressSchema = { planet: ['required'], city: ['required'] }
const checkoutSchema = { 
  email: ['required', 'email'],
  shippingAddress: ev.hasOne(addressSchema),
  billingAddress: ev.hasOne(addressSchema),
}

const formData = {
  email: "email@gmail.sirius",
  shippingAddress: { planet: 'KP-X', city: '35' },
  billingAddress: { planet: 'KP-X', city: '35' },
}

const { isValid, errors } = await ev.isValid(formData, checkoutSchema)
```

# Customizing

## Customizing -> validator parameters reference
```
value - Any - value taken from the field is being validating right now
params - Array<Any> - parameters provided by schema definition for this field/value
resource - Object - parent of the field. For flat forms this is form itself. May be object from nested resources (during hasOne/hasMany validation iterations) 
fieldName - String - selfdescriptive
message - String|Function - an error message provided by schema definition for this field/value to be shown.
context - Object - context (scope) of current validation iteration. May be used for complex hasOne/hasMany cases.
context.rootResource - Object - the root formData object. Constant across all validation iterations
context.itemIndex - Number - index of currently validating item from hasMany collection. 
```

## Customizing -> validator as a function
```
const ev = new ElegantValidator(defaultValidators) 
const myFooValidator = ({ value, params, resource, fieldName, message, context }) => {
  if (!JSON.stringify(resource).includes('foo')) {
     return 'Foo is missing...'
  }
}
const schema = { email: 'email', name: ['required', myFooValidator] }
const formData = { email: 'email@example.com', name: 'bar' }
const { errors, errorsArray, isValid } = await ev.isValid(formData, schema)
// errors => { name: 'Foo is missing...' }
```

## Customizing -> registered validator
```
const myFooValidator = ({ value, params, resource, fieldName, message, context }) => {
  if (!JSON.stringify(resource).includes('foo')) {
     return 'Foo is missing...'
  }
}
const ev = new ElegantValidator({
  ...defaultValidators,
  fooable: myFooValidator,
}) 

const schema = { email: 'email', name: ['required', 'fooable'] }
const formData = { email: 'email@example.com', name: 'bar' }
const { errors, errorsArray, isValid } = await ev.isValid(formData, schema)
// errors => { name: 'Foo is missing...' }
```

# Examples

## Examples -> complex forms with deeply nested resources
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
