var Q = require('q');
var moment = require('moment');
phantom.outputEncoding = 'GBK';
casper.options.viewportSize = {
    width: 1440,
    height: 800
};
// 测试服务地址
var host = casper.cli.get('host');
var port = casper.cli.get('port');
var out = casper.cli.get('out');
var token = casper.cli.get('token');
if (!host || !port) {
    casper.echo('请输入测试服务地址和端口', 'ERROR');
    casper.exit();
}
if (!out) {
    casper.echo('请输入输出路径', 'ERROR');
    casper.exit();
}
if (token) {
    phantom.addCookie({
        name: 'token',
        value: token,
        domain: host
    });
}
// 捕捉页面错误
casper.on('page.error', function(msg, trace) {
    this.echo('ERROR ' + JSON.stringify(arguments), 'ERROR');
});

var output = '';
var index = 1;

function init(path) {
    index = 1;
    output = out + '/' + moment().format('YYYY-MM-DD') + '/' + path;
};

function capture(name) {
    name = index + '.' + name;
    casper.capture(output + '/' + name + '.png');
    index++;
};