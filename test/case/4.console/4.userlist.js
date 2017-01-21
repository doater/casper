phantom.injectJs('lib/base.js');
init('4.console/4.userlist.js');
// 用户列表显示
// 添加/编辑用户
// 用户删除
// 设置部门
// 用户锁定
var url = 'http://' + host + ':' + port + '/web/console.html';
casper.echo('测试地址：' + url, 'INFO');

casper.test.begin('用户列表功能测试',45,function(test){
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
    casper.start(url,function(){
        // 列表显示正常
        Q.fcall(casper.wait(1500,function(){
            casper.click('.nav-item[name="user"]');
            casper.click('.nav-item[name="userlist"]');
        })).then(casper.wait(1500,function(){
            var name="用户列表显示正常";
            capture(name);
            var flag=true;
            // 左边栏信息加载成功
            var west=casper.evaluate(function(){
                return {
                    input: $('.dept-tree-input').length,
                    btn: $('.deptTreeSe').length,
                    treeNode: $('.xtree-node').length
                };
            });
            // toolbar信息加载成功
            var toolbar=casper.evaluate(function(){
                return {
                    createUser:$('.user-create').length,
                    batchDelete:$('.batch-delete').length,
                    batchMove:$('.batch-move').length,
                    batchLimit:$('.batch-limit').length,
                    keyword:$('input[name=keyword]').length,
                    select:$('select[name=status]').length,
                    search: $('#toolbar-search').length,
                    reset: $('#toolbar-reset').length
                };
            });
            // 用户列表渲染成功
            var tablelist=casper.evaluate(function(){
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
        // toolbar
        // 添加用户
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.click('.user-create');
            })).then(casper.wait(500,function(){
                var name="不选择部门创建用户,警告框弹出正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(0,function(){
                var name="选中autoTestDept1";
                casper.evaluate(function(){
                    $('#deptTree').tree('check',{
                        target:$('.xtree-a[title=autoTestDept1]').parents('.xtree-node'),
                        trigger:false
                    });
                });
                capture(name);
                casper.click('.user-create');
            })).then(casper.wait(500,function(){
                var name="添加用户对话框成功显示";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xdialog').length;
                });
                test.assert(result>0,name);
                casper.evaluate(function(userName,password,order){
                    $('input[name=account]').val(userName);
                    $('input[name=nickName]').val(userName);
                    $('input[name=password]').val(password);
                    $('input[name=order]').val(order);
                },'addTestUser','123qwe',99);
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="创建用户addTestUser成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        dialog:$('.xdialog').length,
                        tip:$('.xtip').html()
                    };
                });
                test.assert(result.dialog==0&&result.tip.indexOf('成功')>-1,name);
            }));
        });
        // menu
        // 用户编辑
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                clickOpt('addTestUser');
            })).then(casper.wait(500,function(){
                var name = "点击操作按钮,菜单显示正常";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        items: $('#xmenu .menu-item').length,
                        menu: $('#xmenu').length
                    };
                });
                test.assert(result.items > 0 && result.menu > 0, name);
                casper.click('.menu-item[name="edit"]');
            })).then(casper.wait(500,function(){
                var name="用户编辑框成功弹出";
                capture(name);
                var dialog=casper.evaluate(function(){
                    return $('.xdialog').length;
                });
                test.assert(dialog>0,name);
                casper.evaluate(function(userName,order){
                    $('input[name=nickName]').val(userName);
                    $('input[name=order]').val(order);
                },'newAddTestUser','aaa');
                casper.click('button[name="save"]');
            })).then(casper.wait(200,function(){
                var name="输入非法排序值,警告框弹出";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(0,function(){
                var name="不输入用户名,验证不通过正常";
                casper.evaluate(function(userName,order){
                    $('input[name=nickName]').val(userName);
                    $('input[name=order]').val(order);
                },'',99);
                casper.click('button[name="save"]');
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xvalid-warn').length;
                });
                test.assert(result>0,name);
                casper.evaluate(function(userName,order){
                    $('input[name=nickName]').val(userName);
                    $('input[name=order]').val(order);
                },'newAddTestUser',99);
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="编辑addTestUser为newAddTestUser成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        dialog:$('.xdialog').length,
                        tip:$('.xtip').html()
                    };
                });
                test.assert(result.dialog==0&&result.tip.indexOf('成功')>-1,name);
            }));
        });

        //用户禁用
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                clickOpt('addTestUser');
            })).then(casper.wait(500,function(){
                var name="菜单项存在禁用选项";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.menu-item[name="unactive"]').length;
                });
                test.assert(result>0,name);
                casper.click('.menu-item[name=unactive]');
            })).then(casper.wait(500,function(){
                var name="点击禁用弹出确认框正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(500,function(){
                var name="用户addTestUser禁用成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        alert:$('.xmsg').length,
                        tip:$('.xtip').html()
                    };
                });
                var rowData=getRowData('addTestUser');
                var flag=false;
                if(rowData.status==2&&result.alert==0&&result.tip.indexOf('成功')>-1) flag=true;
                test.assert(flag,name); 
            }));
        });

        // 用户激活
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                clickOpt('addTestUser');
            })).then(casper.wait(500,function(){
                var name="菜单项存在激活选项";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.menu-item[name="active"]').length;
                });
                test.assert(result>0,name);
                casper.click('.menu-item[name=active]');
            })).then(casper.wait(500,function(){
                var name="点击禁用弹出确认框正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(500,function(){
                var name="用户addTestUser激活成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        alert:$('.xmsg').length,
                        tip:$('.xtip').html()
                    };
                });
                var rowData=getRowData('addTestUser');
                var flag=false;
                if(rowData.status==4&&result.alert==0&&result.tip.indexOf('成功')>-1) flag=true;
                test.assert(flag,name); 
            }));
        });

        // 设置部门
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                clickOpt('addTestUser');
            })).then(casper.wait(500,function(){
                var name="菜单项存在设置部门选项";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.menu-item[name="move"]').length;
                });
                test.assert(result>0,name);
                casper.click('.menu-item[name=move]');
            })).then(casper.wait(500,function(){
                var name="设置部门对话框弹出正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        dialog:$('.xdialog').length,
                        xtreeNode:$('.xtree-node').length
                    };
                });
                test.assert(result.dialog>0&&result.xtreeNode>0,name);
                casper.evaluate(function(){
                    $('#moveTree').tree('select',{
                        target:$('#moveTree .xtree-a[title=autoTestDept2]').parents('.xtree-node'),
                        trigger:true
                    });
                });
            })).then(casper.wait(0,function(){
                var name="选择autoTestDept2部门显示成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.tags').length;
                });
                test.assert(result==2,name);
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="设置部门移动成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        dialog:$('.xdialog').length,
                        tip:$('.xtip').html()
                    };
                });
                test.assert(result.dialog==0&&result.tip.indexOf('成功')>-1,name);
            }));
        });

        // 设置离职交接
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                clickOpt('addTestUser');
            })).then(casper.wait(500,function(){
                var name="菜单项存在离职交接选项";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.menu-item[name="setHandover"]').length;
                });
                test.assert(result>0,name);
                casper.click('.menu-item[name=setHandover]');
            })).then(casper.wait(500,function(){
                var name="设置离职交接对话框成功显示";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xdialog').length;
                });
                test.assert(result>0,name);
                casper.click('button[name="save"]');
            })).then(casper.wait(200,function(){
                var name="未输入用户名弹出警告框成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
                casper.click('button[name="close"]');
            }));
        });

        // 设置部门管理员
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                clickOpt('addTestUser');
            })).then(casper.wait(500,function(){
                var name="菜单项存在设置部门管理员选项";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.menu-item[name="setDeptAdmin"]').length;
                });
                test.assert(result>0,name);
                casper.click('.menu-item[name=setDeptAdmin]');
            })).then(casper.wait(500,function(){
                var name="设置部门管理员对话框成功显示";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xdialog').length;
                });
                test.assert(result>0,name);
                casper.click('button[name="save"]');
            })).then(casper.wait(200,function(){
                var name="未选择部门警告框显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        dialog:$('.xdialog').length,
                        xtreeNode:$('.xtree-node').length
                    };
                });
                test.assert(result.dialog>0&&result.xtreeNode>0,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(200,function(){
                casper.evaluate(function(){
                    $('#deptAdminTree').tree('check',{
                        target:$('#deptAdminTree .xtree-a[title=autoTestDept1]').parents('.xtree-node'),
                        trigger:false
                    });
                });
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="设置addTestUser为autoTestDept1部门的管理员成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        dialog:$('.xdialog').length,
                        tip:$('.xtip').html()
                    };
                });
                test.assert(result.dialog==0&&result.tip.indexOf('成功')>-1,name);
            }));
        });

        // 密码重置
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                clickOpt('addTestUser');
            })).then(casper.wait(500,function(){
                var name="菜单项存在密码重置选项";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.menu-item[name="passwd"]').length;
                });
                test.assert(result>0,name);
                casper.click('.menu-item[name=passwd]');
            })).then(casper.wait(500,function(){
                var name="设置密码对话框成功显示";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xdialog').length;
                });
                test.assert(result>0,name);
                casper.click('button[name="save"]');
            })).then(casper.wait(200,function(){
                var name="未输入新密码提示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xvalid-warn').length;
                });
                test.assert(result>0,name);
                casper.evaluate(function(password,repassword){
                    $('input[name=password]').val(password);
                    $('input[name=repassword]').val(repassword);
                },'123qwe','123qweq');
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="两次密码输入不一致,提示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xvalid-warn').length;
                });
                test.assert(result>0,name);
                casper.evaluate(function(password,repassword){
                    $('input[name=password]').val(password);
                    $('input[name=repassword]').val(repassword);
                },'123qwe','123qwe');
                // casper.click('button[name="save"]');
            })).then(casper.wait(1500,function(){
                var name="密码重置成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        dialog:$('.xdialog').length,
                        tip:$('.xtip').html()
                    };
                });
                casper.click('button[name="cancel"]');
                // test.assert(result.dialog==0&&result.tip.indexOf('成功')>-1,name);
            }));
        });

        // 重置保险箱密码
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                clickOpt('addTestUser');
            })).then(casper.wait(500,function(){
                var name="菜单项存在保险箱密码重置选项";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.menu-item[name="resetStrongboxPwd"]').length;
                });
                test.assert(result>0,name);
                casper.click('.menu-item[name=resetStrongboxPwd]');
            })).then(casper.wait(500,function(){
                var name="设置保险箱密码对话框成功显示";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xdialog').length;
                });
                test.assert(result>0,name);
                casper.click('button[name="save"]');
            })).then(casper.wait(200,function(){
                var name="未输入新密码提示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xvalid-warn').length;
                });
                test.assert(result>0,name);
                casper.evaluate(function(password,repassword){
                    $('input[name=password]').val(password);
                    $('input[name=repassword]').val(repassword);
                },'123qwe','123qweq');
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="两次密码输入不一致,提示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xvalid-warn').length;
                });
                test.assert(result>0,name);
                casper.evaluate(function(password,repassword){
                    $('input[name=password]').val(password);
                    $('input[name=repassword]').val(repassword);
                },'123qwe','123qwe');
                casper.click('button[name="save"]');
            })).then(casper.wait(1500,function(){
                var name="密码重置成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        dialog:$('.xdialog').length,
                        tip:$('.xtip').html()
                    };
                });
                test.assert(result.dialog==0&&result.tip.indexOf('成功')>-1,name);
            }));
        });

        // 限制设置
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                clickOpt('addTestUser');
            })).then(casper.wait(500,function(){
                var name="菜单项存在限制设置选项";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.menu-item[name="setLimit"]').length;
                });
                test.assert(result>0,name);
                casper.click('.menu-item[name=setLimit]');
            })).then(casper.wait(500,function(){
                var name="设置限制对话框成功显示";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xdialog').length;
                });
                test.assert(result>0,name);
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="限制设置成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        dialog:$('.xdialog').length,
                        tip:$('.xtip').html()
                    };
                });
                test.assert(result.dialog==0&&result.tip.indexOf('成功')>-1,name);
            }));
        });

        // toolbar
        // 重置
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.click('#toolbar-reset');
            })).then(casper.wait(1500,function(){
            }));
        });
        // 批量设置部门
        // step1:
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                casper.click('.batch-move');
            })).then(casper.wait(200,function(){
                var name="未选择用户设置部门弹出警告框正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
            }));
        });
        // step2:
        // 选中所有待设置的用户
        var i=0;
        casper.repeat(10,function(){
            Q.fcall(casper.wait(0,function(){
                i++;
                var name="选中10个待设置的用户";
                var index=getIndex('TestUser'+i);
                casper.evaluate(function(index,i){
                    $('.xtable-row[index="'+index+'"]').addClass('xtable-active');
                },index);
                if(i==10) capture(name);
            }));
        });
        // step3:
        // 点击设置部门
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.click('.batch-move');
            })).then(casper.wait(500,function(){
                var name="设置部门对话框弹出正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        dialog:$('.xdialog').length,
                        xtreeNode:$('.xtree-node').length
                    };
                });
                test.assert(result.dialog>0&&result.xtreeNode>0,name);
                casper.evaluate(function(){
                    $('#moveTree').tree('select',{
                        target:$('.xtree-a[title=autoTestDept1]').parents('.xtree-node'),
                        trigger:true
                    });
                });
            })).then(casper.wait(0,function(){
                var name="选择autoTestDept1部门显示成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.tags').length;
                });
                var flag=false;
                if(result===1) flag=true;
                test.assert(flag,name);
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="设置部门移动成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        dialog:$('.xdialog').length,
                        tip:$('.xtip').html()
                    };
                });
                test.assert(result.dialog==0&&result.tip.indexOf('成功')>-1,name);
            }));
        });

        // 批量删除
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                casper.click('.batch-delete');
            })).then(casper.wait(200,function(){
                var name="未选择用户删除警告框正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
            }));
        });
        // step1:创建5个待删除的用户 waitDeleteUser1 waitDeleteUser2 waitDeleteUser3...
        var j=0;
        casper.repeat(5,function(){
            Q.fcall(casper.wait(0,function(){
                j++;
                casper.evaluate(function(){
                    $('#deptTree').tree('check',{
                        target:$('.xtree-a[title=autoTestDept1]').parents('.xtree-node'),
                        trigger:false
                    });
                });
                casper.click('.user-create');
            })).then(casper.wait(500,function(){
                casper.evaluate(function(userName,password,order){
                    $('input[name=account]').val(userName);
                    $('input[name=nickName]').val(userName);
                    $('input[name=password]').val(password);
                    $('input[name=order]').val(order);
                },'waitDeletUser'+j,'123qwe',99);
                casper.click('button[name="save"]');
            })).then(casper.wait(1500,function(){

            }));
        });
        // 重置
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.click('#toolbar-reset');
            })).then(casper.wait(1500,function(){
                var name="重置成功";
                capture(name);
            }));
        });
        // step2:选中所有待删除的用户
        var n=0;
        casper.repeat(5,function(){
            Q.fcall(casper.wait(0,function(){
                n++;
                var name="选中5个待设置的用户";
                var index=getIndex('waitDeletUser'+n);
                casper.evaluate(function(index,n){
                    $('.xtable-row[index="'+index+'"]').addClass('xtable-active');
                },index);
                if(n==5) capture(name);
            }));
        });
        //step3:批量删除用户
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                casper.click('.batch-delete');
            })).then(casper.wait(500,function(){
                var name="批量删除确认框显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name); 
                casper.click('.xmsg-ok');
            })).then(casper.wait(500,function(){
                var name="删除正常";
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
    casper.run(function(){
        test.done();
    });
});