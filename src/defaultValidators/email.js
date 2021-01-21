module.exports = ({ value, t }) => {
    if (typeof value !== 'string' || !value.includes('@')) {
        return t('email')
    }
}
