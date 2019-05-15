import es6Promise from "es6-promise";
import fetch from "isomorphic-fetch";
es6Promise.polyfill();
module.exports = function (the, url, data, successFun, failFun, errFun) {
	var options = {
    credentials: 'include',
		method: 'POST',
		headers: {'Content-Type': 'application/json; charset=utf-8', 'node': 'open'},
		body: JSON.stringify(data)
	};
	fetch(url, options).then(response => {
		if (response.status >= 200 && response.status < 300) {
			return response.json();
		} else {
			var error = new Error(response.statusText);
			error.response = response;
			throw error;
		}
	}).then(data => {
		if (data.code.toString().indexOf("10102")!==-1) {
        the.$Modal.error({
            title: '登录失效',
            content:'登录凭证已失效，请重新登录',
            closable:true,
            onOk: () => {
                localStorage.removeItem('saiYunMenuList');
                window.location.href = localStorage.returnUrl=="undefined"?decodeURIComponent(defaultLogin):decodeURIComponent(localStorage.returnUrl);
            }
        });
		} else {
			successFun && successFun(data);
		}
	});
};