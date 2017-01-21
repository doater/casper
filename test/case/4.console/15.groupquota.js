phantom.injectJs('lib/base.js');

init('4.console/15.groupquota.js');

var url = 'http://' + host + ':' + port + '/web/console.html';
casper.echo('测试地址：' + url, 'INFO');
casper.test.begin('群组空间预警功能测试', 7, function(test) {
    casper.start(url, function() {
        casper.then(function() {
            Q.fcall(casper.wait(1500, function() {
                casper.click('.nav-item[name="quota"]');
                casper.click('.nav-item[name="groupquota"]');
            })).then(casper.wait(1500, function() {
                var name = "群组空间预警页面显示正常";
                capture(name);
                var flag = true;
                var toolbar = casper.evaluate(function() {
                    return {
                        keyword: $('input[name="keyword"]').length,
                        search: $('#toolbar-search').length,
                        reset: $('#toolbar-reset').length,
                        export: $('#toolbar-export')
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
        /*搜索功能*/
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                // 搜索TestGroup
                casper.evaluate(function(keyword){
                    $('input[name="keyword"]').val(keyword);
                },'TestGroup');
                casper.click('#toolbar-search');
            })).then(casper.wait(1500,function(){
                var name="搜索TestGroup,结果显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xtable-list .xtable-row').length;
                });
                test.assert(result>0,name);
            }));
        });
        /*编辑功能*/
        casper.then(function() {
            Q.fcall(casper.wait(0, function() {
                var index = casper.evaluate(function() {
                    var data = $('#datalist').table('getData');
                    var index;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].name == "TestGroup1") index = i;
                    }
                    return index;
                });
                casper.click('.xtable-row[index="'+index+'"] .groupquota-opt');
            })).then(casper.wait(500,function(){
                var name="编辑TestGroup1对话框显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xdialog').length;
                });
                test.assert(result>0,name);
                casper.evaluate(function(groupName,quota){
                    $('input[name="name"]').val(groupName);
                    $('input[name="quota"]').val(quota);
                },'',5);
                casper.click('button[name="save"]');
            })).then(casper.wait(200,function(){
                var name="输入非法群组名,验证信息显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xvalid-warn').length;
                });
                test.assert(result>0,name);
                casper.evaluate(function(groupName,quota){
                    $('input[name="name"]').val(groupName);
                    $('input[name="quota"]').val(quota);
                },'TestGroup1','');
                casper.click('button[name="save"]');
            })).then(casper.wait(200,function(){
                var name="输入非法空间值,验证信息显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xvalid-warn').length;
                });
                test.assert(result>0,name);
                casper.evaluate(function(groupName,quota){
                    $('input[name="name"]').val(groupName);
                    $('input[name="quota"]').val(quota);
                },'TestGroup1','6');
                casper.click('button[name="save"]');
            })).then(casper.wait(500,function(){
                var name="编辑TestGroup1成功";
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
        /*重置功能*/
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                casper.click('#toolbar-reset');
            })).then(casper.wait(1500,function(){
                var name="重置功能正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('input[name="keyword"]').val();
                });
                test.assert(result=='',name);
            }));
        });
    });
    casper.run(function() {
        test.done();
    });
});