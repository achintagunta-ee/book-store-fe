import ExcelJS from 'exceljs';

interface ChartDataPoint {
  label: string;
  value: number;
}

interface AnalyticsData {
  revenueChart: { name: string; revenue: number }[];
  topBooks: { title: string; sold: number }[];
  topCustomers: { email: string; spent: number }[];
  categorySales: { category: string; sold: number }[];
  overview: { revenue: number; orders: number; avg_order_value: number } | null;
}

// Modern, Vibrant Color Palette
const COLORS = [
  '#4F46E5', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#6366F1', // Indigo Light
  '#14B8A6'  // Teal
];

const generateBarChartImage = (
  data: ChartDataPoint[],
  width: number,
  height: number,
  title: string,
  yAxisFormatter: (val: number) => string
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // 1. Background (Clean White)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Constants
  const padding = { top: 70, right: 40, bottom: 80, left: 90 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxVal = Math.max(...data.map((d) => d.value), 1) * 1.15; // 15% headroom
  const unitWidth = chartWidth / (data.length || 1);
  const barWidth = Math.min(unitWidth * 0.6, 50);

  // 2. Title
  ctx.fillStyle = '#111827'; // Gray 900
  ctx.font = 'bold 24px "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, 40);

  // 3. Grid Lines & Axis
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.font = '12px "Segoe UI", sans-serif';
  
  const ySteps = 5;
  for (let i = 0; i <= ySteps; i++) {
    const val = (maxVal / ySteps) * i;
    const y = height - padding.bottom - (val / maxVal) * chartHeight;

    // Grid (Dashed for non-zero)
    if (i > 0) {
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.strokeStyle = '#E5E7EB'; // Gray 200
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Y-Axis Labels
    ctx.fillStyle = '#6B7280'; // Gray 500
    ctx.fillText(yAxisFormatter(val), padding.left - 15, y);
  }

  // 4. Draw Bars
  data.forEach((item, index) => {
    const x = padding.left + index * unitWidth + (unitWidth - barWidth) / 2;
    const barHeight = (item.value / maxVal) * chartHeight;
    const y = height - padding.bottom - barHeight;

    const color = COLORS[index % COLORS.length];

    // Bar
    ctx.fillStyle = color;
    ctx.fillRect(x, y, barWidth, barHeight);

    // X-Axis Label
    ctx.save();
    const labelX = padding.left + index * unitWidth + unitWidth / 2;
    const labelY = height - padding.bottom + 15;

    ctx.translate(labelX, labelY);
    ctx.rotate(-Math.PI / 6); // 30 degree tilt
    ctx.fillStyle = '#374151'; // Gray 700
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.font = '12px "Segoe UI", sans-serif';
    
    let labelText = item.label;
    if (labelText.length > 20) labelText = labelText.substring(0, 18) + '...';
    ctx.fillText(labelText, 0, 0);
    ctx.restore();
  });

  // Base Line
  ctx.beginPath();
  ctx.moveTo(padding.left, height - padding.bottom);
  ctx.lineTo(width - padding.right, height - padding.bottom);
  ctx.strokeStyle = '#9CA3AF'; // Gray 400
  ctx.lineWidth = 1;
  ctx.stroke();

  // Border (Subtle)
  ctx.strokeStyle = '#F3F4F6';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, width, height);

  return canvas.toDataURL('image/png');
};

const generatePieChartImage = (
  data: ChartDataPoint[],
  width: number,
  height: number,
  title: string
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Layout
  const padding = 50;
  const chartAreaWidth = width * 0.6; // Chart takes left 60%
  const radius = Math.min(chartAreaWidth, height) / 2 - padding;
  const centerX = chartAreaWidth / 2 + 20;
  const centerY = height / 2 + 10;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Title
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 24px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, width / 2, 40);

  // Draw Donut
  let startAngle = 0;
  const innerRadius = radius * 0.6; // Donut hole

  data.forEach((item, index) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    const color = COLORS[index % COLORS.length];

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    // Outer Arc
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    
    // Slice Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    startAngle += sliceAngle;
  });

  // Cut out the center (Donut hole)
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  // Draw Legend on right side
  const legendX = chartAreaWidth + 20;
  let legendY = (height - data.length * 30) / 2;
  
  ctx.font = '13px "Segoe UI", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  data.forEach((item, index) => {
    const color = COLORS[index % COLORS.length];
    
    // Dot
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(legendX, legendY, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Text
    ctx.fillStyle = '#374151';
    let percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) + '%' : '0%';
    let label = item.label.length > 20 ? item.label.substring(0, 18) + '...' : item.label;
    ctx.fillText(`${label}`, legendX + 15, legendY);
    
    // Value/Percent
    ctx.fillStyle = '#6B7280';
    ctx.fillText(`(${percentage})`, legendX + 15 + ctx.measureText(label).width + 8, legendY);
    
    legendY += 30;
  });

  // Border
  ctx.strokeStyle = '#F3F4F6';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, width, height);

  return canvas.toDataURL('image/png');
};

