import { UUID } from "crypto";
import {DataTypes, Optional, Model, Sequelize} from "sequelize";


interface paymentattribute {
    id:UUID,
    name:string,
    reference:UUID
    data:any
}

export interface paymentcreationattribute extends Optional<paymentattribute, 'id'>{};

class Payment extends Model<paymentattribute,paymentcreationattribute>
implements paymentattribute{
    public id!:UUID
    public name!:UUID
    public reference!:UUID;
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
            reference:{
                type:DataTypes.UUID
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