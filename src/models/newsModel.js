import connection from "./index.js";
import { DataTypes } from "sequelize";

const newsModel = connection.define(
    "news",
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
        photo:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    }
);

export default newsModel;
