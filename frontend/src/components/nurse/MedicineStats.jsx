import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, Calendar } from 'lucide-react';
import medicalService from '@/api/services/medical.service';

const MedicineStats = ({ medicines, totalElements }) => {
  const totalMedicines = medicines.length;
  const [allMedicines, setAllMedicines] = useState([]);

  useEffect(() => {
    const fetchAllMedicines = async () => {
      const response = await medicalService.getAllMedications({ page: 0, size: 1000 });
      setAllMedicines(response.data?.content || []);
    };
    fetchAllMedicines();
  }, []);

  // Đếm số thuốc sắp hết hàng trên toàn bộ kho
  const lowStockMedicines = allMedicines.filter(m => (m.quantity ?? 0) < 5).length;

  // Đếm số loại thuốc (id duy nhất) có ngày hết hạn trong 30 ngày tới
  const expiringSoonMedicineIds = new Set();
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  allMedicines.forEach(m => {
    const expiry = new Date(m.exp);
    if (expiry < thirtyDaysFromNow && expiry >= now) {
      expiringSoonMedicineIds.add(m.id);
    }
  });
  const expiringSoonMedicinesCount = expiringSoonMedicineIds.size;

  const totalQuantity = medicines.reduce((sum, m) => sum + (m.quantity ?? 0), 0);

  const expiringSoonMedicinesQuantity = medicines.reduce((sum, m) => {
    const expiry = new Date(m.exp);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (expiry < thirtyDaysFromNow && expiry >= now) {
      return sum + (m.quantity ?? 0);
    }
    return sum;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="rounded-xl shadow-md bg-white border border-blue-100">
        <CardHeader className="bg-[#E3F2FD] rounded-t-xl border-b border-blue-100">
          <CardTitle className="text-blue-800 font-bold flex items-center gap-2">
            {/* Icon y tế */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" /></svg>
            Thống kê thuốc
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          {/* <div className="text-2xl font-bold text-gray-900">{totalMedicines}</div>
          <div className="text-2xl font-bold text-gray-900">{totalQuantity}</div> */}
          <div className="text-2xl font-bold text-gray-900">
            {totalElements ?? 0}
          </div>
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
            {expiringSoonMedicinesCount}
          </div>
          <p className="text-xs text-gray-500">Trong 30 ngày</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicineStats;