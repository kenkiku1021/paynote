import m from "mithril"
import Payment from "./payment"

const User = {
    id: null,
    start_year: 0,

    clear: function() {
	User.id = null;
	User.start_year = 0;
	Payment.clear();
    },
    
    fetch: function() {
	return m.request({
	    method: "POST",
	    url: "user",
	}).then(function(data) {
	    if(data.authorized) {
		User.id = data.id;
		User.start_year = data.start_year;
	    }
	}).catch(function(e) {
	    console.log(e);
	});
    },

    authorized: function() {
	return User.id > 0;
    },

    logout: function() {
	return m.request({
	    method: "POST",
	    url: "logout",
	}).then(function(data) {
	    User.clear();
	    m.route.set("/login");
	}).catch(function(e) {
	    console.log(e);
	});
    },
}

export default User;
