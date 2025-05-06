import {Sequelize,DataTypes,Optional,Model} from "sequelize";
import { UUID } from "crypto";
interface postionattribute {
    id:UUID,
    name:string,
    employee_id:UUID,
    department_id:UUID,
    paygrade_id:UUID,
    isactive:boolean,
    createdat:Date,
    updatedat:Date
}
export interface positioncreationattribute extends Optional<postionattribute,'id'>{}

class Position extends Model<positioncreationattribute,postionattribute>
implements postionattribute{
    public id!:UUID
    public name!:string
    public employee_id!:UUID
    public department_id!:UUID
    public paygrade_id!:UUID
    public isactive!: boolean;
    createdat!: Date;
    updatedat!: Date;
    public static initialize(sequelize:Sequelize){
        Position.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
                },
            name: {
                type:DataTypes.TEXT 
            },
            employee_id: { 
                type:DataTypes.UUID,
            },
            department_id:{ 
                type: DataTypes.UUID
            },
            paygrade_id:{
                type:DataTypes.INTEGER
            },
            isactive:{
                type:DataTypes.BOOLEAN
            },
            createdat:{
                type:DataTypes.DATE
            },
            updatedat:{
                type:DataTypes.DATE
            }
        },{
            sequelize,
            tableName:'position',
            modelName:'position',
        })
    }
}

export default Position;