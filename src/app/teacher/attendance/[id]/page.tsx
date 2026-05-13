"use client";
import { useManualMark } from "@/features/attendance/hooks/useAttendanceApi";
import { useCloseSession, useGetLiveSession } from "@/features/session/hooks/useSessionApi";
import { useParams } from "next/navigation";

export default function LiveAttendancePage() {
  const { id } = useParams();
  const { data: records, isLoading } = useGetLiveSession(id as string);
  const { mutate: closeSession, isPending: isClosing } = useCloseSession();
  const { mutate: manualMark } = useManualMark();

  const present = records?.filter(r => r.status === "present").length || 0;
  const absent = records?.filter(r => r.status === "absent").length || 0;
  const total = records?.length || 0;

  if (isLoading) return <div className="p-6">Loading session...</div>;

  return (
    <div className="p-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{present}</p>
          <p className="text-sm text-green-700">Present</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{absent}</p>
          <p className="text-sm text-red-700">Absent</p>
        </div>
        <div className="bg-gray-50 border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-gray-700">{total}</p>
          <p className="text-sm text-gray-600">Total</p>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white border rounded-xl overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-4 text-sm font-medium">Student</th>
              <th className="text-left p-4 text-sm font-medium">Status</th>
              <th className="text-left p-4 text-sm font-medium">Marked By</th>
              <th className="text-left p-4 text-sm font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {records?.map((record) => (
              <tr key={record._id}>
                <td className="p-4">
                  <p className="font-medium">{record.student?.name}</p>
                  <p className="text-sm text-gray-500">{record.student?.email}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${record.status === "present" ? "bg-green-100 text-green-700" :
                      record.status === "late" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"}`}
                  >
                    {record.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500">{record.markedBy}</td>
                <td className="p-4">
                  <select
                    value={record.status}
                    onChange={(e) => manualMark({
                      sessionId: id as string,
                      data: {
                        studentId: record.student._id,
                        status: e.target.value
                      }
                    })}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Close Session */}
      <button
        onClick={() => closeSession(id as string)}
        disabled={isClosing}
        className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium
                   disabled:opacity-50 w-full"
      >
        {isClosing ? "Closing..." : "Close Session & Mark Absent"}
      </button>
    </div>
  );
}