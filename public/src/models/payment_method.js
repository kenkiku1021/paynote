import m from "mithril"

const PaymentMethod = {
    list: [],
    name: "",
    id: 0,

    clear: function() {
	PaymentMethod.id = 0;
	PaymentMethod.name = "";
    },

    fetch: function() {
	return m.request({
	    method: "GET",
	    url: "user/payment_methods",
	}).then(function(data) {
	    PaymentMethod.list = data;
	}).catch(function(e) {
	    console.log(e);
	});
    },

    last: function() {
	return PaymentMethod.list.length > 0 ? PaymentMethod.list[0] : null;
    },

    append: function() {
	const fd = new FormData();
	fd.append("name", PaymentMethod.name);
	
	return m.request({
	    method: "POST",
	    url: "user/payment_method",
	    body: fd,
	}).then(function(data) {
	    PaymentMethod.list = data;
	}).catch(function(e) {
	    alert("支払い方法の追加に失敗しました。" + e.response);
	    console.log(e);
	});
    },

    update: function() {
	const url = m.buildPathname("user/payment_method/:id", {id: PaymentMethod.id});
	const fd = new FormData();
	fd.append("name", PaymentMethod.name);
	
	return m.request({
	    method: "PUT",
	    url: url,
	    body: fd,
	}).then(function(data) {
	    PaymentMethod.list = data;
	}).catch(function(e) {
	    alert("支払い方法の更新に失敗しました。" + e.response);
	    console.log(e);
	});
    },

    remove: function() {
	const url = m.buildPathname("user/payment_method/:id", {id: PaymentMethod.id});
	return m.request({
	    method: "DELETE",
	    url: url,
	}).then(function(data) {
	    PaymentMethod.list = data;
	}).catch(function(e) {
	    alert("支払い方法の削除に失敗しました。");
	    console.log(e);
	});
    },
}

export default PaymentMethod;
