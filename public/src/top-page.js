import m from "mithril"
import UI from "./ui"
import User from "./models/user"
import PaymentMethod from "./models/payment_method"
import PaymentEditor from "./payment-editor"

const TopPage = {
    oninit: function(vnode) {
	if(!User.authorized()) {
	    User.fetch().then(function() {
		if(!User.authorized()) {
		    m.route.set("/login");
		}
	    });
	}
    },
    
    view: function(vnode) {
	return [
	    m(UI.NavBar,
	      m(UI.NavMenu)),
	    m(UI.Main, [
		m(UI.Card,
		  {cardHeader: "支払いの追加"},
		  m(PaymentEditor),
		 ),
	    ]),
	];
    },
}

export default TopPage;
