module.exports = {
    format: (fmt, ...args) => {
        return fmt
            .split("%s").reduce((aggregate, chunk, i) =>
                aggregate + chunk + (args[i] || ""), "");
    },
    formatDate: (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }
}