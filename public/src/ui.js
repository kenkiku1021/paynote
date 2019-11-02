import m from "mithril"

const APP_NAME = "PayNote";

const UI = {
    MatIcon: {
	view: function(vnode) {
	    return m("i.material-icons", {class: vnode.attrs.class}, vnode.children);
	},
    },

    IconBtn: {
	view: function(vnode) {
	    return m("button[type=button].btn.btn-sm.icon-btn",
		     {class: vnode.attrs.class,
		      onclick: vnode.attrs.onclick},
		     [m(UI.MatIcon, vnode.attrs.icon),
		      vnode.children]);
	},
    },
    
    NavBar: {
	view: function(vnode) {
	    return m("header", [
		m("nav.navbar.navbar-expand-lg.navbar-light.bg-light", [
		    m("a[href=#].navbar-brand", APP_NAME),
		    m("button[type=button].navbar-toggler",
		      {"data-toggle": "collapse",
		       "data-target": "#navbarMenu",
		       "aria-controls": "navbarMenu",
		       "aria-expanded": "false",
		       "aria-label": "Toggle navigation",},
		      m("span.navbar-toggler-icon")),
		    m(".collapse.navbar-collapse#navbarMenu",
		      vnode.children),
		]),
	    ]);
	},
    },

    NavMenu: {
	view: function(vnode) {
	    return m("ul.navbar-nav.mr-auto", [
		m(UI.NavMenuItem, {href: "/top"}, [
		    m(UI.MatIcon, "home"),
		    "Home",
		]),
		m(UI.NavMenuItem, {href: "/history"}, [
		    m(UI.MatIcon, "list"),
		    "History",
		]),
		m(UI.NavMenuItem, {href: "/setting"}, [
		    m(UI.MatIcon, "settings_applications"),
		    "Setting",
		]),
	    ]);
	},
    },

    NavMenuItem: {
	view: function(vnode) {
	    return m("li.nav-item",
		     {class: m.route.get() === vnode.attrs.href ? "active" : ""},
		     m(m.route.Link,
		       {href: vnode.attrs.href,
			class: "nav-link"},
		       vnode.children));
	},
    },

    Main: {
	view: function(vnode) {
	    return m("main.flex-shrink-0[role=main]",
		     m(".container", [
			 vnode.children
		     ]));
	},
    },

    CardHeader: {
	view: function(vnode) {
	    return m(".card-header", vnode.children);
	},
    },
    
    Card: {
	view :function(vnode) {
	    return m(".card",
		     {class: vnode.attrs.cardClass ? vnode.attrs.cardClass : ""},
		     [
			 vnode.attrs.cardHeader ? m(UI.CardHeader, vnode.attrs.cardHeader) : "",
			 m(".card-body", [
			     vnode.children,
			 ]),
		     ]);
	},
    },

}

export default UI;
