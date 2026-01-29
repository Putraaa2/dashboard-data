async function loadData() {
  const res = await fetch('data.json');
  const data = await res.json();

  return data;
}

function sumByGroup(data, groupKey, valueKey) {
  const result = {};
  data.forEach(item => {
    const key = item[groupKey];
    result[key] = (result[key] || 0) + item[valueKey];
  });
  return result;
}

function renderChart(ctxId, type, labels, datasetLabel, data, colors = null) {
  new Chart(document.getElementById(ctxId), {
    type: type,
    data: {
      labels: labels,
      datasets: [{
        label: datasetLabel,
        data: data,
        backgroundColor: colors || 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: type !== 'bar' || ctxId === 'productContribution' },
        title: { display: false }
      }
    }
  });
}

loadData().then(data => {
  // 1. Tren Bulanan
  const monthlyRevenue = sumByGroup(data, 'bulan', 'revenue');
  const bulan = Object.keys(monthlyRevenue);
  const pendapatan = Object.values(monthlyRevenue);
  renderChart('trendRevenue', 'line', bulan, 'Revenue', pendapatan);

  // 2. Produk Teratas
  const revenuePerProduk = sumByGroup(data, 'produk', 'revenue');
  const topProduk = Object.entries(revenuePerProduk).sort((a,b) => b[1]-a[1]).slice(0,5);
  const produkLabels = topProduk.map(p => p[0]);
  const produkRevenue = topProduk.map(p => p[1]);
  renderChart('topProducts', 'bar', produkLabels, 'Revenue', produkRevenue);

  // 3. Wilayah
  const revenuePerWilayah = sumByGroup(data, 'wilayah', 'revenue');
  const wilayahLabels = Object.keys(revenuePerWilayah);
  const wilayahRevenue = Object.values(revenuePerWilayah);
  const regionColors = ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF'];
  renderChart('revenueByRegion', 'pie', wilayahLabels, 'Revenue', wilayahRevenue, regionColors);

  // 4. Stok
  const stokPerProduk = sumByGroup(data, 'produk', 'stok');
  const stokLabels = Object.keys(stokPerProduk);
  const stokData = Object.values(stokPerProduk);
  renderChart('stockPriority', 'bar', stokLabels, 'Stock', stokData);

  // 5. Donut Chart Kontribusi
  const totalRevenueAll = produkRevenue.reduce((a,b) => a + b, 0);
  const kontribusiPersen = produkRevenue.map(v => (v / totalRevenueAll * 100).toFixed(1));
  renderChart('productContribution', 'doughnut', produkLabels, 'Kontribusi (%)', kontribusiPersen, regionColors);
});
