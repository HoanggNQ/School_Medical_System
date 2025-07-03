import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CampaignForm = ({ formData, setFormData }) => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
                <Label htmlFor="name">Tên chiến dịch</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nhập tên chiến dịch"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chiến dịch"
                />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu(phải sau ngày hôm nay ít nhất 30 ngày )</Label>
                <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="targetGrade">Khối lớp</Label>
                <Input
                    id="targetGrade"
                    type="number"
                    min={0}
                    value={formData.targetGrade}
                    onChange={(e) => setFormData({ ...formData, targetGrade: e.target.value })}
                    placeholder="0 = toàn trường, 10, 11, ..."
                />
            </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
                <Label htmlFor="location">Địa điểm</Label>
                <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Địa điểm tổ chức"
                />
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="requiredEquipment">Thiết bị yêu cầu</Label>
            <Input
                id="requiredEquipment"
                value={formData.requiredEquipment}
                onChange={(e) => setFormData({ ...formData, requiredEquipment: e.target.value })}
                placeholder="Nhập thiết bị y tế, vật tư..."
            />
        </div>
    </div>
);

export default CampaignForm;