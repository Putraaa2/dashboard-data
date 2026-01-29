async function tampilkanDashboard() {
  const response = await fetch('data.json');
  const data = await response.json();

  // Hitung total revenue per produk
  const revenuePerProduk = {};
  data.forEach(item => {
    if (!revenuePerProduk[item.produk]) {
      revenuePerProduk[item.produk] = 0;
    }
    revenuePerProduk[item.produk] += item.revenue;
  });

  // Ambil top 5
  const topProduk = Object.entries(revenuePerProduk)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const labels = topProduk.map(item => item[0]);
  const revenues = topProduk.map(item => item[1]);

  // Bar Chart
  new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Penjualan (Rp)',
        data: revenues,
        backgroundColor: 'rgba(75, 192, 192, 0.7)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Top 5 Helm Terlaris - Bar Chart'
        }
      }
    }
  });

  // Pie Chart
  new Chart(document.getElementById('pieChart'), {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Penjualan (Rp)',
        data: revenues,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Persentase Penjualan - Pie Chart'
        }
      }
    }
  });
}

tampilkanDashboard();
