phantom.injectJs('lib/base.js');
// 初始化文件路径
init('4.console/11.role.js');
// 指定路径
var url = 'http://' + host + ':' + port + '/web/console.html';
casper.test.begin('角色管理功能测试',15,function(test){
    function clickOpt(roleName) {
        var index = casper.evaluate(function(roleName) {
            var data = $('#datalist').table('getData');
            var index;
            for (var i = 0; i < data.length; i++) {
                if (data[i].name == roleName) index = i;
            }
            return index;
        }, roleName);
        casper.click('.xtable-row[index="' + index + '"] .role-opt');
    }
    casper.start(url,function(){
        casper.then(function(){
            Q.fcall(casper.wait(1500,function(){
                casper.click('.nav-item[name="role"]');
            })).then(casper.wait(1500,function(){
                var name="角色管理页面加载正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        btn:$('.role-create').length,
                        tablelist:$('#datalist').length
                    };
                });
                test.assert(result.btn>0&&result.tablelist>0,name);
            }));
        });
        // toolbar
        // 创建一个testRole角色
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.click('.role-create');
            })).then(casper.wait(500,function(){
                var name="添加角色对话框显示成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xdialog').length;
                });
                test.assert(result>0,name);
                casper.click('button[name="save"]');
            })).then(casper.wait(100,function(){
                var name="未添加角色验证信息显示成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xvalid-warn').length;
                });
                test.assert(result>0,name);
                /*创建一个测试角色*/
                casper.evaluate(function(roleName){
                    $('input[name="name"]').val(roleName);
                },'testRole');
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="创建testRole测试角色成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        dialog:$('.xdialog').length,
                        tip:$(".xtip").html()
                    };
                });
                test.assert(result.dialog==0&&result.tip.indexOf('成功')>-1,name);
            }));
        });
        // 操作选项测试
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                clickOpt('testRole');
            })).then(casper.wait(500,function(){
                var name="操作选项菜单成功";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        items: $('#xmenu .menu-item').length,
                        menu: $('#xmenu').length
                    }
                });
                test.assert(result.items > 0 && result.menu > 0, name);
            }));
        });
        // 权限设置
        // 20个随机权限的下标
        var randomIndexs;
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.click('.menu-item[name="list"]');
            })).then(casper.wait(500,function(){
                var name="权限设置对话框显示成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        dialog:$('.xdialog').length,
                        menu:$('#xmenu').length,
                        xtreeNode:$('.xtree-node').length
                    };
                });
                test.assert(result.dialog>0&&result.menu==0&&result.xtreeNode>0,name);
                casper.click('button[name="save"]');
            })).then(casper.wait(200,function(){
                var name="未选择权限保存,警告框弹出成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
                randomIndexs=casper.evaluate(function(){
                    shuffle = function(max){
                        var o=[];
                        for(var k=0;k<max;k++){
                            o.push(k);
                        }
                        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
                        return o.slice(0,20);
                    };
                    var max=$('.xtree-node').length;
                    return shuffle(max);
                });
            }));
            // 随机选择20个权限
            casper.then(function(){
                var i=-1;
                casper.repeat(20,function(){
                    i++;
                    Q.fcall(casper.wait(0,function(){
                        casper.evaluate(function(randomIndexs,i){
                            $('#rightsTree').tree('check',{
                                target:$('.xtree-node').eq(randomIndexs[i]),
                                trigger:false
                            });
                        },randomIndexs,i);
                    }));
                });
            });
            // 保存
            casper.then(function(){
                Q.fcall(casper.wait(0,function(){
                    casper.click('button[name="save"]');
                })).then(casper.wait(500,function(){
                    var name="权限编辑成功";
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
        });
        // 成员管理
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                clickOpt('testRole');
            })).then(casper.wait(500,function(){
                casper.click('.menu-item[name="users"]');
            })).then(casper.wait(500,function(){
                var name="成员管理对话框显示成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xdialog').length;
                });
                test.assert(result>0,name);
                casper.click('button[name="add"]');
            })).then(casper.wait(500,function(){
                var name="添加成员对话框加载成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        dialog:$('#add-dialog').length,
                        xtreeNode:$('.xtree-node').length
                    };
                });
                test.assert(result.dialog>0&&result.xtreeNode>0,name);
                casper.click('button[name="save"]');
            })).then(casper.wait(200,function(){
                var name="未选择成员警告框弹出成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
                casper.evaluate(function(){
                    $('#userTree').tree('expand',{
                        target:$('.xtree-a[title="autoTestDept1"]').parents('.xtree-node').eq(0)
                    });
                    
                });
            })).then(casper.wait(500,function(){
                casper.evaluate(function(){
                    $('#userTree').tree('check',{
                        target:$('.xtree-a[title="TestUser1"]').parents('.xtree-node').eq(0),
                        trigger:false
                    });
                });
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="TestUser1成员添加成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        tip:$('.xtip').html(),
                        dialog:$('.xdialog').length
                    };
                });
                test.assert(result.tip.indexOf('成功')>-1&&result.dialog==0,name);
            })).then(casper.wait(1000,function(){
                clickOpt('testRole');
            })).then(casper.wait(500,function(){
                casper.click('.menu-item[name="users"]');
            })).then(casper.wait(500,function(){
                casper.click('.user-remove:first-child');
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="删除成员TestUser1成功";
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
        //删除角色
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                clickOpt('testRole');
            })).then(casper.wait(500,function(){
                casper.click('.menu-item[name="delete"]');
            })).then(casper.wait(500,function(){
                var name="删除角色确认框显示成功";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(500,function(){
                var name="testRole角色删除成功";
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
    });
    casper.run(function(){
        test.done();
    });
});