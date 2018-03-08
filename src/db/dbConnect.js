const config = require("../../config");
const Sequelize = require("sequelize");
const path = require("path");
const fs = require("fs");
// module.exports = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
//     host: config.mysql.host,
//     port: config.mysql.port || 3306,
//     dialect: 'mysql',
//     timezone: "+08:00",
//     pool: {
//         max: 5,
//         min: 0,
//         idle: 30000
//     },
//     define: {
//         // 字段以下划线（_）来分割（默认是驼峰命名风格）
//         'underscored': true
//     }
// });
console.log('1');
const db = (() => {
    console.log('init db');
    const dbs = [];
    const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
        host: config.mysql.host,
        port: config.mysql.port || 3306,
        dialect: 'mysql',
        timezone: "+08:00",
        pool: {
            max: 5,
            min: 0,
            idle: 30000
        },
        define: {
            // 字段以下划线（_）来分割（默认是驼峰命名风格）
            'underscored': true
        }
    });
    const basename = path.basename(module.filename);
    const modelPath = path.resolve(__dirname, "..", "model");
    fs.readdirSync(modelPath)
        .filter((file)=>{
            return (file.indexOf(".") !== 0) && (file !== basename)
        })
        .forEach((file)=>{
            try {
                let model = sequelize['import'](path.join(modelPath, file));
                model.dialect = "mysql";
                dbs[model.name] = model;
            } catch (e) {
                console.error(e);
            }
        });
    Object.keys(dbs).forEach((modelName)=>{
        let model = dbs[modelName];
        if(model.associate && typeof model.associate === "function"){
            model.associate(dbs);
        }
    });

    sequelize.sync({force: false}).then((msg) => {
        console.log("初始化mysql数据库...[OK]");
        console.log("------------------------------------------------");
    }).catch(error => {
        console.error(error);
        console.log("初始化mysql数据库...[FAILED]");
        console.log("------------------------------------------------");
    });

    dbs['sequelize'] = sequelize;

    return dbs;

})();

module.exports = db;