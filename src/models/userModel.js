import connection from "./index.js";
import { DataTypes } from "sequelize";

const userModel = connection.define(
    "users",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        fullname:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        username:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        verified:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        blocked:{
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        type:{
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

export default userModel;
