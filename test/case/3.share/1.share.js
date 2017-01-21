phantom.injectJs('lib/base.js');

init('3.share/1.share.js');

var shareId = casper.cli.get('shareId');
if (!shareId) {
    casper.echo('请输入shareId', 'ERROR');
    casper.exit();
}
var url = 'http://' + host + ':' + port + '/web/share.html?hash=' + shareId;
casper.echo('测试地址：' + url, 'INFO');

// 外链查看页面功能测试
casper.test.begin('外链查看页面功能测试', 4, function(test) {
    casper.start(url, function() {
        casper.then(function() {
            Q.fcall(casper.wait(1500, function() {
                var name = '外链需要输入密码';
                capture(name);
                test.assertExists('.passwd-wrap', name);
                this.click('#passwd-btn');
            })).then(casper.wait(200, function() {
                var name = '不输入密码的提示';
                capture(name);
                test.assertExists('#xmsg', name);
                this.click('.xmsg-ok');
                casper.evaluate(function(password) {
                    document.querySelector('#password').value = password;
                }, '222');
                this.click('#passwd-btn');
            })).then(casper.wait(1500, function() {
                var name = '分享密码错误的提示';
                capture(name);
                test.assertExists('#xmsg', name);
                this.click('.xmsg-ok');
                casper.evaluate(function(password) {
                    document.querySelector('#password').value = password;
                }, '1234');
                this.click('#passwd-btn');
            })).then(casper.wait(1500, function() {
                var name = '密码正确显示文件列表';
                capture(name);
                test.assertExists('.xtable-row', name);
            }));
        })
    });

    casper.run(function() {
        test.done();
    });
});
