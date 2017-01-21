/*

# 登录页面功能测试

1. 登录页面初始状态
2. 客户端下载链接显示
3. 不输入账号和密码提示正常
4. 只输入账号不输入密码提示正常
5. 只输入密码不输入账号提示正常
6. 帐号或密码错误提示正常
7. 登录成功正常跳转

 */

phantom.injectJs('lib/base.js');

init('1.login/1.login.js');

var url = 'http://' + host + ':' + port + '/web/login.html';
casper.echo('测试地址：' + url, 'INFO');

// 开始测试
casper.test.begin('登录页面功能测试', 7, function(test) {
    casper.start(url, function() {
        casper.then(function() {
            Q.fcall(casper.wait(1500, function() {
                var name = '1.登录页面初始状态';
                capture(name);
                test.assertExists('.login-name', name)
            })).then(casper.wait(0, function() {
                var name = '2.客户端下载链接显示';
                capture(name);
                var clients = casper.evaluate(function() {
                    return document.querySelectorAll('.client-center a').length;
                });
                test.assert(clients > 0, name);
            })).then(casper.wait(0, function() {
                var name = '3.不输入账号和密码提示正常';
                casper.click('.login-btn');
                capture(name);
                var tip = casper.evaluate(function() {
                    return document.querySelector('.error-tip').innerHTML;
                });
                var result = tip.indexOf('请输入您的账号');
                test.assert(result > -1, name);
            })).then(casper.wait(0, function() {
                var name = '4.只输入账号不输入密码提示正常';
                casper.evaluate(function(username, password) {
                    document.querySelector('.login-name').value = username;
                    document.querySelector('.login-password').value = password;
                }, 'TestUser', '');
                casper.click('.login-btn');
                capture(name);
                var tip = casper.evaluate(function() {
                    return document.querySelector('.error-tip').innerHTML;
                });
                var result = tip.indexOf('请输入您的密码');
                test.assert(result > -1, name);
            })).then(casper.wait(0, function() {
                var name = '5.只输入密码不输入账号提示正常';
                casper.evaluate(function(username, password) {
                    document.querySelector('.login-name').value = username;
                    document.querySelector('.login-password').value = password;
                }, '', '123qwe');
                casper.click('.login-btn');
                capture(name);
                var tip = casper.evaluate(function() {
                    return document.querySelector('.error-tip').innerHTML;
                });
                var result = tip.indexOf('请输入您的账号');
                test.assert(result > -1, name);
                // 输入错误的用户名密码
                casper.evaluate(function(username, password) {
                    document.querySelector('.login-name').value = username;
                    document.querySelector('.login-password').value = password;
                }, 'TestUser', '123');
                casper.click('.login-btn');
            })).then(casper.wait(500, function() {
                var name = '6.帐号或密码错误提示正常';
                capture(name);
                var tip = casper.evaluate(function() {
                    return document.querySelector('.error-tip').innerHTML;
                });
                var result = (tip.indexOf('错误') > -1) || (tip.indexOf('不正确') > -1);
                test.assert(result, name);
            })).then(casper.wait(0, function() {
                // 输入正确的账号和密码
                casper.evaluate(function(username, password) {
                    document.querySelector('.login-name').value = username;
                    document.querySelector('.login-password').value = password;
                }, 'TestUser', '123qwe');
                casper.click('.login-btn');
            })).then(casper.wait(2000, function() {
                var name = '7.登录成功正常跳转';
                capture(name);
                test.assertUrlMatch(/index\.html/, name);
            }))
        })
    });

    casper.run(function() {
        test.done();
    });
});