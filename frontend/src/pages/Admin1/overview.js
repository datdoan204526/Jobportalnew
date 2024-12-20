import React, {useEffect, useState, useContext} from "react"
import { SetPopupContext } from "App";
import { Pie, Column } from '@ant-design/plots';
import Summary from "components/Summary";
import { Card, Grid, Typography } from '@mui/material'
import axios from "axios";
import apiList from "libs/apiList";

export default function Overview() {
  const setPopup = useContext(SetPopupContext);
  const [data, setData] = useState();
  useEffect(() => {
    const getDashboard = apiList.getDashboard;
    console.log(getDashboard);

    axios
      .get(getDashboard)
      .then((response) => {
        console.log(response?.data?.data);
        setData(response?.data?.data);
      })
      .catch((err) => {
        console.log(err);
        setPopup({
          open: true,
          icon: "error",
          message: "Error",
        });
      });
  }, []);
  const pieData = data?.applicationsByStatus || [];

  const scoreData = data?.createdLast6Months || [];

  const configPie = {
    data: pieData,
    angleField: 'count',
    colorField: 'status',
    label: {
      text: 'count',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'bottom',
        layout: { justifyContent: 'center' },
      },
    },
  };

  const configColumn = {
    data: scoreData,
    xField: 'month',
    yField: 'count',
    style: { maxWidth: 40 },
    legend: false,
  };

  return (
    <div className="min-h-screen pt-10">
      <Grid container spacing={2} marginBottom={2}>
        <Grid item xs={12} lg={4}>
          <Card>
            <Summary
              label={'New applicant accounts on today'}
              value={data?.applicant?.createdToday}
              total={data?.applicant?.total}
              change="up"
            />
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <Summary
              label={'New recruiter accounts on today'}
              value={data?.recruiter?.createdToday}
              total={data?.recruiter?.total}
              change="up"
            />
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <Summary
              label={'Jobs apply'}
              value={data?.totalJobs}
            />
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2} marginBottom={2}>
        {/* Pie Chart */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 360,
            }}
          >
            {/* Label góc trên bên phải */}
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
              }}
            >
              Jobs Acceptance/Refuse
            </Typography>
            <Pie {...configPie} />
          </Card>
        </Grid>

        {/* Column Chart */}
        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 360,
            }}
          >
            {/* Label góc trên bên phải */}
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
              }}
            >
              Number of new accounts per month
            </Typography>
            <Column {...configColumn} />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
