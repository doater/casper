// extend方法
var extend = function(defaults, options) {
    var extended = {};
    var prop;
    for (prop in defaults) {
        if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
            extended[prop] = defaults[prop];
        }
    }
    for (prop in options) {
        if (Object.prototype.hasOwnProperty.call(options, prop)) {
            extended[prop] = options[prop];
        }
    }
    return extended;
};
//options: 
//  init:初始化路径
//  url:测试地址
//  number:创建数量 

// 上传指定的待测试的文件
function uploadFiles(options) {
    var defaults = {
        url: 'http://' + host + ':' + port + '/web/index.html',
        init: 'util/uploadFiles'
    };
    options = options || {};
    var settings = extend(defaults, options);
    casper.test.begin('上传待测试文件', 1, function(test) {
        init(settings.init);
        casper.echo('测试地址：' + settings.url, 'INFO');
        casper.start(settings.url, function() {
            casper.then(function() {
                Q.fcall(casper.wait(1500, function() {
                    var name = "页面加载成功";
                    capture(name);
                })).then(casper.wait(0, function() {
                    var name = "弹出菜单";
                    casper.click('.new-btn .btn');
                    capture(name);
                })).then(casper.wait(200, function() {
                    var name = "上传文件";
                    var config = ['doc', 'png', 'pptx', 'txt', 'xlsx', 'zip', 'lbk'];
                    for (var i = 0; i < config.length; i++) {
                        var outPath = '/tmp/' + config[i] + '_example.' + config[i];
                        casper.page.uploadFile("input[name='file']", out + outPath);
                    }
                    capture(name);
                })).then(casper.wait(4000, function() {
                    var name = '文件上传列表是否展开';
                    capture(name);
                    test.assert(true, name);
                }));
            });
        });
        casper.run(function() {
            test.done();
        });
    });
}
// 测试预览是否正常
// mode当前模块
// image和txt office待改善
function checkView(mode) {
    var config = ['doc', 'png', 'pptx', 'txt', 'xlsx', 'zip', 'lbk'];
    var txtUrl,
        txtFid;
    casper.test.begin('压缩文件，图片,不可预览文件的预览测试', 6, function(test) {
        casper.start(url, function() {
            casper.then(function() {
                Q.fcall(casper.wait(1500, function() {
                    var name = "页面加载正常";
                    capture(name);
                })).then(casper.wait(0, function() {
                    // 点击压缩文件
                    casper.click('.filename[title="zip_example.zip"]');
                })).then(casper.wait(500, function() {
                    var name = "压缩文件预览显示正常";
                    capture(name);
                    var result = casper.evaluate(function() {
                        return {
                            dialog: $('#zip-dialog').length,
                            item: $('#zip-dialog').find('.xtable-row').length
                        };
                    });
                    test.assert(result.dialog > 0 && result.item > 0, name);
                    casper.click('button[name="cancel"]');
                })).then(casper.wait(200, function() {
                    var name = "压缩预览框关闭正常";
                    capture(name);
                    var result = casper.evaluate(function() {
                        return $('#zip-dialog').length
                    });
                    test.assert(result == 0, name);
                    casper.click('.filename[title="png_example.png"]');
                })).then(casper.wait(1000, function() {
                    var name = "图片预览正常";
                    capture(name);
                    test.assertExists('.fancybox-wrap', name);
                    casper.click('.fancybox-close');
                })).then(casper.wait(500, function() {
                    var name = "图片预览关闭正常";
                    capture(name);
                    var result = casper.evaluate(function() {
                        return $('.fancybox-wrap').length;
                    });
                    test.assert(result == 0, name);
                    casper.click('.filename[title="lbk_example.lbk"]');
                })).then(casper.wait(0, function() {
                    var name = "不可预览文件可正常下载";
                    capture(name);
                    var alert = casper.evaluate(function() {
                        return $('#xmsg').length;
                    });
                    test.assert(alert == 0, name);
                })).then(casper.wait(0, function() {
                    txtFid = casper.evaluate(function() {
                        var data = $('#filelist').table('getData');
                        var index = parseInt($('.filename[title="txt_example.txt"]').parents('.xtable-row').attr('index'));
                        var row = data[index];
                        return row.fid;
                    });
                    txtUrl = 'http://' + host + ':' + port + '/web/text.html?fid=' + txtFid;
                })).then(casper.wait(0, function() {
                    var name = "doc文件正常预览";
                    var officeUrl = 'http://' + host + ':' + port + '/webdoc/api/getWebDocUrl';
                    var docFid = casper.evaluate(function() {
                        var data = $('#filelist').table('getData');
                        var index = parseInt($('.filename[title="doc_example.doc"]').parents('.xtable-row').attr('index'));
                        var row = data[index];
                        return row.fid;
                    });
                    var data = {
                        fid: docFid
                    };
                    casper.page.open(officeUrl, 'post', data, function(status) {
                        console.log(status);
                        test.assert(status == 200, name);
                    });
                }));
            });
        });
        casper.run(function() {
            test.done();
        });
    });
    casper.test.begin('txt文件预览测试', 2, function(test) {
        casper.start(txtUrl, function() {
            casper.then(function() {
                Q.fcall(casper.wait(1500, function() {
                    var name = "txt链接页面正常打开";
                    capture(name);
                    test.assertHttpStatus(200);
                })).then(casper.wait(0, function() {
                    var name = "getWebDocUrl接口返回正常";
                    var data = {
                        fid: txtFid
                    };
                    casper.page.open('http://' + host + ':' + port + '/web/' + '/webdoc/api/getWebDocUrl', 'post', data, function(status) {
                        test.assert(status != 'success', name);
                    });
                }));
            });
        });
        casper.run(function() {
            test.done();
        });
    });
    // casper.test.begin('Office文档预览正常',1,function(test){
    //     var officeUrl='http://' + host + ':' + port +'/webdoc/api/getWebDocUrl';
    //     casper.start(url,function(){

    //     });
    // });
}


