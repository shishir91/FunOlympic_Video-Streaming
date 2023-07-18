import connection from "./index.js";
import { DataTypes } from "sequelize";

const videoModel = connection.define(
    "videos",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        title:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        description:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        video:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        thumbnail:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    }
);

export default videoModel;
