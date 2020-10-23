module.exports = ({ value, t }) => {
    if (!value.includes('@')) {
        return t('email')
    }
}