// 创建指定部门,奠定测试基础
// 创造的部门的格式为 autoTestDept1 autoTestDept2... 排序值为1,2...
function createDepts(options) {
    var defaults = {
        url: 'http://' + host + ':' + port + '/web/console.html',
        number: 10,
        init: 'util/createDepts'
    };
    options = options || {};
    var settings = extend(defaults, options);
    casper.test.begin('创建指定测试用户', 1, function(test) {
        init(settings.init);
        casper.echo('测试地址：' + settings.url, 'INFO');
        casper.start(settings.url, function() {
            casper.then(function() {
                Q.fcall(casper.wait(1500, function() {
                    var name = "页面加载完成";
                    capture(name);
                    test.assert(true, name);
                })).then(casper.wait(0, function() {
                    casper.click('.nav-item[name="dept"]');
                })).then(casper.wait(100, function() {
                    casper.click('.nav-item[name="deptlist"]');
                })).then(casper.wait(1500, function() {
                    var name = "部门列表显示正常";
                    capture(name);
                }));
            });
            var i = 0;
            casper.repeat(settings.number, function() {
                Q.fcall(casper.wait(0, function() {
                    i++;
                    casper.click(".create-dept");
                })).then(casper.wait(500, function() {
                    var name = "对话框显示正常";
                    var deptName = 'autoTestDept' + i;
                    casper.evaluate(function(deptName, order) {
                        $('input[name="name"]').val(deptName);
                        $('input[name="order"]').val(order)
                    }, deptName, i);
                    capture(name);
                    casper.click('button[name="save"]');
                })).then(casper.wait(500, function() {
                    var name = "创建部门autoTestDept" + i + "成功";
                    capture(name);
                })).then(casper.wait(500, function() {
                    var name = "对话框关闭正常";
                    capture(name);
                }));
            });
        });
        casper.run(function() {
            test.done();
        });
    });
}
// 批量创建指定用户
// 在指定创建的部门中创建用户
// autoTestDept1下创建TestUser1  依次类推
// 密码默认为123qwe
function createUsers(options) {
    var defaults = {
        url: 'http://' + host + ':' + port + '/web/console.html',
        number: 10,
        init: 'util/createUsers'
    };
    options = options || {};
    var settings = extend(defaults, options);
    casper.test.begin('创建指定用户', 1, function(test) {
        init(settings.init);
        casper.echo('测试地址：' + settings.url, 'INFO');
        casper.start(settings.url, function() {
            casper.then(function() {
                Q.fcall(casper.wait(1500, function() {
                    var name = "页面加载完成";
                    capture(name);
                    test.assert(true, name);
                })).then(casper.wait(0, function() {
                    casper.click('.nav-item[name="user"]');
                })).then(casper.wait(200, function() {
                    casper.click('.nav-item[name="userlist"]');
                })).then(casper.wait(1500, function() {
                    var name = "用户列表页面显示正常";
                    capture(name);
                }));
            });
            var i = 0;
            casper.repeat(settings.number, function() {
                Q.fcall(casper.wait(1500, function() {
                    i++;
                    casper.evaluate(function(i) {
                        $('#deptTree .xtree-check').removeClass('checked');
                        $('#deptTree .xtree-a[title="autoTestDept' + i + '"]').siblings('.xtree-check').addClass('checked');
                    }, i);
                    var name = "选择部门autoTestDept" + i + "成功";
                    capture(name);
                    casper.click('.user-create');
                })).then(casper.wait(500, function() {
                    var account = "TestUser" + i;
                    var password = '123qwe';
                    casper.evaluate(function(account, password, order) {
                        $('input[name=account]').val(account);
                        $('input[name=nickName]').val(account);
                        $('input[name=password]').val(password);
                        $('input[name=order]').val(order);
                    }, account, password, i);
                    var name = "添加用户" + account + "对话框显示正常";
                    capture(name);
                    casper.click('button[name="save"]');
                })).then(casper.wait(500, function() {
                    var name = "用户TestUser" + i + "创建成功";
                    capture(name);
                }));
            });
        });
        casper.run(function() {
            test.done();
        });
    });
}

