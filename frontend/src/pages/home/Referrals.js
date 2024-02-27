import ReferralsTable from "components/tables/ReferralsTable";
import { useState, useEffect, useContext, useRef } from "react";
import NoReferrals from "components/emptyStates/NoReferrals";
import { userType } from "libs/isAuth";
import apiList from "../../libs/apiList";
import axios from "axios";
import { SetPopupContext } from "App";
import { getId } from "libs/isAuth";

export default function Referrals() {
  const [referrals, setReferrals] = useState([]);
  const setPopup = useContext(SetPopupContext);
  const setPopupRef = useRef(setPopup);
  const type = userType();
  const UserId = getId();

  useEffect(() => {
    setPopupRef.current = setPopup;
  }, [setPopup]);

  useEffect(() => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data.applications);
        setReferrals(response.data.applications);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopupRef.current({
          open: true,
          icon: "error",
          message: "Error",
        });
      });
  }, []);

  const filteredReferrals = referrals.filter((obj) => obj.userId === UserId);

  console.log(filteredReferrals);

  if (type === "none") {
    return <NoReferrals />;
  }

  if (!referrals) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="md:bg-light  ">
      <div className="md:w-11/12 w-12/12 mx-auto md:py-28 py-10">
        <h2 className="text-4xl font-semibold text-gray-900 leading-none text-center mt-10 mb-20">
          My Profile ({filteredReferrals.length})
        </h2>

        <div className="md:block hidden">
          <ReferralsTable referrals={filteredReferrals} />
        </div>

        {/* <div className="block md:hidden pt-8">
          <ReferralCard referrals={referrals} />
        </div> */}
      </div>
    </div>
  );
}
