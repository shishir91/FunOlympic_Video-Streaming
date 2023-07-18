import connection from "./index.js";
import { DataTypes } from "sequelize";

const liveModel = connection.define(
    "live",
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
        live:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        live_thumbnail:{
            type: DataTypes.STRING,
            allowNull: false,
        }
    }
);

export default liveModel;
