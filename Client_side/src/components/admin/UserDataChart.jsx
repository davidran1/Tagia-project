import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const UserDataChart = ({ data, chartTitle, datasetLabel }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: datasetLabel,
        data: Object.values(data),
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
      x: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Typography align="center" py={2} variant="h5">
        {chartTitle}
      </Typography>
      <Bar data={chartData} options={options} />
    </div>
  );
};

UserDataChart.propTypes = {
  data: PropTypes.objectOf(PropTypes.number).isRequired,
  chartTitle: PropTypes.string,
  datasetLabel: PropTypes.string,
};

export default UserDataChart;
