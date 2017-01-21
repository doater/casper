phantom.injectJs('lib/base.js');
// 初始化文件路径
init('4.console/10.commonconf.js');
// 指定路径
var url = 'http://' + host + ':' + port + '/web/console.html';
casper.test.begin('常规设置功能测试', 61, function(test) {
    casper.start(url, function() {
        // 常规设置行数
        var max;
        // 所有有opt菜单项的下标集合
        var indexs = [];
        casper.then(function() {
            Q.fcall(casper.wait(1500, function() {
                casper.click('.nav-item[name="conf"]');
                casper.click('.nav-item[name="commonconf"]');
            })).then(casper.wait(1500, function() {
                var name = "常规设置页面加载正常";
                capture(name);
                var result = casper.evaluate(function() {
                    return $('.xtable-list .xtable-row').length;
                });
                max = result;
                test.assert(result > 0, name);
            }));
        });
        // 初始化indexs
        casper.then(function() {
            var i = -1;
            casper.repeat(max, function() {
                Q.fcall(casper.wait(0, function() {
                    i++;
                    var exitOpts = casper.evaluate(function(i) {
                        if ($('.xtable-row[index="' + i + '"]').find('.conf-opt').length) return true;
                        else return false;
                    }, i);
                    if (exitOpts) indexs.push(i);
                }));
            });
        });
        // 根据indexs依次点击菜单选项
        casper.then(function() {
            // 初始下标
            var i = -1;
            var max = indexs.length;
            casper.repeat(max, function() {
                Q.fcall(casper.wait(0, function() {
                    i++;
                    var index = indexs[i];
                    casper.click('.xtable-row[index="' + index + '"] .conf-opt');
                })).then(casper.wait(500, function() {
                    var index=indexs[i];
                    var captureName=casper.evaluate(function(index){
                        var data=$('#datalist').table('getData');
                        return data[index].key
                    },index);
                    var name = captureName+"操作菜单正常显示";
                    capture(name);
                    var result = casper.evaluate(function() {
                        return $('.xdialog').length;
                    });
                    test.assert(result > 0, name);
                    casper.click('button[name="save"]');
                })).then(casper.wait(1500,function(){
                    var name="设置成功";
                    capture(name);
                    var result=casper.evaluate(function(){
                        return {
                            xdialog:$('.xdialog').length,
                            xmsg:$(".xmsg").length
                        };
                    })
                    test.assert(result.xdialog==0&&result.xmsg==0,name);
                }));
            });
        });

    });
    casper.run(function() {
        test.done();
    });
});