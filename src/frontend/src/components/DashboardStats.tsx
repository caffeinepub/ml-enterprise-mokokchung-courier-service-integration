import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    total: number;
    queued: number;
    inTransit: number;
    delivered: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.total,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Queued',
      value: stats.queued,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'In Transit',
      value: stats.inTransit,
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Delivered',
      value: stats.delivered,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`h-10 w-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
