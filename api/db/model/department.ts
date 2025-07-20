import {Sequelize,DataTypes,Optional,Model} from "sequelize";
import { UUID } from "crypto";

interface departmentattribute {
    id:UUID,
    name:string,
    location:string,
    employees:UUID[]
}

export interface departmentcreationattribute extends Optional<departmentattribute,'id' | 'employees'>{}

class Department extends Model<departmentcreationattribute,departmentattribute>

implements departmentattribute{
    public id!:UUID
    public name!:string
    public location!:string
    public employees!:UUID[]
    public static initialize(sequelize:Sequelize){
        Department.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
                },
            name: {
                type:DataTypes.TEXT 
            },
            location: { 
                type:DataTypes.TEXT
            },
            employees:{ 
                type: DataTypes.ARRAY(DataTypes.UUID)
            }
        },{
            sequelize,
            tableName:'department',
            modelName:'department',
        })
    }
}

export default Department;