phantom.injectJs('lib/base.js');

init('3.share/2.share.js');
/*

# 外链页面功能测试
1. 外链页面正常显示
2. 不选择文件打包下载提示正常
3. 不选择文件批量转存提示正常
4. 选择文件打包下载正常
5. 转存对话框显示正常
6. 转存对话框点击文件显示正常
7. 转存成功

*/
var shareId = casper.cli.get('shareId');
if (!shareId) {
    casper.echo('请输入shareId', 'ERROR');
    casper.exit();
}
var url = 'http://' + host + ':' + port + '/web/share.html?hash=' + shareId;
casper.echo('测试地址:' + url, 'INFO');

// 外链正常页面功能测试
casper.test.begin('外链正常页面功能测试', 7, function(test) {
    casper.start(url, function() {
        casper.then(function() {
            Q.fcall(casper.wait(1500, function() {
                var name = "1.外链页面正常显示";
                capture(name);
                // 页面
                var xtable = casper.evaluate(function() {
                    return document.querySelector('.xtable-row');
                });
                // 分享人
                var author = casper.evaluate(function() {
                    return document.querySelector('.author').innerHTML;
                });
                // 分享时间
                var time = casper.evaluate(function() {
                    return document.querySelector('.time').innerHTML;
                });
                // 保存次数
                var saveCount = casper.evaluate(function() {
                    return document.querySelector('.saveCount').innerHTML;
                });
                //下载次数
                var dlCount = casper.evaluate(function() {
                    return document.querySelector('.dlCount').innerHTML;
                });
                // 查看次数
                var viewCount = casper.evaluate(function() {
                    return document.querySelector('.viewCount').innerHTML;
                });
                // 过期时间
                var expires = casper.evaluate(function() {
                    return document.querySelector('.expires').innerHTML;
                });
                var flag = false;
                if (xtable && author && time && saveCount && dlCount && viewCount && expires) {
                    flag = true;
                }
                test.assert(flag, name);
            })).then(casper.wait(200, function() {
                var name = "2.不选择文件打包下载提示正常";
                this.click('.batch-download');
                capture(name);
                var tip = casper.evaluate(function() {
                    return document.querySelector('.xtip').innerHTML;
                });
                var result = tip.indexOf('选择');
                test.assert(result > -1, name);
            })).then(casper.wait(2000, function() {
                var name = "3.不选择文件批量转存提示正常";
                casper.click('.batch-save');
                capture(name);
                var tip = casper.evaluate(function() {
                    return document.querySelector('.xtip').innerHTML;
                });
                var result = tip.indexOf('选择');
                test.assert(result > -1, name);
                casper.click('.xtable-row[index="0"]');
                casper.click('.batch-download');
            })).then(casper.wait(2000, function() {
                var name = "4.选择文件打包下载正常";
                capture(name);
                var alert = casper.evaluate(function() {
                    return $('#xmsg').length;
                });
                test.assert(alert == 0, name);
                casper.click('.batch-save');
            })).then(casper.wait(200, function() {
                var name = "5.转存对话框显示正常";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        dialog: $('#save-dialog').length,
                        xtree_node: $('.xtree-node').length
                    };
                });
                test.assert(result.dialog > 0 && result.xtree_node > 0, name);
                casper.click('.xtree-node:first-of-type>.xtree-a');
            })).then(casper.wait(0, function() {
                var name = "6.转存对话框点击文件显示正常";
                capture(name);
                test.assertExists('.xtree-selected', name);
                casper.click('button[name="save"]');
            })).then(casper.wait(200, function() {
                var name = "7.转存成功";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        dialog: $('#save-dialog').length,
                        tip: $('.xtip').html()
                    };
                });
                test.assert(result.dialog == 0 && result.tip.indexOf('成功') > -1, name);
            }));
        });
    });

    casper.run(function() {
        test.done();
    });
});
