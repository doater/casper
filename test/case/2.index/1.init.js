/*

# index页面初始化测试

1. 空间显示正常

 */

phantom.injectJs('lib/base.js');

init('2.index/1.init.js');

var url = 'http://' + host + ':' + port + '/web/index.html';
casper.echo('测试地址：' + url, 'INFO');

casper.test.begin('页面初始化测试', 12, function(test) {
    casper.start(url, function() {
        var time = moment().format('mmss');
        casper.then(function() {
            Q.fcall(casper.wait(1500, function() {
                var name = '测试页面几个主要区域是否加载成功';
                capture(name);
                // 路径信息加载成功
                var crumbPath = casper.evaluate(function() {
                    return document.querySelectorAll('.path-item');
                });
                // 个人信息加载成功
                var username = casper.evaluate(function() {
                    return document.querySelector('.nav-username').innerHTML;
                });
                // 空间信息加载成功
                var space = casper.evaluate(function() {
                    return document.querySelector('.space-content').innerHTML;
                });
                // 文件列表渲染成功
                var tableList = casper.evaluate(function() {
                    return document.querySelectorAll('.xtable-list');
                });
                var flag = false;
                if (crumbPath.length == 1 && username && space && tableList.length > 0) {
                    flag = true;
                }
                test.assert(flag, name);
            }))
        })
    });

    casper.run(function() {
        test.done();
    });
});
