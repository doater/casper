/*

# 登录页面功能测试

1. 页面成功跳转到群组文件
2. 群组页面几个区域是否加载成功
3. 群组文件一级目录右键不显示菜单
4. 群组文件可以正常进入
5. 点击新建按钮能否正常弹出菜单
6. 文件上传列表是否展开
7. 上传完成之后列表是否收起
8. 收起的上传列表能否正常关闭
9. 新建文件夹对话框是否显示
10. 新建文件夹包含特殊符号提示正常
11. 名字合法文件夹可以正常被创建
12. 文件夹可以正常进入
13. 文件操作右键菜单正常显示
14. 重命名文本框显示正常
15. 重命名成功
16. 文件操作右键菜单正常显示
17. 文件删除的框正常弹出
18. 文件删除成功
19. 文件操作右键菜单正常显示
20. 文件右键菜单下载正常
21. 文件操作右键菜单正常显示
22. 文件锁定框弹出正常
23. 文件锁定成功
24. 文件操作右键菜单正常显示
25. 文件解锁框弹出正常
26. 文件解锁成功
27. 文件操作右键菜单正常显示
28. 文件收藏成功
29. 文件操作右键菜单正常显示
30. 文件取消收藏框弹出正常
31. 文件取消收藏成功
32. 文件操作右键菜单正常显示
33. 发送分享弹出框正常
34. 没有选择用户弹出提示正常
35. 文件操作右键菜单正常显示
36. 添加标签对话框弹出正常
37. 未填写标签名弹出提示正常
38. 添加标签成功
39. 文件操作右键菜单正常显示
40. 点击评论能否正常弹出右边栏
41. 不填写评论内容是否弹出提示框
42. 成功填写评论
43. 文件操作右键菜单正常显示
44. 订阅弹出框显示正常
45. 订阅成功
46. 文件操作右键菜单正常显示
47. 链接分享对话框弹出成功
48. 修改限制部分弹出成功
49. 删除分享链接成功
50. 文件操作右键菜单正常显示
51. 属性框正确弹出
 */
phantom.injectJs('lib/base.js');

init('2.index/3.group.js');

