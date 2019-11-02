import m from "mithril"
import UI from "./ui"
import User from "./models/user"

const LoginPage = {
    oninit: function(vnode) {
	User.fetch().then(function() {
	    if(User.authorized()) {
		m.route.set("/top");
	    }
	});
    },
    
    view: function(vnode) {
	return [
	    m(UI.NavBar),
	    m(UI.Main, [
		m(UI.Card,
		  {cardHeader: "ログイン"},
		  [
		      m("a[href=auth/google_oauth2].btn.btn-primary",
			"Googleでログイン"),
		  ]),
	    ]),
	];
    },
}

export default LoginPage;
