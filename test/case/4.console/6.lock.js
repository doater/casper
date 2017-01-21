phantom.injectJs('lib/base.js');
/*   prepare:
    指定上传的文件全部予以锁定
*/
function initLock() {
    casper.test.begin('锁定所有指定上传文件', 1, function(test) {
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
        var url = 'http://' + host + ':' + port + '/web/index.html';
        init('4.console/6.lock.js/prepare');
        // 开始... 
        casper.start(url, function() {
            casper.then(function() {
                Q.fcall(casper.wait(1500, function() {
                    casper.click('.menu-item[name="grouplist"]');
                })).then(casper.wait(1500, function() {
                    doubleClickGroup('TestGroup1');
                })).then(casper.wait(1500, function() {
                    casper.click('.new-btn .btn');
                })).then(casper.wait(200, function() {
                    var config = ['doc', 'png', 'pptx', 'txt', 'xlsx', 'zip', 'lbk'];
                    for (var i = 0; i < config.length; i++) {
                        var outPath = '/tmp/' + config[i] + '_example.' + config[i];
                        casper.page.uploadFile("input[name='file']", out + outPath);
                    }
                })).then(casper.wait(4000, function() {
                    var name="上传完毕";
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
                    casper.click('.menu-item[name="filelock"]');
                })).then(casper.wait(500, function() {
                    casper.click('button[name=save]');
                })).then(casper.wait(1500, function() {
                    var name="文件"+config[i] + '_example.' + config[i]+'锁定成功';
                    capture(name);
                }));
            });
        });
        casper.run(function() {
            test.done();
        });
    });
}
initLock();
casper.test.begin('锁定管理功能测试', 6, function(test) {
    var url = 'http://' + host + ':' + port + '/web/console.html';
    casper.echo('测试地址：' + url, 'INFO');
    init('4.console/6.lock.js');
    // 文件配置参数
    var config = ['doc','png', 'pptx', 'txt', 'xlsx', 'zip', 'lbk'];
    function getIndex(filename) {
        var index = casper.evaluate(function(filename) {
            var data = $('#datalist').table('getData');
            var index;
            for (var i = 0; i < data.length; i++) {
                if (data[i].name == filename) index = i;
            }
            return index;
        }, filename);
        return index;
    }
    // 页面显示正常
    casper.start(url, function() {
        casper.then(function() {
            Q.fcall(casper.wait(1500, function() {
                casper.click('.nav-item[name="lock"]');
            })).then(casper.wait(1500, function() {
                var name = "锁定管理页面正常";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        unlock: $('#batch-unlock').length,
                        select: $('select[name=gid]').length,
                        search: $('#toolbar-search').length,
                        datalist: $('#datalist').length
                    };
                });
                var flag = true;
                var options = casper.evaluate(function() {
                    return $('select[name=gid]').find('option').length;
                });
                for (var i in result) {
                    if (result[i] == 0) flag = false;
                };
                if (options <= 1) flag = false;
                test.assert(flag, name);
            }));
        });

        // 解锁
        casper.then(function() {
            Q.fcall(casper.wait(0, function() {
                // 取配置文件的第一个为单独删除评论的对象
                var item=config.shift();
                var filename=item + '_example.' +item;
                var index = getIndex(filename);
                casper.click('.xtable-row[index="' + index + '"] .unlock-opt');
            })).then(casper.wait(500, function() {
                var name = "解锁文件,确认框显示正常";
                capture(name);
                var result = casper.evaluate(function() {
                    return $('.xmsg').length;
                });
                test.assert(result > 0, name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(500, function() {
                var name = "解锁成功";
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        xmsg: $('.xmsg').length,
                        tip: $('.xtip').html()
                    };
                });
                test.assert(result.xmsg == 0 && result.tip.indexOf('成功') > -1, name);
            }));
        });
        //toolbar
        // 批量解锁
        var max = config.length;
        var j = -1;
        // step1:
        casper.then(function() {
            Q.fcall(casper.wait(1000, function() {
                casper.click('#batch-unlock');
            })).then(casper.wait(500, function() {
                var name = "未选中文件选择批量解锁";
                capture(name);
                var result = casper.evaluate(function() {
                    return $('.xmsg').length;
                });
                test.assert(result > 0, name);
                casper.click('.xmsg-ok');
            }));
        });
        // step2:
        casper.repeat(max, function() {
            Q.fcall(casper.wait(0, function() {
                j++;
                var name = "选中除doc_example.doc外所有指定文件";
                var filename = config[j] + '_example.' + config[j];
                var index = getIndex(filename);
                casper.evaluate(function(index) {
                    $('.xtable-row[index="' + index + '"]').addClass('xtable-active');
                }, index);
                if(j==max-1) capture(name);
            }));
        });
        //step3:
        casper.then(function(){
            Q.fcall(casper.wait(0,function(){
                casper.click('#batch-unlock');
            })).then(casper.wait(500,function(){
                var name="解锁确认框显示正常";
                capture(name);
                var result=casper.evaluate(function(){
                    return {
                        content:$('.xmsg-body').html(),
                        xmsg:$('.xmsg').length
                    };
                });
                test.assert(result.xmsg>0&&result.content.indexOf('选中')>-1,name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(500,function(){
                var name="批量解锁成功";
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