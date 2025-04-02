
import { useState } from "react";
import { BarChart, PieChart, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChat } from "@/context/ChatContext";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import {
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  RadarChart as ReRadarChart,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBar
} from "recharts";

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface InteractiveChartProps {
  data: ChartData[];
  title?: string;
}

type ChartType = 'bar' | 'pie' | 'radar';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const InteractiveChart = ({ data, title }: InteractiveChartProps) => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const { state } = useChat();
  const { language, mood } = state;
  
  // Ensure all data has a color
  const coloredData = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length]
  }));
  
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ReBarChart data={coloredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name={language === 'ar' ? 'القيمة' : 'Value'}>
                {coloredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </ReBarChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <Pie
                data={coloredData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {coloredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        );
        
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ReRadarChart cx="50%" cy="50%" outerRadius={80} data={coloredData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Radar name={language === 'ar' ? 'القيمة' : 'Value'} dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Tooltip />
              <Legend />
            </ReRadarChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full space-y-2">
      {title && (
        <h3 className="text-sm font-medium text-center">{title}</h3>
      )}
      
      <div className="border rounded-lg p-4 bg-white/50 dark:bg-gray-800/50 shadow-sm">
        {renderChart()}
      </div>
      
      <div className="flex justify-center gap-2 pt-1">
        <Button
          variant={chartType === 'bar' ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType('bar')}
          className="rounded-full"
        >
          <BarChart className="h-4 w-4 mr-1" />
          {language === 'ar' ? 'شريطي' : 'Bar'}
        </Button>
        
        <Button
          variant={chartType === 'pie' ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType('pie')}
          className="rounded-full"
        >
          <PieChart className="h-4 w-4 mr-1" />
          {language === 'ar' ? 'دائري' : 'Pie'}
        </Button>
        
        <Button
          variant={chartType === 'radar' ? "default" : "outline"}
          size="sm"
          onClick={() => setChartType('radar')}
          className="rounded-full"
        >
          <LineChart className="h-4 w-4 mr-1" />
          {language === 'ar' ? 'راداري' : 'Radar'}
        </Button>
      </div>
    </div>
  );
};

export default InteractiveChart;
