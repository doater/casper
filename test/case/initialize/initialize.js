phantom.injectJs('lib/base.js');
phantom.injectJs('lib/util.js');

// 空白数据情况下,按默认配置初始化所有数据
// 数据形式包括
// 1.批量创建部门
// 2.批量创建用户
// 3.批量创建群组，并为每个群组配置一个相应的用户
// 4.在个人文件上传指定不同类型的文件
createDepts();
createUsers();
createGroups();
uploadFiles();
