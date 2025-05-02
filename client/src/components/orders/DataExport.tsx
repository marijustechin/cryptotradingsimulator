import { FaRegFileExcel, FaRegFilePdf } from "react-icons/fa";
import { IOpenOrder, IOrdersHistory } from "../../types/order";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import toast from "react-hot-toast";
import HelperService from "../../services/HelperService";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { useTranslation } from "react-i18next";

interface DataExportProps {
  openOrders?: IOpenOrder[] | null;
  ordersHistory?: IOrdersHistory[] | null;
}

export const DataExport = ({ openOrders, ordersHistory }: DataExportProps) => {
  const { t } = useTranslation();

  const exportToPdf = async () => {
    const pdf = new jsPDF();

    if (openOrders) {
      if (openOrders.length === 0) {
        toast.error("No data to export");
        return;
      }

      pdf.setProperties({ title: "Open Orders" });
      pdf.setFontSize(18);
      pdf.text("Orders History", 14, 20);
      pdf.setFontSize(12);
      pdf.text(`Date: ${new Date().toLocaleString()}`, 14, 28);

      const logoBase64 = await HelperService.getBase64FromUrl(
        "http://localhost:5173/logo.png"
      );

      pdf.addImage(logoBase64, "PNG", 170, 10, 20, 20);

      const tableHead = [
        "Market",
        "Order Type",
        "Direction",
        "Entry Price",
        "Order Qty",
        "Order Time",
        "Order Value",
      ];

      const tableBody = openOrders.map((order) => [
        order.assetName,
        order.ord_type,
        order.ord_direct,
        order.triggerPrice,
        order.amount,
        order.open_date,
        HelperService.formatCurrency(order.amount * order.triggerPrice),
      ]);

      autoTable(pdf, {
        startY: 35,
        headStyles: { fillColor: [112, 8, 231] },
        head: [tableHead],
        body: tableBody,
      });

      pdf.save(`open-orders-${new Date().toISOString()}.pdf`);
    }

    // order history
    if (ordersHistory) {
      if (ordersHistory.length === 0) {
        toast.error("No data to export");
      }

      pdf.setProperties({ title: "Orders History" });
      pdf.setFontSize(18);
      pdf.text("Orders History", 14, 20);
      pdf.setFontSize(12);
      pdf.text(`Date: ${new Date().toLocaleString()}`, 14, 28);

      const logoBase64 = await HelperService.getBase64FromUrl(
        "http://localhost:5173/logo.png"
      );

      pdf.addImage(logoBase64, "PNG", 170, 10, 20, 20);

      const tableHead = [
        "Market", // assetId
        "Order type", // ord_type
        "Direction", // ord_direct
        "Order Price", // orderPrice
        "Order Qty", // amount
        "Order Time", // open_date
        "Order Value", // calculated: orderPrice * amount
      ];

      const tableBody = ordersHistory.map((order) => [
        order.assetId,
        order.ord_type,
        order.ord_direct,
        HelperService.formatCurrency(order.price),
        order.amount,
        HelperService.formatDate(order.closed_date),
        HelperService.formatCurrency(order.price * order.amount),
      ]);

      autoTable(pdf, {
        startY: 35,
        headStyles: { fillColor: [112, 8, 231] },
        head: [tableHead],
        body: tableBody,
      });

      pdf.save(`orders-history-${new Date().toISOString()}.pdf`);
    }
  };

  const exportToXls = async () => {
    if (openOrders) {
      if (openOrders.length === 0) {
        toast.error("No data to export");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Open Orders");

      worksheet.columns = [
        { header: "Market", key: "market", width: 15 },
        { header: "Order Type", key: "ord_type", width: 15 },
        { header: "Direction", key: "ord_direct", width: 12 },
        { header: "Entry Price", key: "price", width: 15 },
        { header: "Order Qty", key: "qty", width: 12 },
        { header: "Order Time", key: "time", width: 22 },
        { header: "Order Value", key: "value", width: 15 },
      ];

      openOrders.forEach((order) => {
        worksheet.addRow({
          market: order.assetName,
          ord_type: order.ord_type,
          ord_direct: order.ord_direct,
          price: HelperService.formatCurrency(order.triggerPrice),
          qty: order.amount,
          time: HelperService.formatDate(order.open_date),
          value: HelperService.formatCurrency(
            order.amount * order.triggerPrice
          ),
        });
      });

      worksheet.getRow(1).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `open-orders-${new Date().toISOString()}.xlsx`);
    }
    if (ordersHistory) {
      if (ordersHistory.length === 0) {
        toast.error("No data to export");
        return;
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Orders History");

      worksheet.columns = [
        { header: "Market", key: "market", width: 15 },
        { header: "Order Type", key: "orderType", width: 15 },
        { header: "Direction", key: "direction", width: 12 },
        { header: "Order Price", key: "orderPrice", width: 15 },
        { header: "Order Qty", key: "amount", width: 12 },
        { header: "Order Time", key: "orderTime", width: 22 },
        { header: "Order Value", key: "orderValue", width: 18 },
      ];

      ordersHistory.forEach((order) => {
        worksheet.addRow({
          market: order.assetId,
          orderType: order.ord_type,
          direction: order.ord_direct,
          orderPrice: HelperService.formatCurrency(order.price),
          amount: order.amount,
          orderTime: HelperService.formatDate(order.closed_date),
          orderValue: HelperService.formatCurrency(order.price * order.amount),
        });
      });

      worksheet.getRow(1).font = { bold: true };

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `orders-history-${new Date().toISOString()}.xlsx`);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <p>{t("export_orders")}</p>
      <button
        onClick={exportToXls}
        className="cursor-pointer"
        aria-label="Export to XLS"
      >
        <FaRegFileExcel
          className="text-emerald-500 hover:text-emerald-400"
          size={24}
        />
      </button>
      <button
        onClick={exportToPdf}
        className="cursor-pointer"
        aria-label="Export to PDF"
      >
        <FaRegFilePdf className="text-rose-600 hover:text-rose-500" size={24} />
      </button>
    </div>
  );
};
