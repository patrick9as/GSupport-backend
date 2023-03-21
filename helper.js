function FormatDate(date) {
    date = date.replace(/(\d{2})(\d{2})(\d{4})/g, '$1/$2/$3');
    return date;
}

module.exports = {FormatDate};