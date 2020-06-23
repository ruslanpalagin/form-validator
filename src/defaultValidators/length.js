module.exports = ({ value = "", params }) => {
    const [min, max] = params;
    const { length } = value;
    if (min !== undefined && length < parseInt(min, 10) || length === undefined ) {
        return `Minimum ${min} symbols required`;
    }
    if (max !== undefined && length > parseInt(max, 10)) {
        return `Maximum ${max} symbols`;
    }
    return null;
}
