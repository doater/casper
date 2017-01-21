// 1.  可以正常添加部门管理员
// 2.  编辑部门管理员功能正常
// 3.  可以正常删除部门管理员
// 4.  部门管理员可以在系统管理中进行部门列表管理，用户列表管理，群组管理
// 5.  部门管理员，部门管理只能在管理部门下新增，删除，移动部门
// 6.  部门管理员，对用户管理的操作权限和admin相同
phantom.injectJs('lib/base.js');
init('4.console/2.deptadmin.js');
var url = 'http://' + host + ':' + port + '/web/console.html';
casper.echo('测试地址：' + url, 'INFO');

casper.test.begin('部门管理员功能测试',12,function(test){
    // userName 用户名称
    // clickOpt 通过用户名称点击opt菜单
    function clickOpt(userName) {
        var index = casper.evaluate(function(userName) {
            var data = $('#datalist').table('getData');
            var index;
            for (var i = 0; i < data.length; i++) {
                if (data[i].user.nickName == userName) index = i;
            }
            return index;
        }, userName);
        casper.click('.xtable-row[index="' + index + '"] .deptadmin-opt');
    }
    casper.start(url,function(){
        Q.fcall(casper.wait(1500,function(){
            casper.click('.nav-item[name="dept"]');
            casper.click('.nav-item[name="deptadmin"]');
        })).then(casper.wait(1500,function(){
            var name="部门管理员列表显示正常";
            capture(name);
            var flag=false;
            // 添加部门管理员按钮
            var toolbar=casper.evaluate(function(){
                return $('.admin-create').length;
            });
            // 部门管理员列表渲染成功
            var tablelist=casper.evaluate(function(){
                return $('#datalist').length;
            });
            if(toolbar>0&&tablelist>0) flag=true;
            test.assert(flag,name);
        }));
        // 添加部门管理员
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.click('.admin-create');
            })).then(casper.wait(500,function(){
                var name="添加部门管理员对话框成功显示";
                capture(name);
                var dialog=casper.evaluate(function(){
                    return $('#add-dialog').length;
                });
                test.assert(dialog>0,name);
                casper.click('button[name="next"]');
            })).then(casper.wait(200,function(){
                var name="不选择用户弹出警告框正常";
                capture(name);
                var alert=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(alert>0,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(0,function(){
                var name="选中autoTestDept1部门";
                casper.evaluate(function(){
                    $('#deptUserTree').tree('select',{
                        target:$('.xtree-a[title=autoTestDept1]').parents('.xtree-node'),
                        trigger:false
                    });
                });
                capture(name);
                casper.click('button[name="next"]');
            })).then(casper.wait(200,function(){
                var name="未选用户弹出警告框正常";
                capture(name);
                var alert=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(alert>0,name);
                casper.click('.xmsg-ok');
                casper.evaluate(function(){
                    $('#deptUserTree').tree('expand',{
                        target:$('.xtree-a[title=autoTestDept1]').parents('.xtree-node')
                    });
                });
            })).then(casper.wait(200,function(){
                casper.evaluate(function(){
                    $('#deptUserTree').tree('select',{
                        target:$('.xtree-a[title=TestUser1]').parents('.xtree-node').eq(0),
                        trigger:false
                    });
                });
            })).then(casper.wait(0,function(){
                var name="成功选中TestUser1";
                capture(name);
                casper.click('button[name=next]');
            })).then(casper.wait(500,function(){
                var name="选择要管理的对话框成功弹出";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        addDialog:$('#add-dialog').length,
                        editDialog:$('#edit-dialog').length
                    };
                });
                test.assert(result.addDialog==0&&result.editDialog>0,name);
                casper.click('button[name="save"]');
            })).then(casper.wait(200,function(){
                var name="未选择用户弹出警告框正常";
                capture(name);
                var alert=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(alert>0,name);
                casper.click('.xmsg-ok');
                casper.evaluate(function(){
                    $('#deptUserTree').tree('check',{
                        target:$('.xtree-a[title=autoTestDept1]').parents('.xtree-node'),
                        trigger:false
                    });
                });
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="选择管理autoTestDept1部门成功";
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
        // 编辑部门管理员
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                clickOpt('TestUser1');
            })).then(casper.wait(500,function(){
                var name = "点击操作按钮,菜单显示正常";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        items: $('#xmenu .menu-item').length,
                        menu: $('#xmenu').length
                    }
                });
                test.assert(result.items > 0 && result.menu > 0, name);
                casper.click('.menu-item[name="edit"]');
            })).then(casper.wait(500,function(){
                var name="编辑对话框成功显示";
                capture(name);
                var dialog=casper.evaluate(function(){
                    return $('.xdialog').length;
                });
                test.assert(dialog>0,name);
                casper.evaluate(function(){
                    $('#deptUserTree').tree('check',{
                        target:$('.xtree-a[title=autoTestDept2]').parents('.xtree-node'),
                        trigger:false
                    });
                });
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="同时选择了autoTestDept1和autoTestDept2保存成功";
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
        // 删除部门管理员
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                clickOpt('TestUser1');
            })).then(casper.wait(500,function(){
                casper.click('.menu-item[name="delete"]');
            })).then(casper.wait(500,function(){
                var name="删除确认框弹出正常";
                capture(name);
                var alert=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(alert>0,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(500,function(){
                var name="部门管理员删除成功";
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