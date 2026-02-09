// Function to fetch and update data based on filters
function updateDashboard() {
  const month = document.getElementById('month').value;
  const year = document.getElementById('year').value;
  const type = document.getElementById('type').value;
  const gender = document.getElementById('gender').value;

  // Fetch the data from the JSON file
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      // Filter data based on selected filters
      let filteredData = data.filter(item => {
        const matchesMonth = (month === 'all' || new Date(item.sales_date).getMonth() + 1 === parseInt(month));
        const matchesYear = (year === 'all' || new Date(item.sales_date).getFullYear() === parseInt(year));
        const matchesType = (type === 'all' || item.product_type === type);
        const matchesGender = (gender === 'all' || item.gender === gender);

        return matchesMonth && matchesYear && matchesType && matchesGender;
      });

      // Calculate total sales, revenue, and top product
      let totalSales = 0;
      let totalRevenue = 0;
      let topProduct = '-';
      let topProductRevenue = 0;
      const productNames = [];
      const productSales = [];
      const productRevenue = [];

      filteredData.forEach(item => {
        totalSales += item.sales_quantity;
        totalRevenue += item.revenue;

        if (item.revenue > topProductRevenue) {
          topProduct = item.product_name;
          topProductRevenue = item.revenue;
        }

        productNames.push(item.product_name);
        productSales.push(item.sales_quantity);
        productRevenue.push(item.revenue);
      });

      // Update the total sales, revenue, and top product
      document.getElementById('total-sales').querySelector('p').textContent = totalSales;
      document.getElementById('total-revenue').querySelector('p').textContent = `Rp ${totalRevenue.toLocaleString()}`;
      document.getElementById('top-product').querySelector('p').textContent = topProduct;

      // Update the growth chart
      const ctxGrowth = document.getElementById('growthChart').getContext('2d');
      new Chart(ctxGrowth, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],  // Dynamic months
          datasets: [{
            label: 'Penjualan',
            data: [200, 300, 350, 400, 500],  // Dynamic data
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false
          }]
        }
      });

      // Update the top 5 products chart
      const ctxProducts = document.getElementById('productsChart').getContext('2d');
      new Chart(ctxProducts, {
        type: 'bar',
        data: {
          labels: productNames,
          datasets: [{
            label: 'Jumlah Terjual',
            data: productSales,
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
          }]
        }
      });

      // Display suggestions for management
      document.getElementById('suggestions').querySelector('p').textContent = `Penjualan ${topProduct} meningkat, pertimbangkan untuk meningkatkan stok.`;
    });
}

// Initialize dashboard on page load
window.onload = updateDashboard;

// Add event listeners for filters
document.getElementById('month').addEventListener('change', updateDashboard);
document.getElementById('year').addEventListener('change', updateDashboard);
document.getElementById('type').addEventListener('change', updateDashboard);
document.getElementById('gender').addEventListener('change', updateDashboard);
