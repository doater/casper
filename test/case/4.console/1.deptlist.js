// 先运行initialize中的initialize.js,初始化测试数据
phantom.injectJs('lib/base.js');

init('4.console/1.deptlist.js');
// 部门列表显示
// 添加/编辑部门
// 删除部门
// 移动部门
// 部门锁定
// 部门管理员

var url = 'http://' + host + ':' + port + '/web/console.html';
casper.echo('测试地址：' + url, 'INFO');

casper.test.begin('部门列表功能测试', 28, function(test) {
    //deptName: 部门名称
    // getIndex: 通过部门名称，获得xtable-row的index
    // clickOpt: 通过部门名称，点击操作按钮
    function getRowData(deptName) {
        var data = casper.evaluate(function(deptName) {
            var data = $('#datalist').table('getData');
            var index;
            for (var i = 0; i < data.length; i++) {
                if (data[i].name == deptName) index = i;
            }
            return data[index];
        }, deptName);
        return data;
    }

    function getIndex(deptName) {
        var index = casper.evaluate(function(deptName) {
            var data = $('#datalist').table('getData');
            var index;
            for (var i = 0; i < data.length; i++) {
                if (data[i].name == deptName) index = i;
            }
            return index;
        }, deptName);
        return index;
    }

    function clickOpt(deptName) {
        var index = casper.evaluate(function(deptName) {
            var data = $('#datalist').table('getData');
            var index;
            for (var i = 0; i < data.length; i++) {
                if (data[i].name == deptName) index = i;
            }
            return index;
        }, deptName);
        casper.click('.xtable-row[index="' + index + '"] .dept-opt');
    }
    // 批量创建待测试的部门
    // name为部门名字
    function createTestDept(name) {
        var m = 0;
        casper.repeat(10, function() {
            Q.fcall(casper.wait(1500, function() {
                m++;
                casper.click('.create-dept');
            })).then(casper.wait(500, function() {
                var deptName = name + m;
                casper.evaluate(function(deptName, order) {
                    $('input[name=name]').val(deptName);
                    $('input[name=order]').val(order);
                }, deptName, 1);
                casper.click('button[name="save"]');
            })).then(casper.wait(500, function() {}));
        });
    }
    casper.start(url, function() {
        // 列表显示正常
        casper.then(function() {
            Q.fcall(casper.wait(1500, function() {
                casper.click('.nav-item[name="dept"]');
                casper.click('.nav-item[name="deptlist"]');
            })).then(casper.wait(1500, function() {
                var name = "部门列表显示正常";
                capture(name);
                // test.assert(true,name);
                var flag = true;
                // 左边栏信息加载成功
                var west = casper.evaluate(function() {
                    return {
                        input: $('.dept-tree-input').length,
                        btn: $('.deptTreeSe').length,
                        treeNode: $('.xtree-node').length
                    };
                });
                //toolbar信息加载成功
                var toolbar = casper.evaluate(function() {
                    return {
                        createDept: $('.create-dept').length,
                        batchDelete: $('.batch-delete').length,
                        batchMove: $('.batch-move').length,
                        keyword: $('input[name=keyword]').length,
                        search: $('#toolbar-search').length,
                        reset: $('#toolbar-reset').length
                    };
                });
                // 部门列表渲染成功
                var tablelist = casper.evaluate(function() {
                    return $('.datalist').length;
                });
                for (var i in west) {
                    if (west[i] == 0) flag = false;
                }
                for (var i in toolbar) {
                    if (toolbar[i] == 0) flag = false;
                }
                if (tablelist == 0) flag = false;
                test.assert(flag, name);
            }));
        });
        // 添加用户
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                // 点击指定的部门 autoTestDept1
                clickOpt('autoTestDept1');
            })).then(casper.wait(500, function() {
                var name = "点击操作按钮,菜单显示正常";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        items: $('#xmenu .menu-item').length,
                        menu: $('#xmenu').length
                    }
                });
                test.assert(result.items > 0 && result.menu > 0, name);
                casper.click('.menu-item[name="add"]');
            })).then(casper.wait(500, function() {
                var name = "添加部门对话框显示正常";
                capture(name);
                var result = casper.evaluate(function() {
                    return $('.xdialog').length
                });
                test.assert(result != 0, name);
            })).then(casper.wait(0, function() {
                casper.evaluate(function(deptName, order) {
                    $('input[name=name]').val(deptName);
                    $('input[name=order]').val(order);
                }, 'addTestDept', 'aaa');
                var name = "填写非法的排序值";
                capture(name);
                casper.click('button[name="save"]');
            })).then(casper.wait(200, function() {
                var name = "错误提示框正常弹出";
                capture(name);
                var result = casper.evaluate(function() {
                    return $('.xmsg').length;
                });
                test.assert(result > 0, name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(200, function() {
                casper.evaluate(function(deptName, order) {
                    $('input[name=name]').val(deptName);
                    $('input[name=order]').val(order);
                }, 'addTestDept', 1);
                var name = "正确填写对话框";
                capture(name);
                casper.click('button[name="save"]');
            })).then(casper.wait(500, function() {
                var name = "添加部门成功";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        dialog: $('.xdialog').length,
                        tip: $('.xtip').html()
                    };
                });
                test.assert(result.dialog == 0 && result.tip.indexOf('成功') > -1, name);
            }));
        });
        // 编辑用户
        casper.then(function() {
            Q.fcall(casper.wait(1000, function() {
                clickOpt('autoTestDept1');
            })).then(casper.wait(500, function() {
                casper.click('.menu-item[name="edit"]');
            })).then(casper.wait(500, function() {
                var name = "编辑用户的框成功弹出";
                capture(name);
                var result = casper.evaluate(function() {
                    return $('.xdialog').length;
                });
                test.assert(result > 0, name);
            })).then(casper.wait(0, function() {
                casper.evaluate(function(deptName, order) {
                    $('input[name=name]').val(deptName);
                    $('input[name=order]').val(order);
                }, 'autoTestDept1', 'aaa');
                var name = "填写非法的排序值";
                capture(name);
                casper.click('button[name="save"]');
            })).then(casper.wait(200, function() {
                var name = "错误提示框成功弹出";
                capture(name);
                var result = casper.evaluate(function() {
                    return $('.xmsg').length;
                });
                test.assert(result > 0, name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(0, function() {
                casper.evaluate(function(deptName, order) {
                    $('input[name=name]').val(deptName);
                    $('input[name=order]').val(order);
                }, 'newAutoTestDept1', 23);
                var name = "正确填写排序值和新部门名称";
                capture(name);
                casper.click('button[name="save"]');
            })).then(casper.wait(500, function() {
                var name = "部门编辑成功";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        dialog: $('.xdialog').length,
                        tip: $('.xtip').html()
                    };
                });
                test.assert(result.dialog == 0 && result.tip.indexOf('成功') > -1, name);
                clickOpt('newAutoTestDept1');
            })).then(casper.wait(500, function() {
                // 恢复
                casper.click('.menu-item[name="edit"]');
            })).then(casper.wait(500, function() {
                casper.evaluate(function(deptName, order) {
                    $('input[name=name]').val(deptName);
                    $('input[name=order]').val(order);
                }, 'autoTestDept1', 1);
                casper.click('button[name="save"]');
            })).then(casper.wait(500, function() {
                var name = "部门编辑回初始状态成功";
                capture(name);
                var dialog = casper.evaluate(function() {
                    return $('.xdialog').length;
                });
                test.assert(dialog == 0, name);
            }));
        });

        // 删除部门
        casper.then(function() {
            Q.fcall(casper.wait(1000, function() {
                clickOpt('addTestDept');
            })).then(casper.wait(500, function() {
                casper.click('.menu-item[name="delete"]');
            })).then(casper.wait(500, function() {
                var name = "确认框正确弹出";
                capture(name);
                var result = casper.evaluate(function() {
                    return $('.xmsg').length;
                });
                test.assert(result > 0, name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(500, function() {
                var name = "部门删除成功";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        xmsg: $('.xsmg').length,
                        tip: $('.xtip').html()
                    };
                });
                test.assert(result.xmsg == 0 && result.tip.indexOf('成功') > -1, name);
            }));
        });

        //部门锁定 
        casper.then(function() {
            Q.fcall(casper.wait(1000, function() {
                clickOpt('autoTestDept1');
            })).then(casper.wait(500, function() {
                var name = "部门锁定菜单项存在";
                capture(name);
                var result = casper.evaluate(function() {
                    return $('.menu-item[name="lock"]').length;
                });
                test.assert(result > 0, name);
                casper.click('.menu-item[name="lock"]');
            })).then(casper.wait(500, function() {
                var name = "确认框正确弹出";
                capture(name);
                var result = casper.evaluate(function() {
                    return $('.xmsg').length;
                });
                test.assert(result > 0, name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(500, function() {
                var name = "部门锁定成功";
                capture(name);
                var tip = casper.evaluate(function() {
                    return $('.xtip').html();
                });
                var rowData = getRowData('autoTestDept1');
                var flag = false;
                if (rowData.lock == 1 && tip.indexOf('成功') > -1) flag = true;
                test.assert(flag, name);
            }));
        });
        // 部门解锁
        casper.then(function() {
            Q.fcall(casper.wait(1000, function() {
                clickOpt('autoTestDept1');
            })).then(casper.wait(500, function() {
                var name = "部门解锁菜单项存在";
                capture(name);
                var result = casper.evaluate(function() {
                    return $('.menu-item[name="unlock"]').length;
                });
                test.assert(result > 0, name);
                casper.click('.menu-item[name="unlock"]');
            })).then(casper.wait(500, function() {
                var name = "确认框正确弹出";
                capture(name);
                var result = casper.evaluate(function() {
                    return $('.xmsg').length;
                });
                test.assert(result > 0, name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(500, function() {
                var name = "部门解锁成功";
                capture(name);
                var tip = casper.evaluate(function() {
                    return $('.xtip').html();
                });
                var rowData = getRowData('autoTestDept1');
                var flag = false;
                if (rowData.lock == 0 && tip.indexOf('成功') > -1) flag = true;
                test.assert(flag, name);
            }));
        });

        // 移动部门
        casper.then(function() {
            Q.fcall(casper.wait(0, function() {
                casper.click('.create-dept');
            })).then(casper.wait(500, function() {
                casper.evaluate(function(deptName, order) {
                    $('input[name=name]').val(deptName);
                    $('input[name=order]').val(order);
                }, 'moveTestDept', 1);
                casper.click('button[name="save"]');
            })).then(casper.wait(500, function() {
                var name = "创建moveTestDept成功";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        dialog: $('.xdialog').length,
                        tip: $('.xtip').html()
                    };
                });
                test.assert(result.dialog == 0 && result.tip.indexOf('成功') > -1, name);
                clickOpt('moveTestDept');
            })).then(casper.wait(1500, function() {
                casper.click('.menu-item[name="move"]');
            })).then(casper.wait(500, function() {
                var name = "部门移动对话框弹出正常";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        dialog: $('.xdialog').length,
                        xtreeNode: $('.xtree-node').length
                    };
                });
                test.assert(result.dialog > 0 && result.xtreeNode > 0, name);
                casper.click('button[name="move"]');
            })).then(casper.wait(200, function() {
                var name = "未选择部门,弹出警告框正常";
                capture(name);
                var alert = casper.evaluate(function() {
                    return $('.xmsg').length;
                });
                test.assert(alert > 0, name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(0, function() {
                var name = "选择moveTestDept移动到autoTestDept1";
                casper.evaluate(function() {
                    $('#moveTree').tree('select', {
                        target: $('.xtree-a[title=autoTestDept1]').parents('.xtree-node'),
                        trigger: true
                    });
                });
                capture(name);
                casper.click('button[name="move"]');
            })).then(casper.wait(500, function() {
                var name = "部门移动成功";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        dialog: $('.xdialog').length,
                        tip: $('.xtip').html()
                    };
                });
                test.assert(result.dialog == 0 && result.tip.indexOf('成功') > -1, name);
                casper.click('#toolbar-reset');
            })).then(casper.wait(1500,function(){
                clickOpt('moveTestDept');
            })).then(casper.wait(500,function(){
                casper.click('.menu-item[name="move"]');
            })).then(casper.wait(500,function(){
                var name = "选择moveTestDept移动到根部门";
                casper.evaluate(function() {
                    $('#moveTree').tree('select', {
                        target: $('.xtree-a[title=根部门]').parents('.xtree-node'),
                        trigger: true
                    });
                });
                capture(name);
                casper.click('button[name="move"]');
            })).then(casper.wait(500,function(){
                var name="部门移动回根部门成功";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        dialog: $('.xdialog').length,
                        tip: $('.xtip').html()
                    };
                });
                test.assert(result.dialog == 0 && result.tip.indexOf('成功') > -1, name);
                clickOpt('moveTestDept');
            })).then(casper.wait(500,function(){
                casper.click('.menu-item[name="delete"]');
            })).then(casper.wait(200,function(){
                casper.click('.xmsg-ok');
            }));
        });

        // 批量创建10个待删除部门
        createTestDept('waitDeleteDept');

        //批量删除
        // step1
        var indexs=[];
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.click('.batch-delete');
            })).then(casper.wait(500,function(){
                var name="未选择部门警告框弹出正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
                for(var i=1;i<=10;i++){
                    indexs.push(getIndex('waitDeleteDept'+i));
                }
            }));
        });
        // step2
        var j=-1;
        casper.repeat(10,function(){
            Q.fcall(casper.wait(0,function(){
                j++;
                var name="选中所有待删除的部门";
                casper.evaluate(function(j,indexs){
                    $('.xtable-row[index="'+indexs[j]+'"]').addClass('xtable-active');
                },j,indexs);
                if(j==9) capture(name);
            }));
        });
        //step3
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.click('.batch-delete');
            })).then(casper.wait(500,function(){
                var name="确认框弹出正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(500,function(){
                var name="批量删除成功";
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

        // 批量创建10个待移动的部门;
        createTestDept('waitMoveDept');
        //批量移动
        // step1
        var moveIndexs = [];
        casper.then(function() {
            Q.fcall(casper.wait(0, function() {
                casper.click('.batch-move');
            })).then(casper.wait(200, function() {
                var name = "未选择部门移动警告框弹出正常";
                capture(name);
                var result = casper.evaluate(function() {
                    return $('.xmsg').length;
                });
                test.assert(result > 0, name);
                casper.click('.xmsg-ok');
                for (var i = 1; i <= 10; i++) {
                    moveIndexs.push(getIndex('waitMoveDept' + i));
                }
            }));
        });
        // step2
        var n = -1;
        casper.repeat(10,function() {
            Q.fcall(casper.wait(0, function() {
                n++;
                var name = "选中所有待移动的部门";
                casper.evaluate(function(n, moveIndexs) {
                    $('.xtable-row[index="' + moveIndexs[n] + '"]').addClass('xtable-active');
                }, n, moveIndexs);
                if (n == 9) capture(name);
            }));
        });
        // step3
        casper.then(function() {
            Q.fcall(casper.wait(0, function() {
                casper.click('.batch-move');
            })).then(casper.wait(500, function() {
                var name = "批量移动对话框显示正常";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        dialog: $('.xdialog').length,
                        xtreeNode: $('.xtree-node').length
                    };
                });
                test.assert(result.dialog > 0 && result.xtreeNode > 0, name);
            })).then(casper.wait(0,function(){
                var name="选中autoTestDept1";
                casper.evaluate(function() {
                    $('#moveTree').tree('select', {
                        target: $('.xtree-a[title=autoTestDept1]').parents('.xtree-node'),
                        trigger: false
                    });
                });
                capture(name);
                casper.click('button[name="move"]');
            })).then(casper.wait(500, function() {
                var name = "批量移动成功";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        dialog: $('.xdialog').length,
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