var url = 'http://' + host + ':' + port + '/web/index.html';
casper.echo('测试地址：' + url, 'INFO');
// 开始测试
casper.test.begin('群组操作功能测试', 51, function(test) {
    casper.start(url, function() {
        var time = moment().format('mmss');
        casper.then(function() {
                Q.fcall(casper.wait(1500, function() {
                    casper.click('.menu-item[name="grouplist"]');
                })).then(casper.wait(50, function() {
                    var name = "1.页面成功跳转到群组文件";
                    capture(name);
                    test.assertUrlMatch(/group/, name);
                })).then(casper.wait(500, function() {
                    var name = "2.群组页面几个区域是否加载成功";
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
                    var name = '3.群组文件一级目录右键不显示菜单';
                    casper.mouse.rightclick('.xtable-row:first-child');
                    capture(name);
                    var result = casper.evaluate(function() {
                        return $('#xmenu').length;
                    });
                    test.assert(result == 0, name);
                    casper.mouse.doubleclick('.xtable-row:first-child');
                })).then(casper.wait(1500, function() {
                    var name = "4.群组文件可以正常进入";
                    capture(name);
                    var result = casper.evaluate(function() {
                        return $('.crumb-path span').length;
                    });
                    test.assert(result === 2, name);
                })).then(casper.wait(0, function() {
                    var name = '5.点击新建按钮能否正常弹出菜单';
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
                    var name = "6.文件上传列表是否展开";
                    capture(name);
                    test.assertVisible("#upload-box", name);
                })).then(casper.wait(3000, function() {
                    var name = '7.上传完成之后列表是否收起';
                    capture(name);
                    var pos = casper.evaluate(function() {
                        return {
                            bottom: parseInt(document.querySelector('#upload-box').style.bottom),
                            display: $('#upload-box').is(':visible')
                        }
                    });
                    test.assert(pos.display === true && pos.bottom > -380 && pos.bottom < -300, name);
                })).then(casper.wait(0, function() {
                    var name = '8.收起的上传列表能否正常关闭';
                    casper.click('.upload-close');
                    var pos = casper.evaluate(function() {
                        return {
                            bottom: parseInt(document.querySelector('#upload-box').style.bottom),
                            stat: $('#upload-box').attr('stat')
                        }
                    });
                    capture(name);
                    test.assert(pos.bottom < -390 && pos.stat == 'closed', name);
                }));
            })
            // 新建文件夹
        casper.then(function() {
                Q.fcall(casper.wait(0, function() {
                    casper.click('.new-btn .btn');
                    casper.click('.menu-item[name="addfolder"]');
                })).then(casper.wait(200, function() {
                    var name = '9.新建文件夹对话框是否显示';
                    capture(name);
                    test.assertVisible('#file-name', name);
                    casper.evaluate(function() {
                        $('#file-name').val('新建文件夹*');
                    });
                    casper.click('button[name="save"]');
                })).then(casper.wait(1000, function() {
                    var name = '10.新建文件夹包含特殊符号提示正常'
                    capture(name);
                    test.assertExists('#xmsg', name);
                    casper.click('.xmsg-ok');
                    casper.evaluate(function(time) {
                        $('#file-name').val('新建文件夹_' + time);
                    }, time);
                    casper.click('button[name="save"]');
                })).then(casper.wait(1500, function() {
                    var name = '11.名字合法文件夹可以正常被创建';
                    capture(name);
                    var result = casper.evaluate(function(time) {
                        var el = $('.filename[title="新建文件夹_' + time + '"]');
                        return el.length === 1;
                    }, time);
                    test.assert(result, name);
                    casper.click('span[title="新建文件夹_' + time + '"]');
                })).then(casper.wait(1500, function() {
                    var name = '12.文件夹可以正常进入';
                    capture(name);
                    var result = casper.evaluate(function() {
                        return $('.crumb-path span').length;
                    });
                    test.assert(result === 3, name);
                    casper.back();
                })).then(casper.wait(1500, function() {
                    casper.mouse.rightclick('.xtable-row:first-child');
                })).then(casper.wait(500, function() {
                    var name = '13.文件操作右键菜单正常显示';
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
                    var name = '14.重命名文本框显示正常';
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
                        var name = '15.重命名成功';
                        capture(name);
                        var result = casper.evaluate(function(filename) {
                            var el = $('.filename[title="' + filename + '"]');
                            return el.length === 1;
                        }, filename);
                        test.assert(result, name);
                    })
                }))
            })
            // 删除
        casper.then(function() {
            Q.fcall(casper.wait(500, function() {
                casper.mouse.rightclick('.xtable-row:first-child');
            })).then(casper.wait(500, function() {
                var name = '16.文件操作右键菜单正常显示';
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        items: $('#xmenu .menu-item').length,
                        menu: $('#xmenu').length
                    }
                });
                test.assert(result.items > 0 && result.menu > 0, name);
                casper.click('#xmenu .menu-item[name="delete"]');
            })).then(casper.wait(500, function() {
                var name = "17.文件删除的框正常弹出";
                capture(name);
                test.assertExists('#xmsg', name);
                casper.click('.xmsg-ok');
            })).then(casper.wait(500, function() {
                var name = "18.文件删除成功";
                capture(name);
                var tip = casper.evaluate(function() {
                    return document.querySelector('.xtip').innerHTML;
                });
                var result = tip.indexOf('成功');
                test.assert(result > -1, name);
            }));
        });
        //下载
        casper.then(function() {
            Q.fcall(casper.wait(0, function() {
                casper.mouse.rightclick('.xtable-row:first-child');
            })).then(casper.wait(500, function() {
                var name = '19.文件操作右键菜单正常显示';
                capture(name);
                var result = casper.evaluate(function() {
                    return {
                        items: $('#xmenu .menu-item').length,
                        menu: $('#xmenu').length
                    }
                });
                test.assert(result.items > 0 && result.menu > 0, name);
                casper.click('#xmenu .menu-item[name="filedown"]');
            })).then(casper.wait(500, function() {
                var name = "20.文件右键菜单下载正常";
                capture(name);
                var alert = casper.evaluate(function() {
                    return $('#xmsg').length;
                });
                test.assert(alert == 0, name);
            }));
        });
        // 锁定
        casper.then(function() {
            Q.fcall(casper.wait(0, function() {
                    casper.mouse.rightclick('.xtable-row:first-child');
                })).then(casper.wait(500, function() {
                    var name = '21.文件操作右键菜单正常显示';
                    capture(name);
                    var result = casper.evaluate(function() {
                        return {
                            items: $('#xmenu .menu-item').length,
                            menu: $('#xmenu').length
                        }
                    });
                    test.assert(result.items > 0 && result.menu > 0, name);
                    casper.click('#xmenu .menu-item[name="filelock"]');
                })).then(casper.wait(500, function() {
                    var name = "22.文件锁定框弹出正常";
                    capture(name);
                    var result = casper.evaluate(function() {
                        return {
                            dialog: $('#xdialog').length,
                            title: $('.xmsg-title').text()
                        };
                    });
                    test.assert(result.dialog > 0 && result.title.indexOf('锁定') > -1, name);
                    casper.click('button[name="save"]');
                })).then(casper.wait(500, function() {
                    var name = "23.文件锁定成功";
                    capture(name);
                    var tip = casper.evaluate(function() {
                        return document.querySelector('.xtip').innerHTML;
                    });
                    var result = tip.indexOf('成功');
                    test.assert(result > -1, name);
                }))
                // 解锁
            casper.then(function() {
                Q.fcall(casper.wait(1000, function() {
                    casper.mouse.rightclick('.xtable-row:first-child');
                })).then(casper.wait(500, function() {
                    var name = '24.文件操作右键菜单正常显示';
                    capture(name);
                    var result = casper.evaluate(function() {
                        return {
                            items: $('#xmenu .menu-item').length,
                            menu: $('#xmenu').length
                        };
                    });
                    test.assert(result.items > 0 && result.menu > 0, name);
                    casper.click('#xmenu .menu-item[name="fileunlock"]');
                })).then(casper.wait(500, function() {
                    var name = "25.文件解锁框弹出正常";
                    capture(name);
                    var result = casper.evaluate(function() {
                        return $('#xmsg').length;
                    });
                    test.assert(result > 0, name);
                    casper.click('.xmsg-ok');
                })).then(casper.wait(500, function() {
                    var name = "26.文件解锁成功";
                    capture(name);
                    var tip = casper.evaluate(function() {
                        return document.querySelector('.xtip').innerHTML;
                    });
                    var result = tip.indexOf('成功');
                    test.assert(result > -1, name);
                }));
            });
            // 加入收藏或取消收藏
            casper.then(function() {
                Q.fcall(casper.wait(1000, function() {
                    casper.mouse.rightclick('.xtable-row:first-child');
                })).then(casper.wait(500, function() {
                    var name = '27.文件操作右键菜单正常显示';
                    capture(name);
                    var result = casper.evaluate(function() {
                        return {
                            items: $('#xmenu .menu-item').length,
                            menu: $('#xmenu').length
                        };
                    });
                    test.assert(result.items > 0 && result.menu > 0, name);
                    casper.click('#xmenu .menu-item[name="filefav"]');
                })).then(casper.wait(200, function() {
                    var name = "28.文件收藏成功";
                    capture(name);
                    var tip = casper.evaluate(function() {
                        return document.querySelector('.xtip').innerHTML;
                    });
                    var result = tip.indexOf('成功');
                    test.assert(result > -1, name);
                })).then(casper.wait(1500, function() {
                    casper.mouse.rightclick('.xtable-row:first-child');
                })).then(casper.wait(500, function() {
                    var name = '29.文件操作右键菜单正常显示';
                    capture(name);
                    var result = casper.evaluate(function() {
                        return {
                            items: $('#xmenu .menu-item').length,
                            menu: $('#xmenu').length
                        };
                    });
                    test.assert(result.items > 0 && result.menu > 0, name);
                    casper.click('#xmenu .menu-item[name="fileunfav"]');
                })).then(casper.wait(500, function() {
                    var name = "30.文件取消收藏框弹出正常";
                    capture(name);
                    var result = casper.evaluate(function() {
                        return $('#xmsg').length;
                    });
                    test.assert(result > 0, name);
                    casper.click('.xmsg-ok');
                })).then(casper.wait(500, function() {
                    var name = "31.文件取消收藏成功";
                    capture(name);
                    var tip = casper.evaluate(function() {
                        return document.querySelector('.xtip').innerHTML;
                    });
                    var result = tip.indexOf('成功');
                    test.assert(result > -1, name);
                }));
            });
            // 发送分享
            casper.then(function() {
                Q.fcall(casper.wait(1000, function() {
                    casper.mouse.rightclick('.xtable-row:first-child');
                })).then(casper.wait(500, function() {
                    var name = '32.文件操作右键菜单正常显示';
                    capture(name);
                    var result = casper.evaluate(function() {
                        return {
                            items: $('#xmenu .menu-item').length,
                            menu: $('#xmenu').length
                        };
                    });
                    test.assert(result.items > 0 && result.menu > 0, name);
                    casper.click('#xmenu .menu-item[name="sendlink"]');
                })).then(casper.wait(500, function() {
                    var name = '33.发送分享弹出框正常';
                    capture(name);
                    var result = casper.evaluate(function() {
                        return {
                            dialog: $('#xdialog').length,
                            title: $('.xmsg-title').text()
                        };
                    });
                    test.assert(result.dialog > 0 && result.title.indexOf('分享') > 0, name);
                    casper.click('#createAssignShare');
                })).then(casper.wait(200, function() {
                    var name = '34.没有选择用户弹出提示正常';
                    capture(name);
                    var result = casper.evaluate(function() {
                        return $('#xmsg').length;
                    });
                    test.assert(result > 0, name);
                    casper.click('.xmsg-ok');
                    casper.click('.xmsg-close');
                }));
            });
            // 添加标签
            casper.then(function() {
                    Q.fcall(casper.wait(1000, function() {
                        casper.mouse.rightclick('.xtable-row:first-child');
                    })).then(casper.wait(500, function() {
                        var name = '35.文件操作右键菜单正常显示';
                        capture(name);
                        var result = casper.evaluate(function() {
                            return {
                                items: $('#xmenu .menu-item').length,
                                menu: $('#xmenu').length
                            };
                        });
                        test.assert(result.items > 0 && result.menu > 0, name);
                        casper.click('#xmenu .menu-item[name="tag"]');
                    })).then(casper.wait(500, function() {
                        var name = '36.添加标签对话框弹出正常';
                        capture(name);
                        var result = casper.evaluate(function() {
                            return $('.xdialog').length;
                        });
                        test.assert(result > 0, name);
                        casper.click('#file-tag-btn');
                    })).then(casper.wait(200, function() {
                        var name = "37.未填写标签名弹出提示正常";
                        capture(name);
                        var tip = casper.evaluate(function() {
                            return document.querySelector('.xtip').innerHTML;
                        });
                        var result = tip.indexOf('空');
                        test.assert(result > -1, name);
                    })).then(casper.wait(2000, function() {
                        casper.evaluate(function(tagname) {
                            document.querySelector('#file-tag-value').value = tagname;
                        }, 'autoTest');
                        casper.click('#file-tag-btn');
                    })).then(casper.wait(500, function() {
                        var name = "38.添加标签成功";
                        capture(name);
                        var result = casper.evaluate(function() {
                            return {
                                tip: $('.xtip').text(),
                                tagText: $('#file-tag-list').children().length
                            };
                        });
                        test.assert(result.tip.indexOf('成功') > -1 && result.tagText > 0, name);
                        casper.click('.xmsg-close');
                    }));
                })
                // 评论
            casper.then(function() {
                    Q.fcall(casper.wait(1000, function() {
                        casper.mouse.rightclick('.xtable-row:first-child');
                    })).then(casper.wait(500, function() {
                        var name = '39.文件操作右键菜单正常显示';
                        capture(name);
                        var result = casper.evaluate(function() {
                            return {
                                items: $('#xmenu .menu-item').length,
                                menu: $('#xmenu').length
                            };
                        });
                        test.assert(result.items > 0 && result.menu > 0, name);
                        casper.click('#xmenu .menu-item[name="comment"]');
                    })).then(casper.wait(500, function() {
                        var name = "40.点击评论能否正常弹出右边栏";
                        capture(name);
                        var right = casper.evaluate(function() {
                            return parseInt(document.querySelector('.comment-wrap').style.right);
                        });
                        test.assert(right == 0, name);
                        casper.click('.comment-submit');
                    })).then(casper.wait(200, function() {
                        var name = "41.不填写评论内容是否弹出提示框";
                        capture(name);
                        var result = casper.evaluate(function() {
                            return $('#xmsg').length;
                        });
                        test.assert(result > 0, name);
                        casper.click('.xmsg-ok');
                        casper.evaluate(function(comment) {
                            document.querySelector('.comment-text').value = comment;
                        }, 'autoTest');
                        casper.click('.comment-submit');
                    })).then(casper.wait(500, function() {
                        var name = "42.成功填写评论";
                        capture(name);
                        var result = casper.evaluate(function() {
                            return {
                                tip: $('.xtip').text(),
                                list: $('.comment-list').children().length
                            };
                        });
                        test.assert(result.tip.indexOf('成功') > -1 && result.list > 0, name);
                    }));
                })
                //订阅
            casper.then(function() {
                Q.fcall(casper.wait(1000, function() {
                    casper.mouse.rightclick('.xtable-row:first-child');
                })).then(casper.wait(500, function() {
                    var name = '43.文件操作右键菜单正常显示';
                    capture(name);
                    var result = casper.evaluate(function() {
                        return {
                            items: $('#xmenu .menu-item').length,
                            menu: $('#xmenu').length
                        };
                    });
                    test.assert(result.items > 0 && result.menu > 0, name);
                    casper.click('#xmenu .menu-item[name="subscribe"]');
                })).then(casper.wait(500, function() {
                    var name = "44.订阅弹出框显示正常";
                    capture(name);
                    var result = casper.evaluate(function() {
                        return $('#xmsg').length;
                    });
                    test.assert(result > 0, name);
                    casper.click('.xmsg-ok');
                })).then(casper.wait(200, function() {
                    var name = "45.订阅成功";
                    capture(name);
                    var result = casper.evaluate(function() {
                        return {
                            tip: $('.xtip').text(),
                            confirm: $('#msg').length
                        };
                    });
                    test.assert(result.tip.indexOf('成功') > -1 && result.confirm == 0, name);
                }));
            });
            // 链接分享
            casper.then(function() {
                Q.fcall(casper.wait(1000, function() {
                    casper.mouse.rightclick('.xtable-row:first-child');
                })).then(casper.wait(500, function() {
                    var name = '46.文件操作右键菜单正常显示';
                    capture(name);
                    var result = casper.evaluate(function() {
                        return {
                            items: $('#xmenu .menu-item').length,
                            menu: $('#xmenu').length
                        };
                    });
                    test.assert(result.items > 0 && result.menu > 0, name);
                    casper.click('#xmenu .menu-item[name="filelink"]');
                })).then(casper.wait(500, function() {
                    var name = "47.链接分享对话框弹出成功";
                    capture(name);
                    var result = casper.evaluate(function() {
                        return $('.xdialog').length;
                    });
                    test.assert(result > 0, name);
                    casper.click('.set-limit-btn');
                })).then(casper.wait(0, function() {
                    var name = "48.修改限制部分弹出成功";
                    capture(name);
                    test.assertVisible('.more-set', name);
                    casper.click('#deleteShareLink');
                })).then(casper.wait(200, function() {
                    var name = "49.删除分享链接成功";
                    capture(name);
                    var result = casper.evaluate(function() {
                        return {
                            dialog: $('.xdialog').length,
                            tip: $('.xtip').text()
                        };
                    });
                    test.assert(result.dialog == 0 && result.tip.indexOf('成功') > -1, name);
                }));
            });
            // 属性
            casper.then(function() {
                Q.fcall(casper.wait(1000, function() {
                    casper.mouse.rightclick('.xtable-row:first-child');
                })).then(casper.wait(500, function() {
                    var name = '50.文件操作右键菜单正常显示';
                    capture(name);
                    var result = casper.evaluate(function() {
                        return {
                            items: $('#xmenu .menu-item').length,
                            menu: $('#xmenu').length
                        };
                    });
                    test.assert(result.items > 0 && result.menu > 0, name);
                    casper.click('#xmenu .menu-item[name="property"]');
                })).then(casper.wait(500, function() {
                    var name = "51.属性框正确弹出";
                    capture(name);
                    var result = casper.evaluate(function() {
                        return $('.xdialog').length;
                    });
                    test.assert(result > 0, name);
                    casper.click('.xmsg-close');
                }));
            });
        });
    });

    casper.run(function() {
        test.done();
    });
});
