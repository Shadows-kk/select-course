import html2canvas from "html2canvas";
import jspdf from "jspdf";
import * as XLSX from "xlsx";
export function exportPDF(dom, name) {
  html2canvas(dom, {
    scale: 2, //缩放比例,默认为1
    allowTaint: false, //是否允许跨域图像污染画布
    useCORS: true, //是否尝试使用CORS从服务器加载图像
  }).then((canvas) => {
    // //将canvas转为base64格式
    // var imgUri = canvas.toDataURL('image/png')
    // // 图片的大小
    // const pdfWidth = 210
    // // a4 纸大小 210mm*297mm, 页边距上下左右分别为 25mm
    // const pdf = new jspdf('', 'pt', 'a4')
    // pdf.addImage(
    //   imgUri,
    //   'JPEG',
    //   0,
    //   0,
    //   595.28,
    //   ((595.28 - 20) / canvas.width) * canvas.height
    // )
    var contentWidth = canvas.width;
    var contentHeight = canvas.height;

    //一页pdf显示html页面生成的canvas高度;
    var pageHeight = (contentWidth / 592.28) * 841.89;
    //未生成pdf的html页面高度
    var leftHeight = contentHeight;
    //页面偏移
    var position = 0;
    //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
    var imgWidth = 595.28;
    var imgHeight = (592.28 / contentWidth) * contentHeight;

    var pageData = canvas.toDataURL("image/jpeg", 1.0);

    var doc = new jspdf("", "pt", "a4");

    //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
    //当内容未超过pdf一页显示的范围，无需分页
    if (leftHeight < pageHeight) {
      doc.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
    } else {
      while (leftHeight > 0) {
        doc.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
        leftHeight -= pageHeight;
        position -= 841.89;
        //避免添加空白页
        if (leftHeight > 0) {
          doc.addPage();
        }
      }
    }

    // 保存
    doc.save(`${name}.pdf`);
  });
}
// 读取本地excel文件
export function readWorkbookFromLocalFile(file, callback) {
  var reader = new FileReader();
  reader.onload = function (e) {
    var data = e.target.result;
    // 读取二进制的excel
    var workbook = XLSX.read(data, { type: "binary" });
    if (callback) callback(workbook);
  };
  reader.readAsBinaryString(file);
}
// 读取excel远程文件
function readWorkbookFromRemoteFile(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("get", url, true);
  xhr.responseType = "arraybuffer";
  xhr.onload = function (e) {
    if (xhr.status == 200) {
      var data = new Uint8Array(xhr.response);
      var workbook = XLSX.read(data, { type: "array" });
      if (callback) callback(workbook);
    }
  };
  xhr.send();
}
