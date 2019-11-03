import m from "mithril"
import UI from "./ui"
import User from "./models/user"
import PaymentMethod from "./models/payment_method"
import jQuery from "jquery"

const PaymentMethodEditor = {
    view: function(vnode) {
	return m("#payment-editor-modal.modal.fade[role=dialog][tabindex=-1]", [
	    m(".modal-dialog.modal-dialog-centered[role=document]", [
		m(".modal-content", [
		    m(".modal-body", [
			m(".row", [
			    m(".col-sm-6.mb-2", [
				m("input.form-control",
				  {value: PaymentMethod.name,
				   oninput: function(e) {
				       PaymentMethod.name = e.target.value;
				   }}),
			    ]),
			    m(".col-sm-6.mb-2.text-right", [
				m("button[type=button.btn.btn-secondary",
				  {"data-dismiss": "modal"},
				  "キャンセル"),
				m("button[type=button].btn.btn-primary",
				  {"data-dismiss": "modal",
				   onclick: function(e) {
				       if(PaymentMethod.id === 0) {
					   // 追加
					   PaymentMethod.append();
				       }
				       else {
					   // 更新
					   PaymentMethod.update();
				       }
				   }},
				  PaymentMethod.id === 0 ? "追加" : "更新"),
			    ]),
			]),
		    ]),
		]),
	    ]),
	]);
    },
}

const SettingPage = {
    oninit: function(vnode) {
	if(!User.authorized()) {
	    User.fetch().then(function() {
		if(!User.authorized()) {
		    m.route.set("/login");
		}
	    });
	}
	PaymentMethod.fetch();
    },
    
    view: function(vnode) {
	const showPaymentEditor = function() {
	    jQuery("#payment-editor-modal").modal("show");
	};
	
	return [
	    m(UI.NavBar,
	      m(UI.NavMenu)),
	    m(UI.Main, [
		m(UI.Card,
		  {cardHeader: "支払い方法の管理"}, [
		      m("ul.list-group.mb-2",
			PaymentMethod.list.map(function(method) {
			    return m("li.list-group-item.d-flex", [
				m(".payment-method-name.mr-auto", method.name),
				method.name != "現金"
				    ? [
					m(UI.IconBtn, {class: "btn-info",
						       icon: "create",
						       onclick: function(e) {
							   PaymentMethod.id = method.id;
							   PaymentMethod.name = method.name;
							   showPaymentEditor();
						       }}),
					m(UI.IconBtn, {class: "btn-danger",
						       icon: "clear",
						       onclick: function(e) {
							   if(confirm("削除してもよろしいですか？")) {
							       PaymentMethod.id = method.id;
							       PaymentMethod.remove();
							   }
						       }}),
				    ] : "",
			    ]);
			})),
		      m(".row", [
			  m(".col.text-center", [
			      m("button[type=button].btn.btn-primary",
				{onclick: function(e) {
				    PaymentMethod.clear();
				    showPaymentEditor();
				}},
				"追加"),
			  ]),
		      ]),
		      m(PaymentMethodEditor),
		  ]),
	    ]),
	];
    },
}

export default SettingPage;
