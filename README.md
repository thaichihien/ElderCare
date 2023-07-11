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
- Project đã cấu hình quá trình **CI** (Continuous Integration) với Circle CI
## Tham khảo tài liệu :
- [Nest JS Document](https://docs.nestjs.com/)
- [Nest JS Basic with MongoDB](https://dev.to/carlomigueldy/building-a-restful-api-with-nestjs-and-mongodb-mongoose-2165)
- [Status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Nest JS Testing](https://www.tomray.dev/nestjs-unit-testing)
