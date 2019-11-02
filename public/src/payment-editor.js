import m from "mithril"
import UI from "./ui"
import User from "./models/user"
import PaymentMethod from "./models/payment_method"
import Payment from "./models/payment"
import PN from "./pnlib"

const PaymentEditor = {
    oninit: function(vnode) {
	PaymentMethod.fetch().then(function() {
	    Payment.clear();
	});
    },
    
    view: function(vnode) {
	return [
	    m(".form-row", [
		m(".col-sm-4.mb-2",
		  m("input[type=date].form-control",
		    {value: Payment.paid_date,
		     onchange: function(e) {
			 Payment.paid_date = e.target.value;
		     },
		     placeholder: "支払日"})),
		m(".col-sm-8.mb-2",
		  m("input.form-control",
		    {value: Payment.recipient,
		     onchange: function(e) {
			 Payment.recipient = e.target.value;
		     },
		     placeholder: "支払先"})),
	    ]),
	    m(".form-row", [
		m(".col.mb-2",
		  m(".input-group", [
		      m("input[type=number].form-control",
			{value: Payment.amount,
			 oninput: function(e) {
			     Payment.amount = PN.isNumber(e.target.value) ? Number(e.target.value) : 0;
			 },
			 placeholder: "支払金額"}),
		      m(".input-group-append", [
			  m("span.input-group-text", "円")
		      ])
		  ])),
		m(".col.mb-2",
		  m("select.form-control",
		    {value: Payment.method,
		     onchange: function(e) {
			 Payment.method = e.target.value;
		     }},
		    PaymentMethod.list.map(function(method) {
			return m("option", {value: method.id}, method.name);
		    }))),
	    ]),
	    m(".form-row.mb-2", [
		m(".col-sm",
		  m("textarea.form-control[rows=4]",
		    {value: Payment.description,
		     oninput: function(e) {
			 Payment.description = e.target.value;
		     },
		     placeholder: "支払の概要"})),
	    ]),
	    m(".form-row.justify-content-sm-center", [
		m(".col-sm-2.mb-2",
		  m("button[type=button].btn.btn-primary.btn-block",
		    {onclick: function(e) {
			Payment.save();
		    }}, "送信")),
	    ]),
	];
    },
}

export default PaymentEditor;
