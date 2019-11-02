import m from "mithril"

const User = {
    id: null,
    start_year: 0,

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
}

export default User;
