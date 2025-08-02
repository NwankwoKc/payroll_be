import { Model, Optional, DataTypes, Sequelize } from "sequelize";
import { UUID } from "crypto";
import bcrypt from 'bcryptjs';


 interface userattribute {
    id:UUID,
    firstname:string,
    lastname:string,
    department:UUID,
    experience:string,
    position:UUID,
    email:string,
    password:string,
    hiredate:Date,
    sex:string,
    phonenumber:string,
    jobtitle:string,
    salary:UUID | null,
    account_number:string,
    bank_code:string,
    type:string,
    bankname:string,
    payment:Array<UUID>,
    recipient:string,
    profileimage:string
}

export interface usercreationattribute extends Optional <userattribute,'id' |'payment' | 'profileimage'| 'recipient'| 'salary'>{}

class User extends Model <usercreationattribute,userattribute>
    implements userattribute{
        public id!:UUID
        public firstname!:string
        public lastname!:string
        public department!:UUID
        public experience!:string
        public email!:string
        public password!:string
        public position!:UUID
        public hiredate!:Date
        public sex!:string
        public phonenumber!:string
        public jobtitle!:string
        public salary!:UUID | null
        public account_number!:string
        public bank_code!:string;
        public type!:string;
        public bankname!: string;
        public payment!:Array<UUID>
        public recipient!: string;
        public profileimage!:string

        public static initialize(sequelize:Sequelize){ {
            User.init({
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                    allowNull: false,
                    },
                firstname: {
                    type:DataTypes.TEXT,
                    allowNull:false
                },
                lastname: {
                    type:DataTypes.TEXT,
                    allowNull:false
                },
                department:{
                    type:DataTypes.UUID,
                    allowNull:false,
                    references:{
                        model:'department',
                        key:'id'
                    }
                },
                experience:{
                    type:DataTypes.TEXT
                },
                email:{
                    type:DataTypes.TEXT,
                    allowNull:false

                },
                password:{
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                position: {
                    type:DataTypes.UUID,
                    allowNull:false,
                    references:{
                        model:'position',
                        key:'id'
                    }
                },
                hiredate:{
                    type:DataTypes.DATE
                },
                sex:{
                    type:DataTypes.ENUM('Male','Female'),
                    allowNull:false
                },
                phonenumber:{
                    type:DataTypes.TEXT,
                    allowNull:false
                },
                jobtitle:{ 
                    type:DataTypes.TEXT,
                    defaultValue: DataTypes.UUIDV4,
                    allowNull:false
                },
                salary:{
                    type:DataTypes.UUID,
                    allowNull:true,
                    references:{
                        model:'salary',
                        key:'id'
                    }
                },
                account_number:{
                    type:DataTypes.TEXT,
                    allowNull:false
                },
                bankname:{
                    type:DataTypes.TEXT,
                    allowNull:false
                },
                type:{
                    type:DataTypes.TEXT,
                    defaultValue:'nuban'
                },
                bank_code:{
                    type:DataTypes.TEXT,
                    allowNull:false
                },
                payment:{
                    type: DataTypes.ARRAY(DataTypes.UUID),
                    allowNull:true,
                    defaultValue:[]
                },
                profileimage:{
                    type: DataTypes.TEXT,
                    allowNull:true,
                    defaultValue:null
                },
                recipient:{
                    type:DataTypes.TEXT
                }
                },
                {
                    sequelize,
                    modelName: 'user',
                    tableName: 'user',
                }
            )
            User.beforeCreate(async (user) => {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            })
        }
    }}

export default User;