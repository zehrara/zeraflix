# REST API Görev Dağılımı

Bu doküman, Zeraflix projesinin backend (sunucu tarafı) geliştirme sürecindeki REST API görevlerini ve sorumluluklarını içerir. Proje tek kişi tarafından yürütüldüğü için tüm API uç noktalarının (endpoints) kodlanması ve veritabanı entegrasyonu görevleri Zehra tarafından üstlenilmiştir.

## Görev Listesi ve Durumları

| Görev ID | API Uç Noktası (Endpoint) | Metot | Görev Açıklaması | Sorumlu | Durum |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **API-01** | `/auth/register` | `POST` | Yeni kullanıcı kayıt algoritmalarının yazılması. | Zehra Dilşen| Yapılacak |
| **API-02** | `/auth/login` | `POST` | Kullanıcı giriş ve yetkilendirme (token) işlemleri. | Zehra Dilşen| Yapılacak |
| **API-03** | `/users/{userId}` | `PUT` | Profil güncelleme veritabanı işlemlerinin yazılması. | Zehra Dilşen| Yapılacak |
| **API-04** | `/users/{userId}` | `DELETE` | Hesap ve ilişkili verileri silme kodlarının yazılması. | Zehra Dilşen| Yapılacak |
| **API-05** | `/contents` | `GET` | İçeriklerin veritabanından çekilip listelenmesi. | Zehra Dilşen| Yapılacak |
| **API-06** | `/contents/search` | `GET` | Arama ve filtreleme algoritmalarının oluşturulması. | Zehra Dilşen| Yapılacak |
| **API-07** | `/users/{userId}/list` | `POST` | İzleme listesine kayıt ekleme işlemlerinin yapılması. | Zehra Dilşen| Yapılacak |
| **API-08** | `/users/{userId}/list/{contentId}` | `DELETE`| İzleme listesinden kayıt silme işlemlerinin yapılması. | Zehra Dilşen| Yapılacak |
| **API-09** | `/contents/{contentId}/rating` | `PUT` | Puanlama sisteminin veritabanına entegre edilmesi. | Zehra Dilşen| Yapılacak |
| **API-10** | `/users/{userId}/history` | `GET` | İzleme geçmişini getiren sorguların yazılması. | Zehra Dilşen| Yapılacak |
| **API-11** | `/users/{userId}/recommendations`| `GET` | Öneri algoritması için veri çekme işlemlerinin yazılması.| Zehra Dilşen| Yapılacak |

---
*Not: Geliştirme süreci başladığında tablodaki "Durum" sütunu (Yapılıyor, Tamamlandı vb.) güncellenecektir.*
