"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Papa from "papaparse";
import DataTable from "@/components/DataTable";
import { useToast } from "@/hooks/use-toast";
import { MergedData } from "@/types";

type Request = {
  "Reference Number": string;
  Surnames: string;
  ForeName: string;
  "NID Number": string;
  "Phone Number": string;
  "Approval Status": string;
};

type Order = {
  NationalID: string;
  BillID: string;
  Status: string;
};

export default function Home() {
  const [mergedData, setMergedData] = useState<MergedData[]>([]);
  const { toast } = useToast();

  const processFiles = async (requestFile: File, orderFile: File) => {
    const parseFile = (file: File): Promise<any[]> => {
      return new Promise((resolve) => {
        Papa.parse(file, {
          header: true,
          complete: (results) => resolve(results.data),
        });
      });
    };

    try {
      const [requests, orders] = await Promise.all([
        parseFile(requestFile),
        parseFile(orderFile),
      ]);

      const merged = requests.map((req: Request) => {
        const matchingOrder = orders.find(
          (order: Order) => order.NationalID === req["NID Number"]
        );

        return {
          refNo: req["Reference Number"] || "N/A",
          fullName: `${req.Surnames || ""} ${req.ForeName || ""}`.trim(),
          nid: req["NID Number"] || "N/A",
          phoneNumber: req["Phone Number"] || "N/A",
          approvalStatus: req["Approval Status"] || "N/A",
          billNumber: matchingOrder?.BillID || "-",
          orderStatus: matchingOrder?.Status || "N/A",
        };
      });

      setMergedData(merged);
      toast({
        title: "Success",
        description: "Files processed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error processing files",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const requestFile = formData.get("requests") as File;
    const orderFile = formData.get("orders") as File;

    if (!requestFile || !orderFile) {
      toast({
        title: "Error",
        description: "Please upload both files",
        variant: "destructive",
      });
      return;
    }

    await processFiles(requestFile, orderFile);
  };

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-3xl font-bold text-center">
          Request & Order Management
        </h1>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl space-y-6 bg-white p-6 rounded-lg shadow-md"
        >
          <div className="space-y-2">
            <Label htmlFor="requests">Requests File (CSV)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="requests"
                name="requests"
                type="file"
                accept=".csv"
                className="cursor-pointer"
              />
              <FileSpreadsheet className="h-5 w-5 text-gray-500" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="orders">Orders File (CSV)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="orders"
                name="orders"
                type="file"
                accept=".csv"
                className="cursor-pointer"
              />
              <FileSpreadsheet className="h-5 w-5 text-gray-500" />
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Upload className="mr-2 h-4 w-4" /> Process Files
          </Button>
        </form>
      </div>

      {mergedData.length > 0 && <DataTable data={mergedData} />}
    </main>
  );
}
