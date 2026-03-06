# Zehra'nın REST API Metotları

**API Test Videosu:** [Proje bitiminde eklenecek]

## 1. Kullanıcı Kaydı Olma
- **Endpoint:** `POST /auth/register`
- **Request Body:** ```json
  {
    "email": "zehra@example.com",
    "password": "Guvenli123!",
    "firstName": "Zehra",
    "lastName": "Dilşen"
  }
  ```
- **Response:** `201 Created` - Kullanıcı başarıyla oluşturuldu

## 2. Giriş Yapma
- **Endpoint:** `POST /auth/login`
- **Request Body:** ```json
  {
    "email": "zehra@example.com",
    "password": "Guvenli123!"
  }
  ```
- **Response:** `200 OK` - Başarılı giriş, Bearer Token döndürüldü

## 3. Profil Bilgilerini Güncelleme
- **Endpoint:** `PUT /users/{userId}`
- **Path Parameters:** - `userId` (string, required) - Kullanıcı ID'si
- **Request Body:** ```json
  {
    "firstName": "Zehra",
    "lastName": "Dilşen",
    "language": "tr",
    "avatarUrl": "[https://zeraflix.com/avatars/zehra.jpg](https://zeraflix.com/avatars/zehra.jpg)"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcı başarıyla güncellendi

## 4. Profil Silme
- **Endpoint:** `DELETE /users/{userId}`
- **Path Parameters:** - `userId` (string, required) - Kullanıcı ID'si
- **Authentication:** Bearer Token gerekli (Kendi hesabını silme yetkisi)
- **Response:** `204 No Content` - Kullanıcı başarıyla silindi

## 5. Film ve Dizi Listeleme
- **Endpoint:** `GET /contents`
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - İçerikler kategorilere göre başarıyla listelendi

## 6. İçerik Arama
- **Endpoint:** `GET /contents/search`
- **Query Parameters:** - `query` (string, required) - Aranacak film/dizi veya oyuncu kelimesi
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Arama sonuçları başarıyla getirildi

## 7. Listeye İçerik Ekleme
- **Endpoint:** `POST /users/{userId}/list`
- **Path Parameters:** - `userId` (string, required) - Kullanıcı ID'si
- **Request Body:** ```json
  {
    "contentId": "film_98765"
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `201 Created` - İçerik izleme listesine başarıyla eklendi

## 8. Listeden İçerik Çıkarma
- **Endpoint:** `DELETE /users/{userId}/list/{contentId}`
- **Path Parameters:** - `userId` (string, required) - Kullanıcı ID'si
  - `contentId` (string, required) - İçerik ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `204 No Content` - İçerik listeden başarıyla çıkarıldı

## 9. İçeriğe Puan Verme
- **Endpoint:** `PUT /contents/{contentId}/rating`
- **Path Parameters:** - `contentId` (string, required) - İçerik ID'si
- **Request Body:** ```json
  {
    "rating": 5
  }
  ```
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Kullanıcı puanı başarıyla kaydedildi

## 10. İzleme Geçmişi Görüntüleme
- **Endpoint:** `GET /users/{userId}/history`
- **Path Parameters:** - `userId` (string, required) - Kullanıcı ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - İzleme geçmişi verileri başarıyla getirildi

## 11. Kişiselleştirilmiş Öneri Sunma
- **Endpoint:** `GET /users/{userId}/recommendations`
- **Path Parameters:** - `userId` (string, required) - Kullanıcı ID'si
- **Authentication:** Bearer Token gerekli
- **Response:** `200 OK` - Algoritma tabanlı içerik önerileri başarıyla getirildi
