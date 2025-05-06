import bcrypt from "bcrypt";
import { Model, Optional, DataTypes, Sequelize } from "sequelize";
import { UUID } from "crypto";



 interface userattribute {
    id:UUID,
    firstname:string,
    lastname:string,
    department:UUID,
    experience:string,
    postion:UUID,
    email:string,
    password:string,
    hiredate:Date,
    sex:string,
    phonenumber:number,
    jobtitle:string,
    salary:UUID,
    bankaccount:number,
    bankname:string,
    role:UUID,
    payment:Array<UUID>
}

export interface usercreationattribute extends Optional <userattribute,'id'>{

}

class User extends Model <usercreationattribute,userattribute>
    implements userattribute{
        public id!:UUID
        public firstname!:string
        public lastname!:string
        public department!:UUID
        public experience!:string
        public email!:string
        public password!:string
        public postion!:UUID
        public hiredate!:Date
        public sex!:string
        public phonenumber!:number
        public jobtitle!:string
        public salary!:UUID
        public bankaccount!:number
        public bankname!:string
        public role!:UUID
        public payment!:Array<UUID>

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
                    type:new DataTypes.TEXT(),
                    allowNull: false,
                    set(val: string) {
                      const hashedPassword = bcrypt.hashSync(val, 10);
                      this.setDataValue("password", hashedPassword);
                    }
                },
                postion: {
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
                    allowNull:false
                },
                salary:{
                    type:DataTypes.UUID,
                    allowNull:false
                },
                bankaccount:{
                    type:DataTypes.INTEGER,
                    allowNull:false
                },
                bankname:{
                    type:DataTypes.TEXT,
                    allowNull:false
                },
                role:{
                    type:DataTypes.ENUM('admin','employee'),
                    defaultValue: 'employee'
                },
                payment:{
                    type: DataTypes.ARRAY(DataTypes.UUID)
                }
                },
                {
                    sequelize,
                    modelName: 'user',
                    tableName: 'user',
                }
            )
        }
    }}

export default User;