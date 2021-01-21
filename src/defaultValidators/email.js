module.exports = ({ value, t }) => {
    if (!value || !value.includes('@')) {
        return t('email')
    }
}
