/*

# 后台用户管理模块(用户列表功能测试)

1. 用户列表初始状态
2. 点击操作按钮正常显示菜单
3. 编辑用户对话框初始状态
4. 编辑用户时用户名为空
5. 编辑用户时内容不合法
6. 设置部门初始状态
7. 限制设置初始状态
8. 部门搜索功能
9. 添加用户正常弹框
10. 删除用户正常弹框
11. 搜索用户正常列出搜索内容

*/
phantom.injectJs('lib/base.js');

init('4.console/3.userlist.js');

var url = 'http://' + host + ':' + port + '/web/console.html#userlist/' + Math.random();
casper.echo('测试地址：' + url, 'INFO');

// 1）测试名字，这个自己给定；2）回调函数中测试方法的个数；3）回调函数，回调函数中定义了所有的测试业务。
casper.test.begin('后台用户管理模块(用户列表功能测试)', 11, function(test) {
    casper.start(url, function() {
        casper.then(function() {
            Q.fcall(casper.wait(1500, function() {
                var name = '1.用户列表初始状态';
                capture(name);
                // 搜索框加载成功
                var search = casper.evaluate(function() {
                    return document.querySelector('.tree-search').innerHTML;
                });
                // 用户操作栏加载成功
                var toolbar = casper.evaluate(function() {
                    return document.querySelector('.xtable-toolbar').innerHTML;
                });
                var flag = false;
                if (search && toolbar) {
                    flag = true;
                }
                test.assert(flag, name);
            })).then(casper.wait(500, function() {
                var name = '2.点击操作按钮正常显示菜单';
                casper.click('.col-span .user-opt');
                capture(name);
                test.assertVisible('#xmenu', name);
                casper.click('#xmenu li[name="edit"]');
            })).then(casper.wait(500, function() {
                var name = '3.编辑用户对话框初始状态';
                capture(name);
                test.assertVisible('#edit-dialog', name);
                casper.evaluate(function(name) {
                    $('.group-col input[name="nickName"]').val(name);
                }, '');
                casper.click('.xdialog-footer button[name="save"]');
            })).then(casper.wait(500, function() {
                var name = '4.编辑用户时用户名为空';
                capture(name);
                test.assertExists('.xvalid-warn', name);
                casper.evaluate(function(name, quota, select) {
                    $('.group-col input[name="nickName"]').val(name);
                    $('.quota-input').find('input[name="quota"]').val('-9999');
                }, 'test');
                casper.click('.xdialog-footer button[name="save"]');
            })).then(casper.wait(500, function() {
                var name = '5.编辑用户时内容不合法';
                capture(name);
                test.assertExists('#xmsg', name);
                casper.click('.xmsg-ok');
                casper.click('.xdialog-footer button[name="cancel"]');
                casper.click('.col-span .user-opt');
            })).then(casper.wait(500, function() {
                casper.click('#xmenu li[name="move"]');
            })).then(casper.wait(500, function() {
                var name = '6.设置部门初始状态';
                capture(name);
                var tags = casper.evaluate(function() {
                    return document.querySelectorAll('#move-dialog .select-user-div .tags');
                });
                var flag = false;
                if (tags.length > 0) flag = true;
                test.assert(flag, name);
                casper.click('.xdialog-footer button[name="cancel"]');
                casper.click('.col-span .user-opt');
            })).then(casper.wait(500, function() {
                casper.click('#xmenu li[name="setLimit"]');
            })).then(casper.wait(500, function() {
                var name = '7.限制设置初始状态';
                capture(name);
                test.assertExists('#xdialog', name);
                casper.click('.xdialog-footer button[name="close"]');
            }))
        });

        // 测试tool-bar上的按钮是否正常
        casper.then(function() {
            Q.fcall(casper.wait(100, function() {
                casper.evaluate(function() {
                    $('.dept-tree-input').val('a');
                });
                casper.click('.deptTreeSe');
            })).then(casper.wait(1000, function() {
                var name = '8.部门搜索功能';
                var text = casper.evaluate(function() {
                    return $('#deptSeTree li').eq(0).find('.xtree-text').text().toLowerCase();
                });
                capture(name);
                test.assert(text.indexOf('a') > -1, name);
                casper.evaluate(function() {
                    $('#deptSeTree li').eq(0).find('.xtree-check').addClass('checked');
                })
                casper.click('.user-create');
            })).then(casper.wait(500, function() {
                var name = '9.添加用户正常弹框';
                capture(name);
                casper.click('.xdialog-footer .btn-primary');
                casper.wait(500, function() {
                    test.assertExists('#fm', name);
                });
            })).then(casper.wait(500, function() {
                casper.click('.xdialog-footer .btn[name="cancel"]');
                casper.wait(500, function() {
                    casper.click('.batch-delete');
                });
            })).then(casper.wait(500, function() {
                var name = '10.删除用户正常弹框';
                capture(name);
                test.assertExists('#xmsg', name);
                casper.click('.xmsg-close');
            })).then(casper.wait(500, function() {
                var name = '11.搜索用户正常列出搜索内容';
                var total = casper.evaluate(function() {
                    $('#toolbar-form input[name="keyword"]').val('admin');
                    return $('.xpage-total').text();
                })
                casper.click('#toolbar-search');
                casper.wait(500, function() {
                    var flog = casper.evaluate(function(total) {
                        return $('.xpage-total').text() !== total;
                    }, total)
                    capture(name);
                    test.assert(flog, name);
                });
            }))
        })
    });

    casper.run(function() {
        test.done();
    });
});
