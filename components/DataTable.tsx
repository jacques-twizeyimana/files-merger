import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type MergedData = {
  refNo: string;
  fullName: string;
  nid: string;
  approvalStatus: string;
  billNumber: string;
  orderStatus: string;
};

export default function DataTable({ data }: { data: MergedData[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference No</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>National ID</TableHead>
            <TableHead>Approval Status</TableHead>
            <TableHead>Bill Number</TableHead>
            <TableHead>Order Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{row.refNo}</TableCell>
              <TableCell>{row.fullName}</TableCell>
              <TableCell>{row.nid}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.approvalStatus === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : row.approvalStatus === "REJECTED"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {row.approvalStatus}
                </span>
              </TableCell>
              <TableCell>{row.billNumber}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    row.orderStatus === "APPROVED"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {row.orderStatus}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}