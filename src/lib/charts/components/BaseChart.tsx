import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChartConfig, ChartDataPoint } from '../types';
import { calculateChartPadding, calculateTickCount } from '../utils';
import { ChartTooltip } from './ChartTooltip';
import { formatCurrency } from '@/lib/utils';

interface BaseChartProps {
  data: ChartDataPoint[];
  config: ChartConfig;
  className?: string;
}

export function BaseChart({ data, config, className }: BaseChartProps) {
  const { min, max } = calculateChartPadding(data);
  const tickCount = calculateTickCount(min, max);

  return (
    <Card className={cn("col-span-full group relative", className)}>
      <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 cursor-move z-10">
        <GripVertical className="w-5 h-5 text-muted-foreground" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle>{config.title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={data} 
            margin={{ top: 10, right: 35, left: 65, bottom: 25 }}
          >
            <defs>
              <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="index"
              stroke="hsl(var(--muted-foreground))"
              label={{ 
                value: 'Trade #', 
                position: 'insideBottom', 
                offset: -15,
                fill: "hsl(var(--muted-foreground))",
                fontSize: 12
              }}
              axisLine={{ strokeWidth: 1 }}
              tickLine={{ strokeWidth: 1 }}
              padding={{ left: 0, right: 20 }}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              domain={[min, max]}
              tickCount={tickCount}
              tickFormatter={(value) => formatCurrency(value, 'USD')}
              axisLine={{ strokeWidth: 1 }}
              tickLine={{ strokeWidth: 1 }}
              tick={{ fontSize: 11 }}
              width={80}
            />
            <Tooltip content={(props) => (
              <ChartTooltip {...props} valueLabel={config.valueLabel} />
            )} />
            <Area
              type="monotone"
              dataKey={config.valueKey}
              stroke="hsl(var(--primary))"
              fill={`url(#${config.gradientId})`}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}