import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Typography } from "@mui/material";
import { dateTimeConverter } from "../../../../untils/until";
import moment from "moment";

// Generate Sales Data
function createData(time, amount) {
  return { time, amount };
}

export default function Chart(props) {
  const theme = useTheme();
  const [chartData, setChartData] = React.useState();

  React.useEffect(() => {
    const allOrder = [...props.orderData];
    const data = [];

    const getDate = [];

    allOrder.forEach((orderItem) => {
      if (getDate.indexOf(moment(orderItem.createdAt).format('DD-MM-YYYY')) < 0) {
        getDate.push(moment(orderItem.createdAt).format('DD-MM-YYYY'));
      }
    });

    console.log('getDate >>> ', getDate);
    getDate.forEach((dateItem) => {
      let price = 0;
      allOrder.forEach((orderItem) => {
        if (moment(orderItem.createdAt).format('DD-MM-YYYY') === dateItem) {
          price += Number(orderItem.total_price);
        }
      });
      data.push(createData(dateItem, price));
    });
    data.sort(function (a, b) {
      const dateA = moment(a.time, "DD-MM-YYYY").format(
        "YYYY-MM-DD[T]HH:mm:ss"
      );
      const dateB = moment(b.time, "DD-MM-YYYY").format(
        "YYYY-MM-DD[T]HH:mm:ss"
      );
      return dateA > dateB ? 1 : -1;
    });
    setChartData(data);
  }, [props.orderData]);

  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Biểu đồ
      </Typography>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="time"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          ></YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
