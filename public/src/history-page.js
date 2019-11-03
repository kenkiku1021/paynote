import m from "mithril"
import UI from "./ui"
import User from "./models/user"
import PaymentMethod from "./models/payment_method"
import Payment from "./models/payment";
import PaymentEditor from "./payment-editor"

const PaymentItemView = {
    view: function(vnode) {
	const payment = vnode.attrs.payment;
	return m("li.list-group-item.d-flex", [
	    m(".date", [payment.paid_date.getDate(), "日"]),
	    m(".recipient-method", [
		m(".recipient", payment.recipient),
		m(".method", payment.method),
	    ]),
	    m(".amount.ml-auto", [payment.amount, "円"]),
	]);
    },
}

const PaymentSumView = {
    view: function(vnode) {
	return m("li.list-group-item.d-flex.bg-info", [
	    "合計",
	    m(".amount.ml-auto", [vnode.children, "円"]),
	]);
    },
}

const YearSelectView = {
    view: function(vnode) {
	const years = [];
	const now = new Date();
	for(let y = now.getFullYear(); y >= User.start_year; y--) {
	    years.push(y);
	}
	
	return m("select.form-control.mr-2",
		 {value: Payment.year,
		  onchange: function(e) {
		      Payment.setYear(e.target.value);
		  }},
		 years.map(function(year) {
		     return m("option", {value: year}, [year, "年"]);
		 }));
    },
}

const MonthSelectView = {
    view: function(vnode) {
	const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	return m("select.form-control.mr-2",
		 {value: Payment.month,
		  onchange: function(e) {
		      Payment.setMonth(e.target.value);
		  }},
		 months.map(function(month) {
		     return m("option", {value: month}, [month, "月"]);
		 }));
    },
}

const PaymentMethodSelectView = {
    view: function(vnode) {
	const payments = [{id: 0, name: "すべて"}].concat(PaymentMethod.list);
	return m("select.form-control",
		 {value: Payment.filter.method,
		  onclick: function(e) {
		      Payment.filter.method = Number(e.target.value);
		  }},
		 payments.map(function(method) {
		     return m("option",
			      {value: method.id},
			      method.name);
		 }));
    },
}

const HistoryPage = {
    oninit: function(vnode) {
	if(!User.authorized()) {
	    m.route.set("/login");
	}
	else {
	    Payment.initHistoryMonth();
	    Payment.fetch();
	}
    },

    view: function(vnode) {
	return [
	    m(UI.NavBar,
	      m(UI.NavMenu)),
	    m(UI.Main, [
		m(".form-row", [
		    m(".col", [
			m(YearSelectView),
		    ]),
		    m(".col", [
			m(MonthSelectView),
		    ]),
		    m(".col.d-none.d-sm-block", [
			m(PaymentMethodSelectView),
		    ]),
		]),
		m("ul.list-group.history.mt-2", [
		    Payment.filteredList().map(function(payment) {
			return m(PaymentItemView, {payment: payment});
		    }),
		    m(PaymentSumView, Payment.sum()),
		]),
	    ]),
	];
    },
}

export default HistoryPage;
