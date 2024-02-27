const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const XLSX = require('xlsx');
const cors = require('cors');
const multer = require('multer');
const path = require('path'); // 导入path模块

const filename = "record.xlsx";

// 读取xlsx文件
function readExcel(filename) {
    const workbook = XLSX.readFile(filename);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet, { header: 1 });
}



const app = express();
const PORT = process.env.PORT || 1314;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 设置Multer来处理文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const destinationPath = 'imgs';
        cb(null, destinationPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
const upload = multer({ storage: storage });

app.post('/add_message', upload.single('image'), (req, res) => {
    console.log(req.body); // 输出请求体内容，确保能够正确获取到数据
    const content = req.body.content;
    const imageFile = req.file; // 获取上传的图片文件信息
    const date = req.body.date;
    // 如果有图片上传，获取上传的文件信息
    let fileRelativeUrl = null;
    if (imageFile) {
        // 构造文件的相对URL
        fileRelativeUrl = `./imgs/${imageFile.filename}`;
    } else {
        fileRelativeUrl = `./imgs/we/default.jpg`;
    }

    const workbook = XLSX.readFile(filename);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    let xlsxData=XLSX.utils.sheet_to_json(sheet, { header: 1 });
    xlsxData=xlsxData.filter(function(row){
        return row.length>0;
    })
    const newRow = [date, content, fileRelativeUrl];
    xlsxData.push(newRow);
    const newSheet = XLSX.utils.aoa_to_sheet(xlsxData);
    workbook.Sheets[sheetName] = newSheet;
    XLSX.writeFile(workbook, filename);
    console.log('New row added successfully to', filename);
    res.send({imageUrl:fileRelativeUrl});
});

app.get('/get_message', (req, res) => {
    data=readExcel(filename);
    data=data.filter(function(row){
        return row.length>0;
    })
    res.send(data);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
