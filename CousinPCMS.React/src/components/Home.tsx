import {useEffect, useState} from 'react';
import {getDepartments} from '../services/DepartmentService';
import {Department} from '../models/departmentModel';

const Home = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  useEffect(() => {
    getDepartments()
      .then((res) => {
        setDepartments(res.value);
      })
      .catch(console.error);
  }, []);
  return (
    <div>
      <div className="grid grid-cols-12">
        {departments.map((department) => {
          return (
            <div className="col-span-3" key={department.akiDepartmentID}>
              <h1>{department.akiDepartmentName}</h1>
              <p>{department.akiDepartmentDescText}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
