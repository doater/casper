phantom.injectJs('lib/base.js');
init('4.console/5.audit.js');
var url = 'http://' + host + ':' + port + '/web/console.html';
casper.echo('测试地址：' + url, 'INFO');

casper.test.begin('审计列表功能测试', 2, function(test) {
    casper.start(url, function() {
        casper.then(function(){
            Q.fcall(casper.wait(1500, function() {
                casper.click('.nav-item[name="audit"]');
            })).then(casper.wait(2000, function() {
                var name = "审计列表显示正常";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        keyword: $('input[name=keyword]').length,
                        account: $('input[name=account]').length,
                        beginTime: $('input[name=beginTime]').length,
                        endTime: $('input[name=endTime]').length,
                        ip: $('input[name=ip]').length,
                        type: $('select[name=type]').length,
                        gid: $('select[name=gid]').length,
                        device: $('select[name=device]').length,
                        search: $('#toolbar-search').length,
                        reset: $('#toolbar-reset').length,
                        export: $('#toolbar-export').length
                    };
                });
                var tablelist = casper.evaluate(function() {
                    return {
                        table: $('#datalist').length,
                        rows: $('.xtable-row').length
                    };
                });
                var flag = true;
                for (var i in result) {
                    if (result[i] == 0) flag = false;
                }
                if (tablelist.table == 0 || tablelist.rows == 0) flag = false;
                test.assert(flag, name);
            })).then(casper.wait(0, function() {
                var name = "三个下拉框选项正常";
                capture(name);
                var result = casper.evaluate(function() {
                   return {
                        type:$('select[name=type]').find('option').length,
                        gid:$('select[name=gid]').find('option').length,
                        device:$('select[name=device]').find('option').length,
                   };
                });
                var flag=true;
                for(var i in result){
                    if(result[i]<=1) flag=false;
                }
                test.assert(flag,name);
            }));
        });
    });
    casper.run(function() {
        test.done();
    });
});