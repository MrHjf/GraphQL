module.exports = (sequelize, DataTypes) => {
    const Model = sequelize.define((__filename.substr(__dirname.length + 1)).split(".")[0], {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV1
        },
        username: {
            type: DataTypes.STRING, // 指定值的类型
        },
        email: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
    }, {
        freezeTableName: true,
        timestamps: false,
        paranoid: true,
        underscored: true
    });

    Model.associate = (models) => {
        Model.hasMany(models.post, {
            foreignKey: 'user_id',
            constraints: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };

    return Model;
};