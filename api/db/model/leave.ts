import { UUID } from "crypto"
import {Model,Sequelize,DataType,Optional, DataTypes} from 'sequelize'

interface leaveattribute {
  id:UUID,
  employee_id: UUID 
  leave_type_id: UUID 
  end_date: Date
  days_taken: number
  status: string
  reason: string
  approved_by: UUID 
  approved_at: Date
  created_at: Date
  updated_at: Date
}

export interface leavecreationattribute extends Optional<leaveattribute,'id'>{}
class Leave extends Model<leavecreationattribute,leaveattribute>
    implements leaveattribute {
        public id!:UUID
        public employee_id!:UUID
        public leave_type_id!:UUID
        public end_date!:Date
        public days_taken!:number
        public status!:string
        public reason!:string
        public approved_by!:UUID
        public approved_at!:Date
        public created_at!:Date
        public updated_at!:Date

        public static initialize(sequelize:Sequelize){
            Leave.init({
                id:{
                    type:DataTypes.UUID,
                    defaultValue:DataTypes.UUIDV4,
                    primaryKey:true,
                    allowNull:false,
                },
                employee_id:{
                    type:DataTypes.UUID,
                    allowNull:false,
                },
                leave_type_id:{
                    type:DataTypes.UUID,
                    allowNull:false,
                },
                end_date:{
                    type:DataTypes.DATE,
                    allowNull:false,
                },
                days_taken:{
                    type:DataTypes.INTEGER,
                    allowNull:false,
                },
                status:{
                    type:DataTypes.ENUM("pending","approved","rejected"),
                    allowNull:false,
                },
                reason:{
                    type:DataTypes.TEXT,
                    allowNull:false,
                },
                approved_by:{
                    type:DataTypes.UUID,
                    allowNull:true,
                },
                approved_at:{
                    type:DataTypes.DATE,
                    allowNull:true,
                },
                created_at:{
                    type:DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                },
                updated_at:{
                    type:DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                }
            },{
                sequelize,
                tableName:'leave',
                modelName:'leave'
            })
        }
    }
    export default Leave