import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import BusPoint from "./BusPoint";

const BusLine = sequelize.define("BusLine", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 1,
        },
    },
});

BusLine.hasMany(BusPoint, {
    foreignKey: "busLineId",
    as: "points",
});

export default BusLine;
