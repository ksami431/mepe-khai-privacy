import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

interface FoodLog {
  id: string;
  meal_name: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  weight_grams?: number;
  logged_at: string;
}

interface WeightLog {
  weight_kg: number;
  logged_at: string;
}

interface ExportOptions {
  includeFoodLogs?: boolean;
  includeWeightLogs?: boolean;
  includeStats?: boolean;
  startDate?: string;
  endDate?: string;
}

export const exportToCSV = async (
  foodLogs: FoodLog[],
  weightLogs: WeightLog[],
  stats: any,
  options: ExportOptions = {}
): Promise<void> => {
  const {
    includeFoodLogs = true,
    includeWeightLogs = true,
    includeStats = true,
  } = options;

  let csvContent = '';

  // Header
  csvContent += 'Mepe Khai - AI Diet Tracker\n';
  csvContent += 'Powered by Sami Khan Fitness\n';
  csvContent += `Export Date: ${new Date().toLocaleDateString()}\n\n`;

  // Food Logs
  if (includeFoodLogs && foodLogs.length > 0) {
    csvContent += 'FOOD LOGS\n';
    csvContent += 'Date,Time,Meal Type,Meal Name,Calories,Protein (g),Carbs (g),Fats (g),Weight (g)\n';
    
    foodLogs.forEach(log => {
      const date = new Date(log.logged_at);
      const dateStr = date.toLocaleDateString();
      const timeStr = date.toLocaleTimeString();
      
      csvContent += `"${dateStr}","${timeStr}","${log.meal_type}","${log.meal_name}",${log.calories},${log.protein},${log.carbs},${log.fats},${log.weight_grams || ''}\n`;
    });
    csvContent += '\n';
  }

  // Weight Logs
  if (includeWeightLogs && weightLogs.length > 0) {
    csvContent += 'WEIGHT LOGS\n';
    csvContent += 'Date,Weight (kg)\n';
    
    weightLogs.forEach(log => {
      const dateStr = new Date(log.logged_at).toLocaleDateString();
      csvContent += `"${dateStr}",${log.weight_kg}\n`;
    });
    csvContent += '\n';
  }

  // Stats Summary
  if (includeStats && stats) {
    csvContent += 'STATISTICS SUMMARY\n';
    csvContent += 'Metric,Value\n';
    csvContent += `Days Logged,${stats.daysLogged}\n`;
    csvContent += `Average Calories,${Math.round(stats.avgCalories)}\n`;
    csvContent += `Average Protein,${Math.round(stats.avgProtein)}g\n`;
    csvContent += `Average Carbs,${Math.round(stats.avgCarbs)}g\n`;
    csvContent += `Average Fats,${Math.round(stats.avgFats)}g\n`;
    csvContent += `Total Calories,${Math.round(stats.totalCalories)}\n`;
    csvContent += `Adherence,${Math.round(stats.adherence)}%\n`;
    
    if ('streak' in stats) {
      csvContent += `Streak (days),${stats.streak}\n`;
    }
    
    if (stats.weightChange !== null) {
      csvContent += `Weight Change (kg),${stats.weightChange.toFixed(2)}\n`;
    }
  }

  // Save and share file
  const fileName = `mepe-khai-export-${Date.now()}.csv`;
  const fileUri = (FileSystem as any).cacheDirectory + fileName;

  try {
    await FileSystem.writeAsStringAsync(fileUri, csvContent);

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Your Data',
        UTI: 'public.comma-separated-values-text',
      });
    } else {
      throw new Error('Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export data');
  }
};

export const generateHTMLReport = (
  foodLogs: FoodLog[],
  weightLogs: WeightLog[],
  stats: any,
  userName: string
): string => {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Mepe Khai - Nutrition Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin: 40px;
      color: #1a1a1a;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #22c55e;
    }
    .brand {
      color: #22c55e;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .title {
      font-size: 32px;
      font-weight: bold;
      margin: 10px 0;
    }
    .subtitle {
      color: #666;
      font-size: 14px;
    }
    .section {
      margin: 30px 0;
    }
    .section-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 15px;
      color: #22c55e;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 20px 0;
    }
    .stat-card {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
    }
    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: #22c55e;
      margin: 5px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th {
      background: #22c55e;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5e5e5;
    }
    tr:hover {
      background: #f9f9f9;
    }
    .footer {
      text-align: center;
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">SAMI KHAN FITNESS</div>
    <div class="title">Mepe Khai</div>
    <div class="subtitle">Nutrition & Progress Report</div>
    <div class="subtitle">${today}</div>
  </div>

  <div class="section">
    <div class="section-title">📊 Statistics Summary</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Days Logged</div>
        <div class="stat-value">${stats.daysLogged}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Avg Calories</div>
        <div class="stat-value">${Math.round(stats.avgCalories)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Avg Protein</div>
        <div class="stat-value">${Math.round(stats.avgProtein)}g</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Avg Carbs</div>
        <div class="stat-value">${Math.round(stats.avgCarbs)}g</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Avg Fats</div>
        <div class="stat-value">${Math.round(stats.avgFats)}g</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Adherence</div>
        <div class="stat-value">${Math.round(stats.adherence)}%</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">🍽️ Food Logs</div>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Meal Type</th>
          <th>Meal Name</th>
          <th>Calories</th>
          <th>Protein</th>
          <th>Carbs</th>
          <th>Fats</th>
        </tr>
      </thead>
      <tbody>
        ${foodLogs.map(log => `
          <tr>
            <td>${new Date(log.logged_at).toLocaleDateString()}</td>
            <td style="text-transform: capitalize">${log.meal_type}</td>
            <td>${log.meal_name}</td>
            <td>${log.calories} kcal</td>
            <td>${Math.round(log.protein)}g</td>
            <td>${Math.round(log.carbs)}g</td>
            <td>${Math.round(log.fats)}g</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  ${weightLogs.length > 0 ? `
  <div class="section">
    <div class="section-title">⚖️ Weight Logs</div>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Weight (kg)</th>
        </tr>
      </thead>
      <tbody>
        ${weightLogs.map(log => `
          <tr>
            <td>${new Date(log.logged_at).toLocaleDateString()}</td>
            <td>${log.weight_kg} kg</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  ` : ''}

  <div class="footer">
    <div>Mepe Khai - AI Diet Tracker</div>
    <div>Powered by Sami Khan Fitness</div>
    <div>Measure, Track, Transform</div>
  </div>
</body>
</html>
  `.trim();
};

export const exportToPDF = async (
  foodLogs: FoodLog[],
  weightLogs: WeightLog[],
  stats: any,
  userName: string
): Promise<void> => {
  try {
    const htmlContent = generateHTMLReport(foodLogs, weightLogs, stats, userName);
    const fileName = `mepe-khai-report-${Date.now()}.html`;
    const fileUri = (FileSystem as any).cacheDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, htmlContent);

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/html',
        dialogTitle: 'Export Your Report',
        UTI: 'public.html',
      });
    } else {
      throw new Error('Sharing is not available on this device');
    }
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export report');
  }
};
