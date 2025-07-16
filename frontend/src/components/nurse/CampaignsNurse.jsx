import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Calendar, Clock, MapPin, BadgeCheck, Info, Calendar as CalendarIcon, Package, Layers, User, ClipboardList, Syringe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import campaignService from '../../api/services/campain.service';
import { useNavigate } from "react-router-dom";
import HealthCheck from './HealthCheck';

const CampaignsNurse = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);

    const statusOrder = {
        'APPROVED': 0, // Đang diễn ra
        'PENDING': 1,  // Chờ duyệt
        'DONE': 2      // Đã xong
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const response = await campaignService.getAllCampaigns();
            console.log(response);
            setCampaigns(response || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users. Please try again later.');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

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

    const handleDeleteCampaign = (campaignId) => {
        setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId));
        toast({
            title: 'Thành công!',
            description: 'Chiến dịch đã được xóa.',
        });
    };

    const handleStartCampaign = async (campaignId) => {
        setLoading(true);
        const campaign = campaigns.find(c => c.id === campaignId);
        if (!campaign) return;
        await campaignService.startCampaign(campaignId);
        fetchCampaigns();
        toast({ title: 'Chiến dịch đã bắt đầu!' });
        setLoading(false);
    };

    const handleEndCampaign = async (campaignId) => {
        setLoading(true);
        const campaign = campaigns.find(c => c.id === campaignId);
        if (!campaign) return;
        await campaignService.endCampaign(campaignId);
        fetchCampaigns();
        toast({ title: 'Chiến dịch đã kết thúc!' });
        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=""
        >
            <div className="flex items-center gap-3 mb-6">
                <span className="bg-blue-200 p-2 rounded-full">
                    <Syringe className="h-7 w-7 text-blue-700" />
                </span>
                <div>
                    <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Quản lý chiến dịch</h1>
                    <p className="text-blue-500 mt-2">Quản lý các chiến dịch tiêm chủng và sự kiện sức khỏe</p>
                </div>
            </div>
            <Card className="bg-white/90 shadow border border-blue-100 rounded-xl">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <CardTitle>Danh sách chiến dịch</CardTitle>
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm kiếm chiến dịch..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
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
                                <TableHead>Địa điểm</TableHead>
                                <TableHead>Khối lớp</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                {/* <TableHead>Người tạo (ID)</TableHead> */}
                                {/* <TableHead>Thao tác</TableHead> */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCampaigns.map((campaign) => (
                                <TableRow
                                    key={campaign.id}
                                    className="cursor-pointer hover:bg-blue-50 transition"
                                    onClick={() => navigate(`/health-check/${campaign.id}`, { state: { campaignStatus: campaign.status } })}
                                >
                                    <TableCell className="font-medium">{campaign.id}</TableCell>
                                    <TableCell className="font-medium">{campaign.name}</TableCell>
                                    <TableCell>{campaign.location}</TableCell>
                                    <TableCell>{campaign.targetGrade === 0 ? 'Toàn trường' : `Khối ${campaign.targetGrade}`}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1
                                            ${campaign.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            campaign.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            campaign.status === 'DONE' ? 'bg-blue-100 text-blue-800' :
                                            campaign.status === 'REJECTED' ? 'bg-gray-400 text-white' :
                                            'bg-gray-100 text-gray-800'}
                                        `}>
                                            <BadgeCheck className="h-3 w-3 text-blue-500" />
                                            {campaign.status === 'PENDING' ? 'Chờ duyệt' :
                                                campaign.status === 'APPROVED' ? 'Đang diễn ra' :
                                                campaign.status === 'REJECTED' ? 'Từ chối' :
                                                campaign.status === 'DONE' ? 'Đã xong' :
                                                campaign.status}
                                    </span>
                                    </TableCell>
                                    <TableCell>{campaign.createdAt}</TableCell>
                                    {/* <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="outline" onClick={() => handleDeleteCampaign(campaign.id)}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                            {(campaign.status === 'PENDING' || campaign.status === 'SCHEDULED') && (
                                                <Button size="sm" className="bg-green-500 text-white hover:bg-green-600" onClick={() => handleStartCampaign(campaign.id)} disabled={loading}>
                                                    Bắt đầu chiến dịch
                                                </Button>
                                            )}
                                            {campaign.status === 'APPROVED' && (
                                                <Button size="sm" className="bg-red-500 text-white hover:bg-red-600" onClick={() => handleEndCampaign(campaign.id)} disabled={loading}>
                                                    Kết thúc chiến dịch
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            {selectedCampaignId && (
                <div>
                    <button
                        onClick={() => setSelectedCampaignId(null)}
                        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
                    >
                        Quay lại danh sách
                    </button>
                    <HealthCheck campaignId={selectedCampaignId} />
                </div>
            )}
        </motion.div>
    );
};

export default CampaignsNurse; 