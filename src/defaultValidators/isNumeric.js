module.exports = ({ value, t }) => {
    if (typeof value === 'number' && !Number.isNaN(value)) return;
    if (Number.isNaN(value) || parseFloat(value).toString() !== value) {
        return t('isNumeric')
    }
}
