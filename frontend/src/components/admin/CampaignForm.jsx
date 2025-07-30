import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const CampaignForm = ({ formData, setFormData, onCancel, onSubmit, isEdit = false, loading = false, errors = {} }) => (
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
                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chiến dịch"
                />
                {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
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
                {errors.startDate && <div className="text-red-500 text-sm">{errors.startDate}</div>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc</Label>
                <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
                {errors.endDate && <div className="text-red-500 text-sm">{errors.endDate}</div>}
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="targetGrade">Khối lớp</Label>
                <Input
                    id="targetGrade"
                    type="text"
                    value={formData.targetGrade}
                    onChange={(e) => setFormData({ ...formData, targetGrade: e.target.value })}
                    placeholder="1 -> 5"
                />
                {errors.targetGrade && <div className="text-red-500 text-sm">{errors.targetGrade}</div>}
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
                {errors.location && <div className="text-red-500 text-sm">{errors.location}</div>}
            </div>
        </div>
        {onSubmit && (
            <div className="flex justify-end space-x-2 pt-4">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Hủy
                </Button>
                <Button
                    onClick={onSubmit}
                    className="btn-primary"
                    disabled={loading}
                >
                    {isEdit ? 'Cập nhật' : 'Tạo mới'}
                </Button>
            </div>
        )}
    </div>
);

export default CampaignForm;