phantom.injectJs('lib/base.js');

function initUserTrash() {
    casper.test.begin('删除指定添加的用户', 1, function(test) {
        var url = 'http://' + host + ':' + port + '/web/console.html';
        init('4.console/9.usertrash.js/prepare');
        casper.start(url, function() {
            // 获得用户的行下标
            function getIndex(userName) {
                var index = casper.evaluate(function(userName) {
                    var data = $('#datalist').table('getData');
                    var index;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].name == userName) index = i;
                    }
                    return index;
                }, userName);
                return index;
            }
            casper.then(function() {
                Q.fcall(casper.wait(1500, function() {
                    casper.click('.nav-item[name=user]');
                    casper.click('.nav-item[name=userlist]');
                }));
            });
            var i = 0;
            casper.repeat(10, function() {
                Q.fcall(casper.wait(1500, function() {
                    i++;
                    casper.evaluate(function(i) {
                        $('#deptTree .xtree-check').removeClass('checked');
                        $('#deptTree .xtree-a[title="autoTestDept' + i + '"]').siblings('.xtree-check').addClass('checked');
                    }, i);
                    var name = "选择部门autoTestDept" + i + "成功";
                    capture(name);
                    casper.click('.user-create');
                })).then(casper.wait(500, function() {
                    var account = "waitRecover" + i;
                    var password = '123qwe';
                    casper.evaluate(function(account, password, order) {
                        $('input[name=account]').val(account);
                        $('input[name=nickName]').val(account);
                        $('input[name=password]').val(password);
                        $('input[name=order]').val(order);
                    }, account, password, 99);
                    var name = "添加用户" + account + "对话框显示正常";
                    capture(name);
                    casper.click('button[name="save"]');
                })).then(casper.wait(500, function() {
                    var name = "用户waitRecover" + i + "创建成功";
                    capture(name);
                }));
            });
            casper.then(function() {
                Q.fcall(casper.wait(1500, function() {
                    casper.click('#toolbar-reset');
                })).then(casper.wait(1500, function() {
                    var name = "重置成功";
                    capture(name);
                }));
            });
            // 选中所有待恢复的用户
            var j = 0;
            casper.repeat(10, function() {
                Q.fcall(casper.wait(0, function() {
                    j++;
                    var userName = 'waitRecover' + j;
                    var index = getIndex(userName);
                    casper.evaluate(function(index) {
                        $('.xtable-row[index="' + index + '"]').addClass('xtable-active');
                    }, index);
                    var name = "选中所有待恢复的用户";
                    if (j == 10) capture(name);
                }));
            });
            // 点击批量删除按钮
            casper.then(function() {
                Q.fcall(casper.wait(0, function() {
                    casper.click('.batch-delete');
                })).then(casper.wait(500, function() {
                    casper.click('.xmsg-ok');
                })).then(casper.wait(1500, function() {

                }));
            });
        });
        casper.run(function() {
            test.done();
        });
    });
}
// 初始化数据
initUserTrash();
// 开始测试
casper.test.begin('已删除用户列表功能测试', 8, function(test) {
    var url = 'http://' + host + ':' + port + '/web/console.html';
    init('4.console/9.usertrash.js');
    casper.echo('测试地址：' + url, 'INFO');
    function getRowData(userName) {
        var data = casper.evaluate(function(userName) {
            var data = $('#datalist').table('getData');
            var index;
            for (var i = 0; i < data.length; i++) {
                if (data[i].name == userName) index = i;
            }
            return data[index];
        }, userName);
        return data;
    }
    function clickOpt(userName) {
        var index = casper.evaluate(function(userName) {
            var data = $('#datalist').table('getData');
            var index;
            for (var i = 0; i < data.length; i++) {
                if (data[i].name == userName) index = i;
            }
            return index;
        }, userName);
        casper.click('.xtable-row[index="' + index + '"] .user-opt');
    }
    function getIndex(userName) {
        var index = casper.evaluate(function(userName) {
            var data = $('#datalist').table('getData');
            var index;
            for (var i = 0; i < data.length; i++) {
                if (data[i].name == userName) index = i;
            }
            return index;
        }, userName);
        return index;
    }
    casper.start(url, function() {
        casper.then(function() {
            Q.fcall(casper.wait(1500, function() {
                casper.click('.nav-item[name="user"]');
                casper.click('.nav-item[name="usertrash"]');
            })).then(casper.wait(1500, function() {
                var name = "已删除用户列表显示正常";
                capture(name);
                var flag = true;
                var toolbar = casper.evaluate(function() {
                    return {
                        batchRecover: $('.batch-recover').length,
                        keyword: $('input[name="keyword"]'),
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
        //搜索
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.evaluate(function(){
                    $('input[name="keyword"]').val('waitRecover');
                });
                casper.click('#toolbar-search');
            })).then(casper.wait(1500,function(){
                var name="搜索功能正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xtable-list .xtable-row').length;
                });
                test.assert(result>=10,name);
            }));
        });
        //点击右键菜单
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                clickOpt('waitRecover1');
            })).then(casper.wait(500,function(){
                var name="菜单项正确显示";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        items: $('#xmenu .menu-item').length,
                        menu: $('#xmenu').length
                    };
                });
                test.assert(result.items > 0 && result.menu > 0, name);
                casper.click('.menu-item[name="recover"]');
            })).then(casper.wait(500,function(){
                var name="点击恢复,确认框显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(500,function(){
                var name="waitRecover1恢复成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result==0,name);
            }));
        });
        // 点击批量恢复
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.click('.batch-recover');
            })).then(casper.wait(500,function(){
                var result=casper.evaluate(function(){
                    return {
                        xmsg:$('.xmsg').length,
                        content:$('.xmsg-body').html()
                    };
                });
                var name="未选择用户批量恢复,警告框显示正常";
                capture(name);
                test.assert(result.xmsg==1&&result.content.indexOf('请')>-1,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(1000,function(){

            }));
        });
        // 批量选中指定的9个用户 waitRecover2.....waitRecover10
        var i=1;
        casper.repeat(9,function(){
            Q.fcall(casper.wait(0,function(){
                i++;
                var filename='waitRecover'+i;
                var index=getIndex(filename);
                casper.evaluate(function(index){
                    $('.xtable-row[index="'+index+'"]').addClass('xtable-active');
                },index);
                var name="批量选中指定9个用户";
                if(i==10) capture(name);
            }));
        });
        // 点击批量恢复
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.click('.batch-recover');
            })).then(casper.wait(500,function(){
                var name="批量删除确认框正确显示";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        xmsg:$('.xmsg').length,
                        content:$('.xmsg-body').html()
                    };
                });
                test.assert(result.xmsg>0&&result.content.indexOf('确定')>-1,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(500,function(){
                var name="批量恢复成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result==0,name);
            }));
        });
        // 恢复原始数据,继续批量刚恢复的指定用户删除
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                casper.click('.nav-item[name=user]');
                casper.click('.nav-item[name=userlist]');
            })).then(casper.wait(1500,function(){

            }));
        });
        // 选中所有待恢复的用户
        var j = 0;
        casper.repeat(10, function() {
            Q.fcall(casper.wait(0, function() {
                j++;
                var userName = 'waitRecover' + j;
                var index = getIndex(userName);
                casper.evaluate(function(index) {
                    $('.xtable-row[index="' + index + '"]').addClass('xtable-active');
                }, index);
                var name = "选中所有待恢复的用户";
                if (j == 10) capture(name);
            }));
        });
        // 点击批量删除按钮
        casper.then(function() {
            Q.fcall(casper.wait(0, function() {
                casper.click('.batch-delete');
            })).then(casper.wait(500, function() {
                casper.click('.xmsg-ok');
            })).then(casper.wait(1500, function() {
                var name="删除完毕";
                capture(name);
            }));
        });
    });
    casper.run(function() {
        test.done();
    });
});