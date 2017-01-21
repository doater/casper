phantom.injectJs('lib/base.js');

init('4.console/13.overview.js');

var url = 'http://' + host + ':' + port + '/web/console.html';
casper.echo('测试地址：' + url, 'INFO');
casper.test.begin('使用概况页面加载测试',1,function(test){
    casper.start(url,function(){
        Q.fcall(casper.wait(1500,function(){
            casper.click('.nav-item[name="overview"]');
        })).then(casper.wait(1500,function(){
            var name="使用概况页面加载正常";
            capture(name);
            var flag=true;
            var result=casper.evaluate(function(){
                return {
                    analyzeType:$('#analyzeType').length,
                    analyzeUsed:$('#analyzeUsed').length,
                    analyzeDevice:$('#analyzeDevice').length
                };
            });
            for(var i in result){
                if(result[i]==0) flag=false;
            }
            test.assert(flag,name);
        }));
    });
    casper.run(function(){
        test.done();
    });
});