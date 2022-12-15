module.exports = ({ value, t }) => {
    console.log('typeof value', typeof value)
    if (typeof value === 'number' && !Number.isNaN(value)) return;
    if (Number.isNaN(value) || parseFloat(value).toString() !== value) {
        return t('isNumeric')
    }
}
