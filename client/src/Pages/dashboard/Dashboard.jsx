import Chart from "chart.js/auto";
import "./Dashboard.css";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Dashboard = () => {
  const [total, setTotal] = useState(0);
  const [totalInvoice, setTotalInvoice] = useState(0);
  const [totalMonthCollection, setTotalMonthCollection] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const chartInstanceRef = useRef(null); // Reference to keep track of the chart instance

  // Function to fetch data from the backend
  const getData = async () => {
    try {
      const response = await axios.post("https://invoice-management-system-server.vercel.app/get", {
        email: localStorage.getItem("email"),
      }); // Your API endpoint to fetch invoices
      setInvoices(response.data.invoices);
      getOverAllTotal(response.data.invoices);
      getMonthsTotal(response.data.invoices);
      calculateMonthWiseCollection(response.data.invoices);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to calculate the overall total from all invoices
  const getOverAllTotal = (invoiceList) => {
    const overallTotal = invoiceList.reduce((acc, curr) => acc + curr.total, 0);
    setTotal(overallTotal);
  };

  // Function to calculate the total collection for the current month
  const getMonthsTotal = (invoiceList) => {
    const currentMonth = new Date().getMonth(); // Current month (0-11)
    const currentYear = new Date().getFullYear(); // Current year

    const monthTotal = invoiceList
      .filter((invoice) => {
        // Convert the ISO date string or Firebase timestamp to a Date object
        const invoiceDate = invoice.date.seconds
          ? new Date(invoice.date.seconds * 1000)
          : new Date(invoice.date);

        // Compare the month and year with the current month and year
        return (
          invoiceDate.getMonth() === currentMonth &&
          invoiceDate.getFullYear() === currentYear
        );
      })
      .reduce((acc, curr) => acc + curr.total, 0); // Sum the totals

    setTotalMonthCollection(monthTotal);
  };

  // Function to calculate month-wise collection and render the chart
  const calculateMonthWiseCollection = (data) => {
    const chartData = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    data.forEach((d) => {
      const invoiceDate = d.date.seconds
        ? new Date(d.date.seconds * 1000)
        : new Date(d.date);

      const month = invoiceDate.toLocaleDateString("default", {
        month: "long",
      });

      if (invoiceDate.getFullYear() === new Date().getFullYear()) {
        chartData[month] += d.total;
      }
    });

    // Log the processed chart data to ensure it's correct
    console.log("Processed Chart Data:", chartData);

    // If chartData has valid values, create the chart
    if (Object.values(chartData).some((value) => value > 0)) {
      createChart(chartData);
    }
  };

  // Function to create and render the chart
  const createChart = (chartData) => {
    const ctx = document.getElementById("myChart");

    // Destroy the previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create a new chart and store the instance in the reference
    chartInstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: "Monthly Collection",
            data: Object.values(chartData),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  useEffect(() => {
    getData(); // Fetch data when the component mounts
  }, []);

  return (
    <div className="home-container">
      <div className="home-first-row">
        <div className="home-box box-1">
          <h1>Rs. {total} </h1>
          <p>Overall Total</p>
        </div>
        <div className="home-box box-2">
          <h1>{invoices.length} </h1>
          <p>Total Invoices</p>
        </div>
        <div className="home-box box-3">
          <h1>Rs. {totalMonthCollection} </h1>
          <p>This Month's Collection</p>
        </div>
      </div>

      <div className="home-second-row">
        <div className="chart-box">
          <canvas id="myChart"></canvas>
        </div>
        <div className="recent-invoice-list">
          <h3>Recent Invoice List</h3>
          <div className="invoice-headers">
            <p>Name</p>
            <p>Date</p>
            <p>Total</p>
          </div>
          {invoices.slice(0, 6).map((data, index) => {
            const dateObj = data.date.seconds
              ? new Date(data.date.seconds * 1000)
              : new Date(data.date); // If already in string format

            return (
              <div className="invoice-item" key={index}>
                <p>{data.to}</p>
                <p>
                  {!isNaN(dateObj)
                    ? dateObj.toLocaleDateString()
                    : "Invalid Date"}
                </p>
                <p>{data.total}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
