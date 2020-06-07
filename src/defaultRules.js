module.exports = {
    required: ({ value }) => {
        if (!value) {
            return "Required"
        }
    },
    email: ({ value }) => {
        if (!value.includes('@')) {
            return "Invalid"
        }
    },
    length: (value = "", options) => {
        const [min, max] = options;
        const { length } = value;
        if (min !== undefined && length < parseInt(min, 10) || length === undefined ) {
            return `Minimum ${min} symbols required`;
        }
        if (max !== undefined && length > parseInt(max, 10)) {
            return `Maximum ${max} symbols`;
        }
        return null;
    },
    arrayLength: (value = [], options) => {
        const [min, max] = options;
        const { length } = value;
        if (min !== undefined && length < parseInt(min, 10) || length === undefined ) {
            return `Minimum ${min} item${length > 1 ? "s" : ""} required`;
        }
        if (max !== undefined && length > parseInt(max, 10)) {
            return `Maximum ${max} items allowed`;
        }
        return null;
    },
};