import { UUID } from "crypto";
import {DataTypes, Optional, Model, Sequelize} from "sequelize";


interface paymentattribute {
    id:UUID,
    employee_id:UUID,
    payment_amount:number,
    taxdeduction:number,
    payment_date:Date
}

type paymentcreationattribute = Optional<paymentattribute, 'id'>;

class Payment extends Model<paymentcreationattribute,paymentattribute>
implements paymentattribute{
    public id!:UUID
    public employee_id!:UUID
    public payment_amount!:number
    public taxdeduction!:number
    public payment_date!:Date

    public static initialize (sequelize:Sequelize){
        Payment.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
                },
            employee_id: {
                type:DataTypes.UUID,
                references:{
                    model:'user',
                    key:'id'
                }
            },
            payment_amount:{
                type:DataTypes.INTEGER
            },
            taxdeduction:{
                type:DataTypes.INTEGER
            },
            payment_date:{
                type:DataTypes.DATE
            }
        }, {
            sequelize,
            tableName:'payslip',
            modelName:'payslip',
        })
    }
}

export default Payment;