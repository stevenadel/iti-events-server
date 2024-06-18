import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import BusLine from "./BusLine";

const BusPoint = sequelize.define("BusPoint", {
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true,
        },
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isFloat: true,
        },
    }
});

export default BusPoint;

BusPoint.belongsTo(BusLine, {
    foreignKey: "busLineId",
    as: "busLine",
});