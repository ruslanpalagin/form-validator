module.exports = {
    required: ({ value }) => {
        if (!value) {
            return "Required"
        }
    },
};