phantom.injectJs('lib/base.js');
//评论指定上传的文件
function initComment() {
    casper.test.begin('评论所有指定上传的文件',1,function(test) {
        // 指定文件配置
        var config = ['doc', 'png', 'pptx', 'txt', 'xlsx', 'zip', 'lbk'];
        // 传入文件名,点击右键菜单
        function rightClickFile(filename) {
            var index = casper.evaluate(function(filename) {
                var data = $('.grouplist').table('getData');
                var index;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name == filename) index = i;
                }
                return index;
            }, filename);
            casper.mouse.rightclick('.xtable-row[index="' + index + '"]');
        }
        //传入群组名,双击
        function doubleClickGroup(groupname) {
            var index = casper.evaluate(function(groupname) {
                var data = $('.grouplist').table('getData');
                var index;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name == groupname) index = i;
                }
                return index;
            }, groupname);
            casper.mouse.doubleclick('.xtable-row[index="' + index + '"]');
        }
        // 初始化文件路径
        init('4.console/7.comment.js/prepare');
        // 指定路径
        var url = 'http://' + host + ':' + port + '/web/index.html';
        casper.start(url, function() {
            casper.then(function() {
                Q.fcall(casper.wait(1500, function() {
                    casper.click('.menu-item[name="grouplist"]');
                })).then(casper.wait(1500, function() {
                    doubleClickGroup('TestGroup1');
                })).then(casper.wait(1500, function() {
                    casper.click('.new-btn .btn');
                })).then(casper.wait(200, function() {
                    for (var i = 0; i < config.length; i++) {
                        var outPath = '/tmp/' + config[i] + '_example.' + config[i];
                        casper.page.uploadFile("input[name='file']", out + outPath);
                    }
                })).then(casper.wait(4000, function() {
                    var name = "上传完毕";
                    capture(name);
                    test.assert(true, name);
                }));
            });
            var i = -1;
            var max = config.length;
            casper.repeat(max, function() {
                Q.fcall(casper.wait(0, function() {
                    i++;
                    var filename = config[i] + '_example.' + config[i];
                    rightClickFile(filename);
                })).then(casper.wait(500, function() {
                    casper.click('.menu-item[name="comment"]');
                })).then(casper.wait(500, function() {
                    var content=config[i] + '_example.' + config[i];
                    casper.evaluate(function(content){
                        $('textarea.comment-text').val(content);
                    },content);
                    casper.click('button.comment-submit');
                })).then(casper.wait(500, function() {
                    var name="评论"+i+"成功";
                    capture(name);
                }));
            });
        });
        casper.run(function() {
            test.done();
        });
    });
}
initComment();
casper.test.begin('评论列表功能测试', 6, function(test) {
    var url = 'http://' + host + ':' + port + '/web/console.html';
    casper.echo('测试地址：' + url, 'INFO');
    init('4.console/7.comment.js');
    // 文件配置参数
    var config = ['doc', 'png', 'pptx', 'txt', 'xlsx', 'zip', 'lbk'];
    // 接受comment内容参数,获得index
    function getIndex(comment) {
        var index = casper.evaluate(function(comment) {
            var data = $('#datalist').table('getData');
            var index;
            for (var i = 0; i < data.length; i++) {
                if (data[i].comment == comment) index = i;
            }
            return index;
        }, comment);
        return index;
    }
    casper.start(url, function() {
        casper.then(function() {
            Q.fcall(casper.wait(1500, function() {
                casper.click('.nav-item[name="comment"]');
            })).then(casper.wait(1500, function() {
                var name = "评论管理列表显示正常";
                capture(name);
                var flag = true;
                var toolbar = casper.evaluate(function() {
                    return {
                        batchDelete: $('#batch-delete'),
                        keyword: $('input[name="keyword"]'),
                        search: $('#toolbar-search'),
                        reset: $('#toolbar-reset')
                    };
                });
                var tablelist = casper.evaluate(function() {
                    return $('#datalist').length;
                });
                for (var i in toolbar) {
                    if (toolbar[i] == 0) flag = false;
                };
                if (tablelist == 0) flag = false;
                test.assert(flag, name);
            }));
        });
        
        // 删除评论,以配置文件第一个为测试对象
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                // 取配置文件的第一个为单独删除评论的对象
                var item=config.shift();
                var comment=item + '_example.' +item;
                var index=getIndex(comment);
                casper.click('.xtable-row[index="'+index+'"] .delete-opt');
            })).then(casper.wait(200,function(){
                var name="删除评论确认框正确显示";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(1500,function(){
                var name="成功删除评论";
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
        // 批量删除
        // setp1:
        casper.then(function(){
            Q.fcall(casper.wait(1000,function(){
                casper.click('#batch-delete');
            })).then(casper.wait(500,function(){
                var name="未选中评论批量删除,警告框正确显示";
                capture(name);
                var result=casper.evaluate(function(){
                    return $('.xmsg').length;
                });
                test.assert(result>0,name);
                casper.click('.xmsg-ok');
            }));
        });
        //step2:选中所有待删除的评论
        var i=-1;
        var max=config.length;
        casper.repeat(max,function(){
            Q.fcall(casper.wait(0,function(){
                i++;
                var comment=config[i]+'_example.'+config[i];
                var index=getIndex(comment);
                casper.evaluate(function(index){
                    $('.xtable-row[index="'+index+'"]').addClass('xtable-active');
                },index);
                var name="选中所有待删除的评论";
                if(i==max-1) capture(name);
            }));
        });
        // step3:点击批量删除
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.click('#batch-delete');
            })).then(casper.wait(500,function(){
                var name="批量删除确认框弹出";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        xmsg:$('.xmsg').length,
                        content:$('.xmsg-body').html()
                    };
                });
                test.assert(result.xmsg>0&&result.content.indexOf('确定')>-1,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(1500,function(){
                var name="评论批量删除成功";
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
    casper.run(function() {
        test.done();
    });
});