import m from "mithril"
import PaymentMethod from "./payment_method"

const Payment = {
    list: [],
    year: 0,
    month: 0,
    id: 0,
    method: 0,
    paid_date: "",
    recipient: "",
    amount: 0,
    description: "",

    clear: function() {
	const method = PaymentMethod.last();
	Payment.method = method ? method.id : 0;
	Payment.setToday();
	Payment.recipient = "";
	Payment.amount = 0;
	Payment.description = "";
    },

    setToday: function() {
	const today = new Date();
	Payment.paid_date = String(today.getFullYear()) + "-"
	    + String(today.getMonth() + 1) + "-"
	    + String(today.getDate());
    },

    save: function() {
	const fd = new FormData();
	fd.append("method_id", Payment.method);
	fd.append("paid_date", Payment.paid_date);
	fd.append("recipient", Payment.recipient);
	fd.append("amount", Payment.amount);
	fd.append("description", Payment.description);
	let method;
	let url;

	if(Payment.id === 0) {
	    // 新規
	    url = "user/payment";
	    method = "POST";
	}
	else {
	    // 更新
	    url = "user/payment";
	    method = "PUT";
	}
	
	return m.request({
	    url: url,
	    method: method,
	    body: fd,
	}).then(function() {
	    Payment.clear();
	}).catch(function(e) {
	    alert("支払情報の追加に失敗しました。");
	    console.log(e);
	});
    },

    initHistoryMonth: function() {
	if(Payment.year === 0 || Payment.month === 0) {
	    const today = new Date();
	    Payment.year = today.getFullYear();
	    Payment.month = today.getMonth() + 1;
	}
    },

    setYear: function(value) {
	const y = Number(value);
	Payment.year = y;
	Payment.fetch();
    },

    setMonth: function(value) {
	const m = Number(value);
	if(m >= 1 && m <= 12) {
	    Payment.month = m;
	    Payment.fetch();
	}
    },

    fetch: function() {
	if(Payment.year > 0 && Payment.month > 0) {
	    const url = m.buildPathname("user/payments/:year/:month",
					{year: Payment.year, month: Payment.month});
	    return m.request({
		method: "GET",
		url: url,
	    }).then(function(data) {
		Payment.list = data.map(function(row) {
		    const paid_date = new Date();
		    paid_date.setTime(Date.parse(row.paid_date));
		    row.paid_date = paid_date;
		    return row;
		});
	    }).catch(function(e) {
		console.log(e);
	    });
	}
    },

    sum: function() {
	return Payment.list.map(function(payment) {
	    return payment.amount;
	}).reduce(function(acc, cur) {
	    return acc + cur;
	}, 0);
    },
}

export default Payment;
