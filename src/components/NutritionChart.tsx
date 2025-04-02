
import { NutritionData } from "@/types";
import { useChat } from "@/context/ChatContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface NutritionChartProps {
  data: NutritionData;
}

const NutritionChart = ({ data }: NutritionChartProps) => {
  const { state } = useChat();
  const { language } = state;
  
  // Calculate total for percentages
  const total = data.carbohydrates + data.protein + data.fats;
  
  // Format data for pie chart
  const chartData = [
    { 
      name: language === 'ar' ? 'الكربوهيدرات' : 'Carbohydrates', 
      value: data.carbohydrates,
      percentage: ((data.carbohydrates / total) * 100).toFixed(1)
    },
    { 
      name: language === 'ar' ? 'البروتين' : 'Protein', 
      value: data.protein,
      percentage: ((data.protein / total) * 100).toFixed(1) 
    },
    { 
      name: language === 'ar' ? 'الدهون' : 'Fats', 
      value: data.fats,
      percentage: ((data.fats / total) * 100).toFixed(1)
    },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  
  // Custom tooltip to show percentage
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded-md shadow-sm text-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}g`}</p>
          <p className="text-gray-600">{`${payload[0].payload.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-center mb-2 font-medium">
        {language === 'ar' ? 'التحليل الغذائي' : 'Nutritional Analysis'}
      </h3>
      
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="h-48 w-full sm:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-full sm:w-1/2 flex flex-col gap-2">
          <div className="text-center font-medium">
            {language === 'ar' ? 'السعرات الحرارية' : 'Calories'}: {data.calories}
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <div className="text-xs font-medium mt-1">{item.name}</div>
                <div className="text-xs">{item.value}g ({item.percentage}%)</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionChart;
