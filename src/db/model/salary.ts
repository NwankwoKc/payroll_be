import { allow, boolean } from 'joi';
import { Model, DataTypes, Optional,Sequelize} from 'sequelize';

 // Assuming you have a config file

interface SalaryAttributes {
  id: string; // UUID is represented as string in TypeScript
  name:string
  value: number;
  taxDeduction: number;
  calculation_type:string
  is_taxable:boolean;
  is_active:boolean;
  // Add any timestamps if needed
  createdAt?: Date;
  updatedAt?: Date;
}

interface SalaryCreationAttributes extends Optional<SalaryAttributes, 'id'> {}

class Salary extends Model<SalaryAttributes, SalaryCreationAttributes> 
  implements SalaryAttributes {
  public id!: string;
  public name!: string
  public value!: number;
  public taxDeduction!: number;
  public calculation_type!: string;
  is_taxable!: boolean;
  is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initialize(sequelize:Sequelize){
    Salary.init(
        {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          name:{
            type:DataTypes.STRING,
            allowNull:false
          },
          value: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          calculation_type:{
            type:DataTypes.STRING,
            allowNull:false
          },
          is_active:{
            type:DataTypes.BOOLEAN,
            allowNull:false
          },
          is_taxable:{
            type:DataTypes.BOOLEAN,
            allowNull:false
          },
          taxDeduction: {
            type: DataTypes.INTEGER,
            allowNull:false
          }
        },
        {
          sequelize,
          modelName: 'salary',
          tableName: 'salaries', // Sequelize automatically pluralizes
          timestamps: true, // Enable if you want createdAt/updatedAt
          underscored: true // Optional: if you prefer snake_case naming
        }
    );
  }

}



export { Salary, SalaryAttributes, SalaryCreationAttributes };