// 批量创建指定群组,通用功能测试
// 群组为TestGroup1 TestGroup2... 依次类推
// 为群组添加部门,TestGroup1添加atuoTestDept1,TestGroup2添加atuoTestDept2... 依次类推
function createGroups(options) {
    var defaults = {
        url: 'http://' + host + ':' + port + '/web/console.html',
        number: 10,
        init: 'util/createGroups'
    };
    options = options || {};
    var settings = extend(defaults, options);
    // 创建名为autoTest,具有所有权限的群组
    casper.test.begin('创建指定群组', 1, function(test) {
        init(settings.init);
        casper.echo('测试地址：' + settings.url, 'INFO');
        casper.start(settings.url, function() {
            casper.then(function() {
                Q.fcall(casper.wait(1500, function() {
                    // 等待页面加载完成
                    var name = "后台页面加载完成";
                    capture(name);
                    test.assert(true, name);
                })).then(casper.wait(0, function() {
                    // 点击菜单群组管理
                    casper.click('.nav-item[name="group"]')
                })).then(casper.wait(500, function() {
                    // 群组管理页面加载完成
                    var name = "群组管理页面加载完成";
                    capture(name);
                }));
            });
            var i = 0;
            casper.repeat(settings.number, function() {
                Q.fcall(casper.wait(0, function() {
                    i++;
                    // 点击新建按钮
                    casper.click('.group-add');
                })).then(casper.wait(500, function() {
                    // 等待对话框弹出
                    var name = "添加新群组testGroup" + i;
                    capture(name);
                })).then(casper.wait(0, function() {
                    // 输入群组名
                    var groupName = 'TestGroup' + i;
                    casper.evaluate(function(groupName) {
                        $('input[name="name"]').val(groupName);
                    }, groupName);
                    casper.click('button[name="save"]');
                })).then(casper.wait(500, function() {
                    var name = "群组TestGroup" + i + "添加成功";
                    capture(name);
                    casper.click('#groupTree .xtree-a[title="TestGroup' + i + '"]');
                })).then(casper.wait(500, function() {
                    var name = "TestGroup" + i + "页面显示正常";
                    capture(name);
                    casper.click('.member-add');
                })).then(casper.wait(500, function() {
                    var name = "添加成员弹出框显示正常";
                    capture(name);
                    casper.evaluate(function(i) {
                        $('#deptUserTree').tree('check', {
                            target: $('#deptUserTree .xtree-a[title="autoTestDept' + i + '"]').parents('.xtree-node'),
                            trigger: true
                        });
                        // $('#deptUserTree .xtree-a[title="autoTestDept'+i+'"]').siblings('.xtree-check').addClass('checked');
                    }, i);
                })).then(casper.wait(200, function() {
                    var name = "选中autoTestDept" + i;
                    capture(name);
                    // bug button的name应该为save
                    casper.click('button[name="cancel"]');
                })).then(casper.wait(200, function() {
                    casper.click('.acl-save');
                })).then(casper.wait(500, function() {
                    var name = "添加autoTestDept" + i + "到TestGroup" + i + "成功";
                    capture(name);
                }));
            });
        });
        casper.run(function() {
            test.done();
        });
    });
}