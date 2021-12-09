module.exports = ({ value = "", params, t }) => {
    const [min, max] = params;
    if ((parseInt(min, 10) === 0 || min === '') && (value === '' || value === null || value === undefined)) {
        return undefined;
    }
    const length = value && value.hasOwnProperty('length') ? value.length : 0;
    if (min !== undefined && length < parseInt(min, 10)) {
        return t('length.min', { n: min });
    }
    if (max !== undefined && length > parseInt(max, 10)) {
        return t('length.max', { n: max });
    }
    return undefined;
}
