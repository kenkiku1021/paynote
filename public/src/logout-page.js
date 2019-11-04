import m from "mithril"
import UI from "./ui"
import User from "./models/user"

const LogoutPage = {
    view: function(vnode) {
	return m(UI.Main, [
	    m(".alert.alert-danger", [
		m("h5", "ログアウト"),
		m("p", "ログアウトします。よろしいですか？"),
		m(".text-center", [
		    m("button[type=button].btn.btn-danger.mr-4",
		      {onclick: function(e) {
			  User.logout();
		      }},
		      "ログアウト"),
		    m("button[type=button].btn.btn-secondary",
		      {onclick: function(e) {
			  history.back();
		      }},
		      "キャンセル"),
		]),
	    ]),
	]);
    },
}

export default LogoutPage;
