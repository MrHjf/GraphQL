module.exports = (sequlize, DataTypes) => {
    const Model = sequlize.define((__filename.substr(__dirname.length + 1)).split(".")[0], {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV1
        },
        title: {
            type: DataTypes.STRING
        },
        content: {
            type: DataTypes.STRING
        }

    }, {
        freezeTableName: true,
        timestamps: false,
        paranoid: true,
        underscored: true
    });

    Model.associate = (models) => {
        Model.belongsTo(models.author, {
            foreignKey: 'user_id',
            constraints: true,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    }

    return Model;
};
