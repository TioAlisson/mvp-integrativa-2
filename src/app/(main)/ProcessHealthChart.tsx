'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart } from 'chart.js';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ProcessHealthChartProps {
  statusCounts: Record<string, number>;
}

export default function ProcessHealthChart({ statusCounts }: ProcessHealthChartProps) {
  const statuses = ['Ativo', 'Em Análise', 'Sugestão','Obsoleto'];

  const dataValues = statuses.map((status) => statusCounts[status] || 0);


  const labels = statuses.map(
    (status) => `${status}`
  );

const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart: Chart<'doughnut'>) {
    const { ctx } = chart;
    const total = chart.data.datasets[0].data.reduce(
      (a, b) => Number(a) + Number(b),
      0
    );

    const centerX = chart.getDatasetMeta(0).data[0].x;
    const centerY = chart.getDatasetMeta(0).data[0].y;

    ctx.save();
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText('Total', centerX, centerY - 10);
    ctx.fillText(total.toString(), centerX, centerY + 15);
    ctx.restore();
  },
};

  const data: ChartData<'doughnut'> = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: ['#28a745', '#ffc107', '#007bff', '#6c757d'],
        hoverBackgroundColor: ['#218838', '#e0a800', '#007bff', '#5a6268'],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#333',
          font: { size: 12 },
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-lg font-semibold mb-4">Saúde dos Processos</h2>
      <div className="relative  h-64">
        <Doughnut data={data} options={options} plugins={[centerTextPlugin]} />
      </div>
    </div>
  );
}
