import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Calendar, Clock, MapPin, BadgeCheck, Info, Calendar as CalendarIcon, Package, Layers, User, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import campaignService from '../../api/services/campain.service';
import { useNavigate, useLocation } from "react-router-dom";
import medicalService from '../../api/services/medical.service';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const StaticCampaign = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const campaignId = location.state?.campaignId;
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [statistics, setStatistics] = useState(null);

    const statusOrder = {
        'APPROVED': 0, // Đang diễn ra
        'PENDING': 1,  // Chờ duyệt
        'DONE': 2      // Đã xong
    };

    useEffect(() => {
        if (!campaignId) {
            setStatistics(null);
            setError('Không tìm thấy ID chiến dịch. Vui lòng chọn chiến dịch từ danh sách.');
            return;
        }
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                setError(null);
                const stats = await medicalService.getHealthCheckStatistics(campaignId);
                setStatistics(stats);
            } catch (err) {
                setError('Không thể tải thống kê consent.');
            } finally {
                setLoading(false);
            }
        };
        fetchStatistics();
    }, [campaignId]);

    const rawData = statistics ? [
        { name: 'Đã đồng ý', count: statistics.totalAgreed },
        { name: 'Đã từ chối', count: statistics.totalRejected },
        { name: 'Chờ phản hồi', count: statistics.totalPending },
        { name: 'Đã hoàn thành', count: statistics.totalDone },
    ] : [];

    const convertedData = rawData.map(item => ({
        name: item.name,
        value: statistics.totalInvited ? Number(((item.count / statistics.totalInvited) * 100).toFixed(2)) : 0,
        raw: item.count
    }));

    const pieData = statistics ? [
        { name: 'Đã mời', value: statistics.totalInvited },
        { name: 'Đã đồng ý', value: statistics.totalAgreed },
        { name: 'Đã từ chối', value: statistics.totalRejected },
        { name: 'Chờ phản hồi', value: statistics.totalPending },
        { name: 'Đã hoàn thành', value: statistics.totalDone },
    ] : [];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const LABELS = ['Đã đồng ý', 'Đã từ chối', 'Chờ phản hồi', 'Đã hoàn thành'];

    const filteredCampaigns = campaigns
        .filter(campaign =>
            campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (campaign.targetGrade + '').includes(searchTerm)
        )
        .sort((a, b) => {
            const orderA = statusOrder[a.status] !== undefined ? statusOrder[a.status] : 99;
            const orderB = statusOrder[b.status] !== undefined ? statusOrder[b.status] : 99;
            return orderA - orderB;
        });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Thống kê consent chiến dịch</h1>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => navigate(-1)} className="btn-primary">
                        Quay lại
                    </Button>
                </div>
            </div>
            {error && (
                <div className="text-red-500 font-semibold mb-4">{error}</div>
            )}
            {loading && (
                <div className="text-blue-500 font-semibold mb-4">Đang tải thống kê...</div>
            )}
            {statistics && (
                <div className="w-full max-w-none mt-4 p-6 md:p-10 rounded flex flex-col md:flex-row gap-8 items-center min-h-[500px] bg-white">
                    <div className="w-full md:w-1/2 flex justify-center min-h-[500px]">
                        <ResponsiveContainer width="100%" height={350} minWidth={300} minHeight={300}>
                            <PieChart>
                                <Pie
                                    data={convertedData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    // label={({ name, value }) => `${name}: ${value}%`}
                                >
                                    {convertedData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name, props) => [`${value}% (${props.payload.raw} người)`, name]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <h2 className="font-bold text-xl text-blue-700 mb-2">Chi tiết thống kê consent</h2>
                        <ul className="text-lg text-gray-800 space-y-2">
                            <li><span className="font-semibold text-blue-600">Tổng số được mời:</span> {statistics.totalInvited} người</li>
                            <li><span className="font-semibold text-green-600">Đã đồng ý:</span> {statistics.totalAgreed} người</li>
                            <li><span className="font-semibold text-red-600">Đã từ chối:</span> {statistics.totalRejected} người</li>
                            <li><span className="font-semibold text-yellow-600">Chờ phản hồi:</span> {statistics.totalPending} người</li>
                            <li><span className="font-semibold text-purple-600">Đã hoàn thành:</span> {statistics.totalDone} người</li>
                        </ul>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default StaticCampaign; 