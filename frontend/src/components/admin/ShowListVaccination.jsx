import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar as CalendarIcon, Layers, ClipboardList, BadgeCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import vaccinationService from '../../api/services/vaccination.service';

const ShowListVaccination = () => {
    const [vaccinations, setVaccinations] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const statusOrder = {
        'APPROVED': 0, // Đang diễn ra
        'PENDING': 1, // Chờ duyệt
        'DONE': 2    // Đã xong
    };

    useEffect(() => {
        fetchVaccinations();
    }, []);

    const fetchVaccinations = async () => {
        try {
            setLoading(true);
            const response = await vaccinationService.getAllVaccinations();
            setVaccinations(response || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch vaccination schedules. Please try again later.');
            console.error('Error fetching vaccinations:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredVaccinations = vaccinations
        .filter(vaccination =>
            vaccination.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (vaccination.targetGrade + '').includes(searchTerm)
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
                    <h1 className="text-3xl font-bold text-gray-900">Danh sách lịch tiêm chủng</h1>
                    <p className="text-gray-600 mt-2">Xem các lịch tiêm chủng đã được lập</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => navigate('/show-campaigns')} className="btn-primary">
                        Chiến dịch
                    </Button>
                    <Button onClick={() => navigate('/show-vaccination')} className="btn-secondary">
                        Vaccine
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <CardTitle>Danh sách lịch tiêm chủng</CardTitle>
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm kiếm lịch tiêm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Tên chiến dịch</TableHead>
                                <TableHead>Loại vắc xin</TableHead>
                                <TableHead>Ngày bắt đầu</TableHead>
                                <TableHead>Ngày kết thúc</TableHead>
                                <TableHead>Khối lớp</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredVaccinations.map((vaccination) => (
                                <TableRow
                                    key={vaccination.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/static-vaccination/${vaccination.id}`)}
                                >
                                    <TableCell className="font-medium">{vaccination.id}</TableCell>
                                    <TableCell className="font-medium">{vaccination.name}</TableCell>
                                    <TableCell>{vaccination.vaccineType}</TableCell>
                                    <TableCell>{vaccination.startDate}</TableCell>
                                    <TableCell>{vaccination.endDate}</TableCell>
                                    <TableCell>{Array.isArray(vaccination.targetGrade) ? (vaccination.targetGrade.length === 0 ? 'Toàn trường' : vaccination.targetGrade.join(', ')) : (vaccination.targetGrade === 0 ? 'Toàn trường' : vaccination.targetGrade)}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            vaccination.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            vaccination.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            vaccination.status === 'DONE' ? 'bg-orange-500 text-white' :
                                            vaccination.status === 'REJECTED' ? 'bg-gray-400 text-white' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {vaccination.status === 'PENDING' ? 'Chờ diễn ra' :
                                                vaccination.status === 'APPROVED' ? 'Đang diễn ra' :
                                                vaccination.status === 'DONE' ? 'Đã xong' :
                                                vaccination.status === 'REJECTED' ? 'Đã xóa' :
                                                vaccination.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{vaccination.createdAt}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default ShowListVaccination; 