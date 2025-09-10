import Attendance from "../db/model/attendance"
import { Op, Sequelize } from "sequelize";
import  User  from "../db/model/user";
import { Salary, SalaryAttributes, SalaryCreationAttributes } from "../db/model/salary";

//calculating salary based on attendance
  export const calculatesalary = async (ids:any)=>{
    let date = new Date()
    let id:any = ids
    const att = await Attendance.findAll({
      where:{
        employee_id:id,
          [Op.and]:[
            Sequelize.literal(`EXTRACT(YEAR FROM "createdAt") = ${date.getFullYear()}`),
            Sequelize.literal(`EXTRACT(MONTH FROM "createdAt") = ${date.getMonth() + 1}`),
          ],
        }
    })
    const count = att.length;
    const usersalary = await User.findOne({
      where:{
        id:id
      },
      attributes:['salary']
    })
    if(!usersalary){return }
    const usersala = usersalary.salary?.toString()

 
    const salary = await Salary.findOne({
      where:{
        id:usersala
      },
      attributes:['amount'],
    })
     if(!salary){return }
    const sala = salary.amount * count;

    const [affectedCount] = await User.update(
    {
        amount: sala // or use Sequelize.literal for operations
    },
    {
        where: {
        id: id // your condition
        }
    });

    if (affectedCount === 0) {
    throw new Error('User not found or no changes made');
    }
    console.log(sala)
        return sala
}