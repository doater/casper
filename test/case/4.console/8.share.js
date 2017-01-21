phantom.injectJs('lib/base.js');

function initShare() {
    casper.test.begin('分享指定文件给TestUser1',1,function(test) {
        var url = 'http://' + host + ':' + port + '/web/index.html';
        init('4.console/8.share.js/prepare');
        // 文件配置参数
        var config = ['doc', 'png', 'pptx', 'txt', 'xlsx', 'zip', 'lbk'];
        // 传入文件名,点击右键菜单
        function rightClickFile(filename) {
            var index = casper.evaluate(function(filename) {
                var data = $('#filelist').table('getData');
                var index;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name == filename) index = i;
                }
                return index;
            }, filename);
            casper.mouse.rightclick('.xtable-row[index="' + index + '"]');
        }
        casper.start(url,function(){
            casper.then(function() {
                Q.fcall(casper.wait(1500, function() {
                    casper.click('.menu-item[name="fs"]');
                })).then(casper.wait(1500, function() {
                    casper.click('.new-btn .btn');
                })).then(casper.wait(200, function() {
                    for (var i = 0; i < config.length; i++) {
                        var outPath = '/tmp/' + config[i] + '_example.' + config[i];
                        casper.page.uploadFile("input[name='file']", out + outPath);
                    }
                })).then(casper.wait(4000, function() {
                    var name = "上传完毕";
                    capture(name);
                    test.assert(true, name);
                }));
            });
            var i = -1;
            var max = config.length;
            casper.repeat(max, function() {
                Q.fcall(casper.wait(0, function() {
                    i++;
                    var filename = config[i] + '_example.' + config[i];
                    rightClickFile(filename);
                })).then(casper.wait(500, function() {
                    var name="右键菜单成功显示";
                    capture(name);
                    casper.click('.menu-item[name="filelink"]');
                })).then(casper.wait(500, function() {
                    var name="链接分享成功";
                    capture(name);
                    casper.click('.xmsg-close');
                })).then(casper.wait(500,function(){

                }));
            });
        });
        casper.run(function(){
            test.done();
        });
    });
}
initShare();

casper.test.begin('外链管理功能测试', 6, function(test) {
    var url = 'http://' + host + ':' + port + '/web/console.html';
    casper.echo('测试地址：' + url, 'INFO');
    init('4.console/8.share.js');
    // 文件配置参数
    var config = ['doc', 'png', 'pptx', 'txt', 'xlsx', 'zip', 'lbk'];
    casper.start(url, function() {
        casper.then(function() {
            Q.fcall(casper.wait(1500, function() {
                casper.click('.nav-item[name="share"]');
            })).then(casper.wait(1500, function() {
                var name = "外链管理页面显示正常";
                capture(name);
                var flag = true;
                var toolbar = casper.evaluate(function() {
                    return {
                        batchDelete: $('#batch-delete').length,
                        shareUser: $('#shareUser').length,
                        keyword: $('input[name=keyword]').length,
                        status: $('select[name=status]').length,
                        search: $('#toolbar-search').length,
                        reset: $('#toolbar-reset').length
                    };
                });
                var tablelist = casper.evaluate(function() {
                    return $('#datalist').length;
                });
                for (var i in toolbar) {
                    if (toolbar[i] == 0) flag = false;
                }
                if (tablelist == 0) flag = false;
                test.assert(flag, name);
            }));
        });
        // 删除外链
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.click('.xtable-row:first-child .link-unshare');
            })).then(casper.wait(500,function(){
                var name="删除分享确认框显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(500,function(){
                var name="删除链接成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        xmsg:$('.xmsg').length,
                        tip:$('.xtip').html()
                    };
                });
                test.assert(result.xmsg==0&&result.tip.indexOf('成功')>-1,name);
            }));
        });
        // 批量删除外链
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                casper.click('#batch-delete');
            })).then(casper.wait(500,function(){
                var name="未选择外链点击批量删除,警告框显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        xmsg:$('.xmsg').length,
                        content:$('.xmsg-body').html()
                    };
                });
                test.assert(result.xmsg>0&&result.content.indexOf('请')>-1,name,name);
                casper.click('.xmsg-ok');
                casper.click('.xtable-title .xcheck')
            })).then(casper.wait(200,function(){
                var name="选中所有的外链";
                capture(name);
                casper.click('#batch-delete');
            })).then(casper.wait(500,function(){
                var name="批量选中外链,删除外链确认框显示正确";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        xmsg:$('.xmsg').length,
                        content:$('.xmsg-body').html()
                    };
                });
                test.assert(result.xmsg>0&&result.content.indexOf('要')>-1,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(500,function(){
                var name="外链批量删除成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        xmsg:$('.xmsg').length,
                        tip:$('.xtip').html()
                    };
                });
                test.assert(result.xmsg==0&&result.tip.indexOf('成功')>-1,name);
            }));
        });
    });
    casper.run(function() {
        test.done();
    });
});