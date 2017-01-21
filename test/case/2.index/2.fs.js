/*
# 个人文件测试

 */
phantom.injectJs('lib/base.js');

init('2.index/2.fs.js');

var url = 'http://' + host + ':' + port + '/web/index.html';
casper.echo('测试地址：' + url, 'INFO');

casper.test.begin('文件操作功能测试', 12, function(test) {
    casper.start(url, function() {
        var time = moment().format('mmss');
        casper.then(function() {
            Q.fcall(casper.wait(1500, function() {
                var name = '测试页面几个主要区域是否加载成功';
                capture(name);
                // 路径信息加载成功
                var crumbPath = casper.evaluate(function() {
                    return document.querySelectorAll('.path-item');
                });
                // 个人信息加载成功
                var username = casper.evaluate(function() {
                    return document.querySelector('.nav-username').innerHTML;
                });
                // 空间信息加载成功
                var space = casper.evaluate(function() {
                    return document.querySelector('.space-content').innerHTML;
                });
                // 文件列表渲染成功
                var tableList = casper.evaluate(function() {
                    return document.querySelectorAll('.xtable-list');
                });
                var flag = false;
                if (crumbPath.length == 1 && username && space && tableList.length > 0) {
                    flag = true;
                }
                test.assert(flag, name);
            })).then(casper.wait(0, function() {
                var name = '点击新建按钮能否正常弹出菜单';
                casper.click('.new-btn .btn');
                capture(name);
                var pos = casper.evaluate(function() {
                    return {
                        left: parseInt(document.querySelector('#new-menu').style.left),
                        top: parseInt(document.querySelector('#new-menu').style.top)
                    }
                });
                test.assert(pos.left > 10 && pos.top > 100, name);
            })).then(casper.wait(200, function() {
                casper.page.uploadFile("input[name='file']", out + '/tmp/doc_example.doc');
            })).then(casper.wait(500, function() {
                var name = '文件上传列表是否展开';
                capture(name);
                test.assertVisible('#upload-box', name);
            })).then(casper.wait(3000, function() {
                var name = '上传完成之后列表是否收起';
                capture(name);
                var pos = casper.evaluate(function() {
                    return {
                        bottom: parseInt(document.querySelector('#upload-box').style.bottom),
                        display: $('#upload-box').is(':visible')
                    }
                });
                test.assert(pos.display === true && pos.bottom > -380 && pos.bottom < -300, name);
            })).then(casper.wait(0, function() {
                var name = '收起的上传列表能否正常关闭';
                casper.click('.upload-close');
                var pos = casper.evaluate(function() {
                    return {
                        bottom: parseInt(document.querySelector('#upload-box').style.bottom),
                        stat: $('#upload-box').attr('stat')
                    }
                });
                capture(name);
                test.assert(pos.bottom < -390 && pos.stat == 'closed', name);
            }))
        });
        // 新建文件夹
        casper.then(function() {
            Q.fcall(casper.wait(0, function() {
                casper.click('.new-btn .btn');
                casper.click('.menu-item[name="addfolder"]');
            })).then(casper.wait(200, function() {
                var name = '新建文件夹对话框是否显示';
                capture(name);
                test.assertVisible('#file-name', name);
                casper.evaluate(function() {
                    $('#file-name').val('新建文件夹*');
                });
                casper.click('button[name="save"]');
            })).then(casper.wait(1000, function() {
                var name = '新建文件夹包含特殊符号提示正常'
                capture(name);
                test.assertExists('#xmsg', name);
                casper.click('.xmsg-ok');
                casper.evaluate(function(time) {
                    $('#file-name').val('新建文件夹_' + time);
                }, time);
                casper.click('button[name="save"]');
            })).then(casper.wait(1500, function() {
                var name = '名字合法文件夹可以正常被创建';
                capture(name);
                var result = casper.evaluate(function(time) {
                    var el = $('.filename[title="新建文件夹_' + time + '"]');
                    return el.length === 1;
                }, time);
                test.assert(result, name);
                casper.click('span[title="新建文件夹_' + time + '"]');
            })).then(casper.wait(1500, function() {
                var name = '文件夹可以正常进入';
                capture(name);
                var result = casper.evaluate(function() {
                    return $('.crumb-path span').length;
                });
                test.assert(result === 2, name);
                casper.back();
            })).then(casper.wait(1500, function() {
                casper.mouse.rightclick('.xtable-row:first-child');
            })).then(casper.wait(500, function() {
                var name = '文件操作右键菜单正常显示';
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        items: $('#xmenu .menu-item').length,
                        menu: $('#xmenu').length
                    }
                });
                test.assert(result.items > 0 && result.menu > 0, name);
                casper.click('#xmenu .menu-item[name="rename"]');
            })).then(casper.wait(500, function() {
                var name = '重命名文本框显示正常';
                capture(name);
                test.assertExists('.rename-wrap', name);
                var filename = casper.evaluate(function() {
                    var filename = $('.input-filename').val();
                    $('.input-filename').val(filename + '_重命名');
                    return filename + '_重命名';
                });
                casper.sendKeys('.input-filename', casper.page.event.key.Enter, {
                    keepFocus: true
                });
                casper.wait(2000, function() {
                    var name = '重命名成功';
                    capture(name);
                    var result = casper.evaluate(function(filename) {
                        var el = $('.filename[title="' + filename + '"]');
                        return el.length === 1;
                    }, filename);
                    test.assert(result, name);
                })
            }))
        })
    });

    casper.run(function() {
        test.done();
    });
});
