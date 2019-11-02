const PN = {
    isNumber: function(s) {
	return s.match != null;
    },

    formatDate: function(d) {
	const year = d.getFullYear();
	const month = d.getMonth() + 1;
	const date = d.getDate();
	const month_string = month < 10 ? "0" + String(month) : String(month);
	const date_string = date < 10 ? "0" + String(date) : String(date);
	return `${year}-${month_string}-${date_string}`;
    },
}

export default PN;
