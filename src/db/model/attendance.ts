import { UUID } from 'crypto'
import {Model,Sequelize,DataType,Optional, DataTypes} from 'sequelize'

interface attendanceattribute {
    id:UUID
    employee_id:UUID,
    created_at:Date,
    status:string,
    leave_id:UUID
}

export interface attendancecreationattribute extends Optional<attendanceattribute, 'id' | 'leave_id'>{}

class Attendance extends Model<attendancecreationattribute,attendanceattribute>
    implements attendanceattribute {
        public id!:UUID;
        public employee_id!:UUID;
        public created_at!: Date;
        public status!: string;
        public leave_id!:UUID
        public static initialize(sequelize:Sequelize){
            Attendance.init({
                id:{
                    type:DataTypes.UUID,
                    primaryKey:true,
                    allowNull:false,

                },
                employee_id:{
                    type:DataTypes.UUID
                },
                created_at:{
                    type:DataTypes.DATE
                },
                status:{
                    type:DataTypes.ENUM("late","punctual")
                },
                leave_id:{
                    type:DataTypes.UUID
                }
            },
            {
                sequelize,
                tableName:'attendance',
                modelName:'attendance'
            })
        }
    }

    export default Attendance