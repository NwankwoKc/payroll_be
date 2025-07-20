import { UUID } from "crypto";
import {DataTypes, Optional, Model, Sequelize} from "sequelize";


interface paymentattribute {
    id:UUID,
    name:string,
    recieptnum:number,
    data:any
}

export interface paymentcreationattribute extends Optional<paymentattribute, 'id'>{};

class Payment extends Model<paymentattribute,paymentcreationattribute>
implements paymentattribute{
    public id!:UUID
    public name!:string
    public recieptnum!: number;
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
                type:DataTypes.STRING,
                references:{
                    model:'user',
                    key:'id'
                }
            },
            data:{
                type:DataTypes.JSON
            },
            recieptnum:{
                type:DataTypes.INTEGER
            }
        }, {
            sequelize,
            tableName:'payslip',
            modelName:'payslip',
        })
    }
}

export default Payment;