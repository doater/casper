phantom.injectJs('lib/base.js');
// 初始化文件路径
init('4.console/12.group.js');
// 指定路径
var url = 'http://' + host + ':' + port + '/web/console.html';
casper.test.begin('群组管理功能测试',14,function(test){
    casper.start(url,function(){
        casper.then(function(){
            Q.fcall(casper.wait(1500,function(){
                casper.click('.nav-item[name="group"]');
            })).then(casper.wait(1500,function(){
                var name="群组管理页面加载成功";
                capture(name);
                var west=casper.evaluate(function(){
                    return {
                        groupTreeInput:$('.group-tree-input').length,
                        grouptTreeSe:$('.groupTreeSe').length,
                        groupAdd:$('.group-add').length,
                        groupEdit:$('.group-edit').length,
                        groupDelete:$('.group-delete').length,
                        groupSort:$('.group-sort').length,
                        groupTreeNode:$('#groupTree .xtree-node').length
                    };
                });
                var center=casper.evaluate(function(){
                    return {
                        save:$('.acl-save').length,
                        add:$('.member-add').length,
                        tablelist:$('#datalist').length
                    };
                });
                var flag=true;
                for(var i in west){
                    if(west[i]==0) flag=false;
                }
                for(var i in center){
                    if(center[i]==0) flag=false;
                }
                test.assert(flag,name);
            }));
        });
        // west
        /*新建群组*/
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.click('.group-add');
            })).then(casper.wait(500,function(){
                var name="添加新群组对话框显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xdialog').length;
                });
                test.assert(result>0,name);
                casper.click('button[name="save"]');
            })).then(casper.wait(200,function(){
                var name="未填写群组名,验证信息显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xvalid-warn').length;
                });
                test.assert(result>0,name);
                casper.evaluate(function(groupName,quota){
                    $('input[name="name"]').val(groupName);
                    $('input[name="quota"]').val(quota)
                },'waitEditGroup',0);
                casper.click('button[name="save"]');
            })).then(casper.wait(200,function(){
                var name="填写非法空间值,警告框显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
                casper.evaluate(function(groupName,quota){
                    $('input[name="name"]').val(groupName);
                    $('input[name="quota"]').val(quota)
                },'waitEditGroup',5);
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="新建群组waitDeleteGroup成功";
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
        /*编辑群组*/
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                casper.evaluate(function(){
                    $('#groupTree').tree('select',{
                        target:$('.xtree-a[title="waitEditGroup"]').parents('.xtree-node').eq(0),
                        trigger:false
                    });
                });
                casper.click('.group-edit');
            })).then(casper.wait(500,function(){
                var name="编辑群组对话框显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xdialog').length;
                });
                test.assert(result>0,name);
                casper.evaluate(function(groupName){
                    $('input[name="name"]').val(groupName);
                },'waitDeleteGroup');
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="群组编辑成功";
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
        /*删除群组*/
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                casper.evaluate(function(){
                    $('#groupTree').tree('select',{
                        target:$('.xtree-a[title="waitDeleteGroup"]').parents('.xtree-node').eq(0),
                        trigger:false
                    });
                });
                casper.click('.group-delete');
            })).then(casper.wait(500,function(){
                 var name="删除确认框弹出正常";
                 capture(name);
                 var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                 });
                 test.assert(result>0,name);
                 casper.click('.xmsg-ok');
            })).then(casper.wait(500,function(){
                var name="删除waitDeleteGroup群组成功";
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
        /*搜索群组*/
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                casper.evaluate(function(keyword){
                    $('.group-tree-input').val(keyword);
                },'TestGroup');
                casper.click('.groupTreeSe');
            })).then(casper.wait(500,function(){
                var name="群组搜索功能正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xtree-node').length;
                });
                test.assert(result>0,name);
            }));
        });
        // center
        /*添加成员,删除成员*/
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.evaluate(function(){
                    $('#groupTree').tree('select',{
                        target:$('.xtree-a[title="TestGroup1"]').parents('.xtree-node').eq(0),
                        trigger:true
                    });
                });
            })).then(casper.wait(500,function(){
                var name="群组成员列表显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xtable-list .xtable-row').length;
                });
                test.assert(result>0,name);
                casper.click('.member-add');
            })).then(casper.wait(500,function(){
                var name="群组添加成员对话框显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        dialog:$('.xdialog').length,
                        xtreeNode:$('.xtree-node').length
                    };
                });
                test.assert(result.dialog>0&&result.xtreeNode>0,name);
                casper.evaluate(function(){
                    $('#deptUserTree').tree('check',{
                        target:$('.xtree-a[title="autoTestDept2"]').parents('.xtree-node').eq(0),
                        trigger:true
                    });
                });
                casper.click('button[name="cancel"]');
            })).then(casper.wait(500,function(){
                casper.click('.acl-save');
            })).then(casper.wait(500,function(){
                var name="将autoTestDept2保存到群组TestGroup1成功";
                capture(name);
                var result=casper.evaluate(function(){
                    var data=$('#datalist').table('getData');
                    var flag=false;
                    for(var i=0;i<data.length;i++){
                        if(data[i]!=undefined&&data[i].name=="autoTestDept2") flag=true;
                    }
                    return {
                        tip:$('.xtip').html(),
                        flag:flag
                    };
                });
                test.assert(result.tip.indexOf('成功')>-1&&result.flag,name);
            })).then(casper.wait(2000,function(){
                var index=casper.evaluate(function(){
                    var data=$('#datalist').table('getData');
                    var index;
                    for(var i=0;i<data.length;i++){
                        if(data[i].name=='autoTestDept2') index=i; 
                    }
                    return index;
                });
                casper.click('.xtable-row[index="'+index+'"] .member-remove');
            })).then(casper.wait(500,function(){
                casper.click('.acl-save');
            })).then(casper.wait(500,function(){
                var name="将autoTestDept2从群组TestGroup1中删除成功";
                capture(name);
                var result=casper.evaluate(function(){
                    var data=$('#datalist').table('getData');
                    var flag=false;
                    for(var i=0;i<data.length;i++){
                        if(data[i]!=undefined&&data[i].name=="autoTestDept2") flag=true;
                    }
                    return {
                        tip:$('.xtip').html(),
                        flag:flag
                    };
                });
                test.assert(result.tip.indexOf('成功')>-1&&!result.flag,name);
            }));
        });
    });
    casper.run(function(){
        test.done();
    });
});