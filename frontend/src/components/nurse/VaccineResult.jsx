import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { medicalService } from "@/api/services/medical.service";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const VaccineResult = () => {
  const params = useParams();
  const [campaignId, setCampaignId] = useState(params.campaignId ? Number(params.campaignId) : "");
  const [searchId, setSearchId] = useState(params.campaignId ? String(params.campaignId) : "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (!campaignId) return;
    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await medicalService.getVaccinationResultsByCampaign(campaignId);
        setResults(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Không thể tải danh sách kết quả tiêm chủng.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [campaignId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId && !isNaN(Number(searchId))) {
      setResults([]);
      setCampaignId(Number(searchId));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Danh sách kết quả tiêm chủng</h2>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2 items-center">
        <Input
          type="number"
          min={1}
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          placeholder="Nhập mã chiến dịch (campaignId)"
          className="w-64"
        />
        <Button type="submit" variant="outline">Tìm kiếm</Button>
      </form>
      {loading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-6 text-gray-500">Không có kết quả tiêm chủng nào.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Tên học sinh</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Ngày tiêm</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Tên vaccine</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Năm học</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {results.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 text-sm">{item.id}</td>
                  <td className="px-4 py-2 text-sm">{item.studentName}</td>
                  <td className="px-4 py-2 text-sm">{item.administrationDate}</td>
                  <td className="px-4 py-2 text-sm">{item.vaccineName}</td>
                  <td className="px-4 py-2 text-sm">{item.academicYear}</td>
                  <td className="px-4 py-2 text-sm">
                    <Dialog open={showDialog && selectedStudent?.id === item.id} onOpenChange={setShowDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedStudent(item); setShowDialog(true); }}>
                          Xem chi tiết
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Chi tiết kết quả tiêm chủng</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><b>Tên học sinh:</b> {item.studentName}</div>
                          <div><b>Ngày tiêm:</b> {item.administrationDate}</div>
                          <div><b>Vaccine:</b> {item.vaccineName}</div>
                          <div><b>Vị trí tiêm:</b> {item.injectionSite}</div>
                          <div><b>Người tiêm:</b> {item.administrationByName}</div>
                          <div><b>Ngày tiêm liều tiếp theo:</b> {item.nextDoseDate}</div>
                          <div><b>Ghi chú theo dõi:</b> {item.followUpNotes}</div>
                          <div><b>Phản ứng sau tiêm:</b> {item.reactionNotes}</div>
                          <div><b>Năm học:</b> {item.academicYear}</div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VaccineResult;
