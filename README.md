# Elder Care - Hệ thống quản lý nhân viên chăm sóc người già tại nhà

## Front end
- Khởi tạo project react tại thư mục client
## Back end

### Hướng dẫn chạy server
- Mở cmd, vào thư mục server:
```
cd server
```
- Tải tất cả dependencies:
```
npm i
```
- Chạy server (chế độ dev):
```
npm run start:dev
```
- Khi xuất hiện dòng bên dưới thì coi như thành công
```
server is ready at http://localhost:3000
```
### Kết nối csdl Mongo
- Sửa file `.env.example` thành `.env`
- Thêm các biến môi trường do leader chia sẻ
### Module Mẫu:
- Tham khảo một module mẫu là **tutorial**, đã có comment chi tiết, đầy đủ ở từng file
- Module này cung cấp RESTful API cơ bản
### Quy tắc
- **Không sửa** các file như ***main.ts***, ***app.module.ts***, ***app.controller.ts***,... có nhu cầu config thì nói với leader
- Mỗi người sẽ chỉ làm trên mỗi module (folder) của mình
- Project đã cấu hình quá trình **CI** (Continuous Integration) với Circle CI, yêu cầu mỗi người làm việc trên brach riêng trước khi merge vào brach main
### Hướng dẫn làm việc với Circle CI, Github:
- Tạo và đổi branch làm việc của mình (khác với main)
```
git checkout -b my_branch
```
- Code theo công việc, module được giao, **nên** tìm hiểu về [**Unit Test trong Nest JS**](https://www.tomray.dev/nestjs-unit-testing) và viết vài unit test, thực hiện test local trước khi commit
- Sau khi xong thì thực hiện commit và push
```
git add .
git commit -m "Finish module Tutorial"
git push -u origin my_branch
```
- Mở **Github**, vào project (repository) vừa mới push, sẽ hiện thông báo dạng `my_branch` vừa push, thì nhấn vào nút **Compare & pull request**
- Tại đây thêm title, comment cho dễ hiểu rồi **Create pull request**
- Sau khi tạo pull request, sẽ thấy quá trình tự động set up, test này nọ của **Circle CI** bên dưới, **chỉ merge được** vào branch ***main*** khi đã pass hết test của Circle CI

## Tham khảo tài liệu :
- [Nest JS Document](https://docs.nestjs.com/)
- [Nest JS Basic with MongoDB](https://dev.to/carlomigueldy/building-a-restful-api-with-nestjs-and-mongodb-mongoose-2165)
- [Status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Nest JS Testing](https://www.tomray.dev/nestjs-unit-testing)
