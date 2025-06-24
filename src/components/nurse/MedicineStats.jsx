import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, Calendar } from 'lucide-react';

const MedicineStats = ({ medicines }) => {
  const totalMedicines = medicines.length;
  const lowStockMedicines = medicines.filter(m => m.status === 'Low Stock' || m.status === 'Critical').length;
  const expiringSoonMedicines = medicines.filter(m => {
    const expiry = new Date(m.expiryDate);
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return expiry < thirtyDaysFromNow && expiry >= new Date();
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Tổng số thuốc
          </CardTitle>
          <Package className="w-4 h-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{totalMedicines}</div>
          <p className="text-xs text-gray-500">Loại thuốc khác nhau</p>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Sắp hết hàng
          </CardTitle>
          <AlertTriangle className="w-4 h-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {lowStockMedicines}
          </div>
          <p className="text-xs text-gray-500">Cần bổ sung</p>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Sắp hết hạn
          </CardTitle>
          <Calendar className="w-4 h-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {expiringSoonMedicines}
          </div>
          <p className="text-xs text-gray-500">Trong 30 ngày</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicineStats;