// 引入公共文件
phantom.injectJs('lib/base.js');
// 初始化输出目录
init('example.js');
// 需要测试的页面地址
var url = 'http://' + host + ':' + port + '/web/login.html';
// 输出提示信息
casper.echo('测试地址：' + url, 'INFO');
// 测试demo
casper.test.begin('测试demo', 2, function(test) {
    casper.start(url, function() {
        casper.then(function() {
            Q.fcall(casper.wait(1500, function() {
                var name = '测试通过';
                capture(name);
                test.assert(true, name);
            })).then(casper.wait(0, function() {
                var name = '测试不通过'
                capture(name);
                test.assert(false, name);
            }));
        })
    });
    casper.run(function() {
        test.done();
    });
});