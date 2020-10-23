module.exports = ({ value, t }) => {
    if (!value && value !== 0) {
        return t('required')
    }
}
