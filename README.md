#web自动化测试#

1. npm install

2. 在项目之外创建一个目录用于输出测试结果，如

    /data

3. 目录结构

    测试脚本放于case目录下，按执行顺序通过数字作为前缀进行编号

4. 执行测试命令，必须切换到case所在目录下进行

    casperjs test ./case/1.login/1.login.js --host=192.168.1.183 --port=80 --out=/data/testing

    casperjs test 后面跟的是要测试的脚本

    --host 要测试的服务端地址

    --port 要测试的服务端端口

    --out 测试结果输出目录

    可选参数

    --token 用户token，用户测试需要登录的页面