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
// you may use your own set of rules or add a few in runtime
import defaultRules from 'elegant-validator/src/defaultRules'

// you may define few instances (services) for various application needs
const fv = new FormValidator(defaultRules) 

// validator for a use case
const rules = { email: ['required', 'email', 'length:7:255'], name: 'length:3:255' }

// this is in your controller 
const formData = { email: 'email@example.com', name: '' }
const { errors, errorsAsArray, isValid } = await fv.isValid()
```
