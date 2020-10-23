module.exports = ({ value = [], params }) => {
    const [min, max] = params;
    const { length } = value;
    if (min !== undefined && length < parseInt(min, 10) || length === undefined ) {
        return t('arrayLength.min', { n: min });
    }
    if (max !== undefined && length > parseInt(max, 10)) {
        return t('arrayLength.max', { n: max });
    }
    return null;
}