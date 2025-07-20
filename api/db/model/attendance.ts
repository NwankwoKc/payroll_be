import { UUID } from 'crypto'
import {Model,Sequelize,DataType,Optional, DataTypes} from 'sequelize'

interface attendanceattribute { 
    id:UUID
    employee_id:UUID,
    status:string,
    leave_id:UUID
}

export interface attendancecreationattribute extends Optional<attendanceattribute, 'id' | 'leave_id'>{}

class Attendance extends Model<attendancecreationattribute,attendanceattribute>
    implements attendanceattribute {
        public id!:UUID;
        public employee_id!:UUID;
        public status!: string;
        public leave_id!:UUID;
        public static initialize(sequelize:Sequelize){
            Attendance.init({
                id:{
                    type:DataTypes.UUID,
                    primaryKey:true,
                    allowNull:false,
                    defaultValue: DataTypes.UUIDV4
                },
                employee_id:{
                    type:DataTypes.UUID,
                    allowNull:false
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