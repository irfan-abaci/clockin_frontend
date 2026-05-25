import React, { useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import { useSelector } from 'react-redux';
import Moments from "../../../../helpers/Moment";
import CustomBadgeWithIcon from "../../../CustomComponent/BadgeWithIcon";
import ExitRequestButton from "../../../CustomComponent/Buttons/ExitRequestButton";
import MarkAsEntryButton from "../../../CustomComponent/Buttons/MarkAsEntry";

const ActivityCard = () => {
//   const {
//     lastActivity = "Hi",
//     lastActivityTime = "Hi",
//     createdBy = "Hi",
//     createdDate = "Hi",
//     status = "Hi",
//   }:any = data;
  const VehicleDetails = useSelector((state:any) => state.VehicleSlice.vehicle_details);

  const [infoFields, setInfoFields] = useState([]);

useEffect(() => {
  if (VehicleDetails) {
    setInfoFields([
      { label: "Last activity", value: VehicleDetails?.last_activity || "----" },
      { label: "Last activity time", value:  Moments(VehicleDetails?.last_activity_time,'datetime') || "----" },
      { label: "Created by", value: VehicleDetails.meta_data?.created_by_name || "----" },
      { label: "Created date", value:  Moments(VehicleDetails?.meta_data?.created_at,'datetime') || "----" },
      { label: "Status", value: VehicleDetails?.meta_data?.status || "----" },
    ]);
  }
}, [VehicleDetails]);

  return (
    <Card shadow="sm">
      <CardBody>
        <div className="d-flex align-items-center" style={{ color: "#152B52",userSelect:'none' }}>
          <div
            style={{
              width: "100%",
              overflowX: "auto",
              display: "flex",
              paddingLeft: "10px",
            }}
          >
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  {infoFields.map((field, index) => (
                    <td key={index} style={{textAlign:'center'}}>
                      <p
                        style={{
                          minWidth: "100px",
                          fontSize: "15px",
                          fontWeight: 450,
                          marginBottom: "5px",
                        }}
                      >
                        {field.label}
                      </p>
                      {field.label === "Status" ? (
                       <CustomBadgeWithIcon>{field.value}</CustomBadgeWithIcon>
                      ) : (
                      <p style={{ fontWeight: 450 }}>{field.value}</p>)}
                    </td>
                  ))}
                  <td>
                  {(VehicleDetails?.last_activity==="Entry"||VehicleDetails?.last_activity==="ForceEntry")?
					     <ExitRequestButton
						 	apiEndpoint='api/exit_requests'
							rowData={VehicleDetails}
                            ButtonText='Exit Request'
					     />
						 :<MarkAsEntryButton
							rowData={VehicleDetails}
                            ButtonText='Mark Entry'
						 />
					   }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ActivityCard;
