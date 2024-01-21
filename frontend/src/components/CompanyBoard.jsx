import { useEffect, useState } from "react";
import axios from "axios";
import apiList from "../libs/apiList";
import Recruiter from "./Recruiter";

export default function CompanyBoard() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    let recruiter = apiList.allRecruiter;
    axios
      .get(recruiter)
      .then((response) => {
        console.log(response?.data.allUser);
        setCompanies(response?.data.allUser);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <>
      <div className="bg-light">
        <div className="md:w-10/12 w-11/12 mx-auto h-full md:pb-28 pb-12 ">
          <h1 className="md:text-6xl text-4xl font-bold text-gray-900 text-center md:pb-16 pb-12">
            Recruiter
          </h1>
          <div className="grid lg:grid-cols-3 md:gap-6 gap-10 grid-cols-1 ">
            {companies.length > 0 ? (
              companies.map((company) => {
                return <Recruiter recruiter={company} key={company.userId} />;
              })
            ) : (
              <h5 style={{ textAlign: "center" }}>No recruiter found</h5>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
