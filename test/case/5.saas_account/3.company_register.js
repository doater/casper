/*

 # 账号地址页面功能测试

 1. 页面头部加载检测
 2. 页面底部加载检测
 3. 页面主体部分加载检测
 4. 不输入邮箱、手机号码、验证码检测
 5. 输入错误的邮箱地址检测
 6. 只输入邮箱号码检测
 7. 输入邮箱及错误的手机号码检测
 8. 只输入邮箱及手机号码检测
 9. 获取验证码检测
 10. 网盘协议勾选检测
 11. 验证码正确检测

 */

phantom.injectJs('lib/base.js');

init('5.saas_account/3.company_register.js');

var url = 'http://' + host + ':' + port + '/web/company_register.html';
casper.echo('测试地址：' + url, 'INFO');

casper.test.begin('账号注册页面功能测试', 11, function(test) {
	casper.start(url, function() {
		casper.then(function() {
			Q.fcall(casper.wait(1500, function() {
				var name = '1.页面头部加载检测';
				capture(name);
				var accountLink = casper.evaluate(function() {
					return document.querySelectorAll('.account-header .account-right a').length;
				});
				test.assert(accountLink == 2, name);
			})).then(casper.wait(0, function() {
				var name = '2.页面底部加载检测';
				capture(name);
				var accountFooter = casper.evaluate(function() {
					return document.querySelector('.account-footer').innerHTML.length;
				});
				test.assert(accountFooter > 0, name);
			})).then(casper.wait(0, function() {
				var name = '3.页面主体部分加载检测';
				capture(name);
				var mainTit = casper.evaluate(function() {
					return document.querySelector('.main-tit').innerHTML;
				});
				var mainInput = casper.evaluate(function() {
					return document.querySelectorAll('.account-container .register-form input').length;
				});
				var flag = false;
				if (mainTit.indexOf('账号注册') > -1 && mainInput == 4) {
					flag = true;
				}
				test.assert(flag, name);
			})).then(casper.wait(0, function() {
				var name = '4.不输入邮箱、手机号码、验证码检测';
				casper.click('.btn-login');
				capture(name);
				var tip = casper.evaluate(function() {
					return document.querySelector('.error-wrap').innerHTML;
				});
				var result = tip.indexOf('请输入邮箱地址');
				test.assert(result > -1, name);
			})).then(casper.wait(0, function() {
				var name = '5.输入错误的邮箱地址检测';
				casper.fillForm('form.register-form', {
					'email': 'test'
				});
				casper.click('.btn-login');
				capture(name);
				var tip = casper.evaluate(function() {
					return document.querySelector('.error-wrap').innerHTML;
				});
				var result = tip.indexOf('错误') > -1 || tip.indexOf('不正确') > -1;
				test.assert(result, name);
			})).then(casper.wait(0, function() {
				var name = '6.只输入邮箱号码检测';
				casper.fillForm('form.register-form', {
					'email': '123456789@123.com'
				});
				casper.click('.btn-login');
				capture(name);
				var tip = casper.evaluate(function() {
					return document.querySelector('.error-wrap').innerHTML;
				});
				var result = tip.indexOf('请输入手机号码');
				test.assert(result > -1, name);
			})).then(casper.wait(0, function() {
				var name = '7.输入邮箱及错误的手机号码检测';
				casper.fillForm('form.register-form', {
					'email': '123456789@123.com',
					'phone': '123456'
				});
				casper.click('.btn-login');
				capture(name);
				var tip = casper.evaluate(function() {
					return document.querySelector('.error-wrap').innerHTML;
				});
				var result = tip.indexOf('请输入正确的手机号码');
				test.assert(result > -1, name);
			})).then(casper.wait(0, function() {
				var name = '8.只输入邮箱及手机号码检测';
				casper.fillForm('form.register-form', {
					'email': '123456789@123.com',
					'phone': '18611111111'
				});
				casper.click('.btn-login');
				capture(name);
				var tip = casper.evaluate(function() {
					return document.querySelector('.error-wrap').innerHTML;
				});
				var result = tip.indexOf('请输入验证码');
				test.assert(result > -1, name);
			})).then(casper.wait(0, function() {
				var name = '9.获取验证码检测';
				casper.fillForm('form.register-form', {
					'email': '123456789@123.com',
					'phone': '18611111111'
				});
				casper.click('.btn-phonecode');
				casper.wait(1000, function() {
					capture(name);
					var tip = casper.evaluate(function() {
						return document.querySelector('.btn-phonecode').innerHTML;
					});
					var result = tip.indexOf('重新获取');
					test.assert(result > -1, name);
				});
			})).then(casper.wait(0, function() {
				var name = '10.网盘协议勾选检测';
				casper.fillForm('form.register-form', {
					'email': '123456789@123.com',
					'phone': '18611111111',
					'phonecode': '1234'
				});
				casper.click('.btn-login');
				capture(name);
				var tip = casper.evaluate(function() {
					return document.querySelector('.error-wrap').innerHTML;
				});
				var result = tip.indexOf('请勾选企业网盘服务协议');
				test.assert(result > -1, name);
			})).then(casper.wait(0, function() {
				var name = '11.验证码正确检测';
				casper.fillForm('form.register-form', {
					'email': '123456789@123.com',
					'phone': '18622222222',
					'phonecode': '1234',
					'agreement': true
				});
				casper.click('.btn-login');
				casper.wait(100, function() {
					casper.click('.btn-login');
					capture(name);
					var tip = casper.evaluate(function() {
						return document.querySelector('.error-wrap').innerHTML;
					});
					var result = (tip.indexOf('错误') > -1) || (tip.indexOf('不正确') > -1);
					test.assert(result, name);
				});
			}));
		});
	});
	casper.run(function() {
	    test.done();
	});
});