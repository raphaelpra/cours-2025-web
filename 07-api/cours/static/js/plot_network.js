let trace1 = {
  x: [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000],
  y: [0.43, 1.21e-5, 0.00034231, 0.000266, 0.0006988, 0.005841, 0.0567, 0.654],
  type: "scatter",
  name: "25 Gb ethernet (new cluster)",
};

let trace2 = {
  x: [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000],
  y: [
    0.0019, 5.69e-5, 0.002723222, 0.00471687, 0.016027, 0.1366, 1.3633, 13.601,
  ],
  type: "scatter",
  name: "Classic ethernet (old cluster)",
};

let layout = {
  yaxis: {
    title: "time (s)",
    type: "log",
  },
  xaxis: {
    title: "Packet size",
    type: "log",
  },
  showlegend: true,
  autosize: false,
  width: 1000,
  height: 350,
  margin: {
    l: 50,
    r: 0,
    b: 50,
    t: 0,
    pad: 4,
  },
};

const plot_network = () => {
  Plotly.newPlot("plot_network", [trace1, trace2], layout);
};

// quick and dirty
const copyFunction = () => {
  navigator.clipboard.writeText(
    "uotbktgfrz84owzwc68ajhhr9z3g8acy@hook.eu1.make.com"
  );
};
