module.exports = ({ value = "", params, t }) => {
    const [min, max] = params;
    const { length } = value;
    if (min !== undefined && length < parseInt(min, 10) || length === undefined ) {
        return t('length.min', { n: min });
    }
    if (max !== undefined && length > parseInt(max, 10)) {
        return t('length.max', { n: max });
    }
    return null;
}
