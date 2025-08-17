import { UUID } from "crypto";
import {DataTypes, Optional, Model, Sequelize} from "sequelize";


interface paymentattribute {
    id:UUID,
    name:string,
    data:any
}

export interface paymentcreationattribute extends Optional<paymentattribute, 'id'>{};

class Payment extends Model<paymentattribute,paymentcreationattribute>
implements paymentattribute{
    public id!:UUID
    public name!:string
    public data!:any

    public static initialize (sequelize:Sequelize){
        Payment.init({
            id: {
                type: DataTypes.UUID,
                defaultValue:DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
                },
            name: {
                type:DataTypes.UUID,
                references:{
                    model:'user',
                    key:'id'
                }
            },
            data:{
                type:DataTypes.JSON
            }
        }, {
            sequelize,
            tableName:'payslip',
            modelName:'payslip',
        })
    }
}

export default Payment;