import { UUID } from 'crypto'
import {Model,Sequelize,DataType,Optional, DataTypes} from 'sequelize'

interface attendanceattribute {
    id:UUID
    employee_id:UUID,
    date:Date,
    created_at:Date,
    status:string,
    leave_id:UUID
}

interface attendancecreationattribute extends Optional<attendanceattribute,'id'>{}

class Attendance extends Model<attendancecreationattribute,attendanceattribute>
    implements attendanceattribute {
        public id!:UUID;
        public employee_id!:UUID;
        public date!:Date;
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
                date:{
                    type:DataTypes.DATE
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