/*

 # 忘记密码页面功能测试

 1. 页面头部加载检测
 2. 页面底部加载检测
 3. 页面主体部分加载检测
 4. 验证码图片正常显示检测
 5. 验证码图片切换检测
 6. 不输入邮箱及验证码提示检测
 7. 输入错误的邮箱检测
 8. 只输入邮箱不输入验证码检测
 9. 输入邮箱及错误的验证码检测

 */

phantom.injectJs('lib/base.js');

init('5.saas_account/2.forget_password.js');

var url = 'http://' + host + ':' + port + '/web/forget_password.html';
casper.echo('测试地址：' + url, 'INFO');

casper.test.begin('忘记密码页面功能测试', 9, function(test) {
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
					return document.querySelectorAll('.account-container .password-wrap input').length;
				});
				var flag = false;
				if (mainTit.indexOf('忘记密码') > -1 && mainInput == 2) {
					flag = true;
				}
				test.assert(flag, name);
			})).then(casper.wait(0, function() {
				var name = '4.验证码图片正常显示检测';
				capture(name);
				var phoneCodeUrl = casper.evaluate(function() {
					return document.querySelector('.code-img').src;
				});
				test.assert(phoneCodeUrl.indexOf('imgId') > -1, name);
			})).then(casper.wait(0, function() {
				var name = '5.验证码图片切换检测';
				var phoneCodeId = casper.evaluate(function() {
					return document.querySelector('.code-img').src.split('imgId=')[1];
				});
				casper.click('.code-img');
				casper.wait(2000, function() {
					var phoneCodeIdClick = casper.evaluate(function() {
						return document.querySelector('.code-img').src.split('imgId=')[1];
					});
					capture(name);
					test.assert(phoneCodeId != phoneCodeIdClick, name);
				});
			})).then(casper.wait(0, function() {
				var name = '6.不输入邮箱及验证码提示检测';
				casper.click('.btn-submit');
				capture(name);
				var tip = casper.evaluate(function() {
					return document.querySelector('.error-wrap').innerHTML;
				});
				var result = tip.indexOf('请输入邮箱地址');
				test.assert(result > -1, name);
			})).then(casper.wait(0, function() {
				var name = '7.输入错误的邮箱检测';
				casper.fillForm('form#forgetPwdForm', {
					'email': '123456',
					'phonecode': ''
				}, true);
				casper.click('.btn-submit');
				capture(name);
				var tip = casper.evaluate(function() {
					return document.querySelector('.error-wrap').innerHTML;
				});
				var result = (tip.indexOf('错误') > -1) || (tip.indexOf('不正确') > -1);
				test.assert(result, name);
			})).then(casper.wait(0, function() {
				var name = '8.只输入邮箱不输入验证码检测';
                casper.fillForm('form#forgetPwdForm', {  
				    'email': 'test@123.com',
				    'phonecode': ''
				}, true);
                casper.click('.btn-submit');
                capture(name);
                var tip = casper.evaluate(function() {
                    return document.querySelector('.error-wrap').innerHTML;
                });
                var result = tip.indexOf('请输入验证码');
                test.assert(result > -1, name);
            })).then(casper.wait(0, function() {
            	casper.fillForm('form#forgetPwdForm', {
            		'email': 'test@123.com',
            		'phonecode': '12399'
            	}, true);
            	casper.click('.btn-submit');
            })).then(casper.wait(1500, function() {
            	var name = '9.输入邮箱及错误的验证码检测';
            	capture(name);
            	var tip = casper.evaluate(function() {
            		return document.querySelector('.error-wrap').innerHTML;
            	});
            	var result = tip.indexOf('验证码错误');
            	test.assert(result > -1, name);
            }));
		});
	});
	casper.run(function() {
	    test.done();
	});
});