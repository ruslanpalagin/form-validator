# Why

- Simple, flexible, enterprisable
- Handling of deeply nested relations
- Friendly to UI frameworks
- Fast

# Install

```
npm i elegant-validator
```

# Minimalistic example:

```
import FormValidator from 'elegant-validator'
// you may use your own set of validators or add/redefine it in runtime
import defaultValidators from 'elegant-validator/src/defaultValidators'

// you may define few instances (services) for various application features
const fv = new FormValidator(defaultValidators) 

// define schema for some use case
const schema = { email: ['required', 'email', 'length:7:255'], name: 'length:3:255' }

// use in controller 
const formData = { email: 'email@example.com', name: '' }
const { errors, errorsArray, isValid } = await fv.isValid(formData, schema)
```