const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', {
  maximumFractionDigits: 0,
})}`;

const formatNumber = (val: number) => val.toLocaleString('en-IN');

export const addChartToExcel = async (
  originalBlob: Blob,
  data: AnalyticsData
): Promise<Blob> => {
  try {
    const arrayBuffer = await originalBlob.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    // Styling and Charts
    workbook.worksheets.forEach(worksheet => {
      // 1. Auto-Fit Column Widths
      worksheet.columns.forEach((column) => {
          let maxLength = 0;
          if (column && column.eachCell) {
              column.eachCell({ includeEmpty: true }, (cell) => {
                  const cellValue = cell.value ? cell.value.toString() : '';
                  if (cellValue.length > maxLength) {
                      maxLength = cellValue.length;
                  }
              });
          }
          // Set width: Min 25, adjusted for content
          // If it's the first column (Metric), ensure it's at least 40
          // If it's the second column (Value), ensure it's at least 40
          // Buffer of 5 chars
          const desiredWidth = maxLength + 5;
          const minWidth = 30; 
          column.width = desiredWidth < minWidth ? minWidth : desiredWidth;
      });
      
      // Enforce specific widths for first two columns to be safe
      const col1 = worksheet.getColumn(1);
      if(col1 && (col1.width || 0) < 50) col1.width = 50;
      
      const col2 = worksheet.getColumn(2);
      if(col2 && (col2.width || 0) < 50) col2.width = 50;

      // 2. Fancy Header Styling
      const row1 = worksheet.getRow(1);
      row1.height = 30;
      row1.eachCell((cell) => {
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12, name: 'Segoe UI' };
          cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FF1E293B' } // Slate 800
          };
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          cell.border = {
              bottom: { style: 'medium', color: { argb: 'FFCBD5E1' } }
          };
      });

      // 3. Data Rows Styling
      worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
              row.height = 25;
              row.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
              row.font = { size: 11, name: 'Segoe UI', color: { argb: 'FF334155' } };
              
              // Borders for data cells
              row.eachCell({ includeEmpty: true }, (cell, colNum) => {
                  cell.border = {
                      top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                      left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                      bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                      right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
                  };
                  // Center align values in col 2
                  if(colNum === 2) {
                      cell.alignment = { vertical: 'middle', horizontal: 'right' };
                  }
              });
          }
      });
    });

    const mainSheet = workbook.worksheets[0];
    if (!mainSheet) throw new Error("No sheets found");

    // Layout config
    const chartsToAdd = [
        {
            title: 'Revenue Trend',
            data: data.revenueChart.map(d => ({ label: d.name, value: d.revenue })),
            formatter: formatCurrency,
            pos: { tl: { col: 5, row: 1 }, ext: { width: 800, height: 450 } } // F2
        },
        {
            title: 'Overview',
            data: data.overview ? [
                { label: 'Revenue', value: data.overview.revenue },
                { label: 'Orders', value: data.overview.orders },
                { label: 'Avg Order Value', value: data.overview.avg_order_value }
            ] : [],
            formatter: formatNumber,
            pos: { tl: { col: 5, row: 22 }, ext: { width: 1000, height: 450 } } // F23
        },
        {
            title: 'Top Books',
            data: data.topBooks.map(b => ({ label: b.title, value: b.sold })),
            formatter: formatNumber,
            pos: { tl: { col: 20, row: 1 }, ext: { width: 800, height: 450 } } // U2
        },
        {
            title: 'Category Sales',
            data: data.categorySales.map(c => ({ label: c.category, value: c.sold })),
            formatter: formatNumber,
            pos: { tl: { col: 20, row: 22 }, ext: { width: 800, height: 450 } } // U23
        },
        {
            title: 'Top Customers (Spent)',
            data: data.topCustomers.map(c => ({ label: c.email.split('@')[0], value: c.spent })),
            formatter: formatCurrency,
            pos: { tl: { col: 5, row: 45 }, ext: { width: 800, height: 450 } } // F46
        }
    ];

    chartsToAdd.forEach(chart => {
        if (chart.data.length > 0) {
             // 1. Add Bar Chart
             const barImgBase64 = generateBarChartImage(chart.data, 800, 450, chart.title, chart.formatter);
             const barImgId = workbook.addImage({
                 base64: barImgBase64,
                 extension: 'png'
             });
             mainSheet.addImage(barImgId, chart.pos);

             // 2. Add Donut/Pie Chart
             if (chart.title !== 'Overview') {
                const pieImgBase64 = generatePieChartImage(chart.data, 800, 450, chart.title);
                const pieImgId = workbook.addImage({
                    base64: pieImgBase64,
                    extension: 'png'
                });
                
                // Shift 12 columns right
                const piePos = {
                    tl: { col: chart.pos.tl.col + 14, row: chart.pos.tl.row },
                    ext: chart.pos.ext
                };
                
                mainSheet.addImage(pieImgId, piePos);
             }
        }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  } catch (error) {
    console.error("Error adding chart to Excel:", error);
    return originalBlob;
  }
};
