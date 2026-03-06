# Zeraflix REST API Tasarımı

Zeraflix projesinin gereksinim analizine dayanan REST API tasarımı OpenAPI (Swagger) formatında hazırlanmıştır.

[Zeraflix API YAML Dosyasını Görüntülemek İçin Tıklayınız](zeraflix-api.yml)

---

## OpenAPI Formatında API Tasarımı

Aşağıda projenin tüm uç noktalarını (endpoints) barındıran YAML dosyasının içeriği yer almaktadır:

```yaml
openapi: 3.0.3
info:
  title: Zeraflix API
  version: 1.0.0
  description: >
    Zeraflix film ve dizi izleme platformunun temel API dokümantasyonudur. 
    Bu API, kullanıcı kaydı, içerik listeleme, izleme listesi yönetimi ve 
    kişiselleştirilmiş içerik önerisi gibi işlemleri kapsar.
  contact:
    name: Zehra
    email: zehra@zeraflix.com

servers:
  - url: [https://api.zeraflix.com](https://api.zeraflix.com)
    description: Üretim sunucusu (Production)
  - url: https://localhost:3000
    description: Yerel geliştirme sunucusu (Development)

tags:
  - name: Auth
    description: Kimlik doğrulama ve kayıt işlemleri
  - name: Users
    description: Kullanıcı profili ve listeleri yönetimi
  - name: Contents
    description: Film ve dizi içerikleri yönetimi

security:
  - BearerAuth: []

paths:
  /api/auth/register:
    post:
      tags:
        - Auth
      summary: Kullanıcı Kaydı Olma
      description: Yeni kullanıcıların e-posta ve şifre ile sisteme üye olmasını sağlar.
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AuthInput'
      responses:
        "201":
          description: Kullanıcı başarıyla oluşturuldu

  /api/auth/login:
    post:
      tags:
        - Auth
      summary: Giriş Yapma
      description: Mevcut kullanıcıların sisteme giriş yapmasını sağlar.
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AuthInput'
      responses:
        "200":
          description: Başarılı giriş, token döner

  /api/users/{userId}:
    parameters:
      - name: userId
        in: path
        required: true
        schema:
          type: string
    put:
      tags:
        - Users
      summary: Profil Bilgilerini Güncelleme
      description: Kullanıcının profil bilgilerini değiştirmesini sağlar.
      responses:
        "200":
          description: Profil güncellendi
    delete:
      tags:
        - Users
      summary: Profil Silme
      description: Kullanıcının hesabını sistemden kalıcı olarak siler.
      responses:
        "204":
          description: Profil başarıyla silindi

  /api/contents:
    get:
      tags:
        - Contents
      summary: Film ve Dizi Listeleme
      description: Ana sayfada kategorilere ayrılmış içerikleri gösterir.
      responses:
        "200":
          description: İçerikler listelendi

  /api/contents/search:
    get:
      tags:
        - Contents
      summary: İçerik Arama
      description: Girilen kelimeye göre içerik arar.
      parameters:
        - name: query
          in: query
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Arama sonuçları listelendi

  /api/users/{userId}/list:
    post:
      tags:
        - Users
      summary: Listeye İçerik Ekleme
      description: Kullanıcının izlemek istediği içeriği listesine ekler.
      responses:
        "201":
          description: İçerik listeye eklendi

  /api/users/{userId}/list/{contentId}:
    parameters:
      - name: userId
        in: path
        required: true
        schema:
          type: string
      - name: contentId
        in: path
        required: true
        schema:
          type: string
    delete:
      tags:
        - Users
      summary: Listeden İçerik Çıkarma
      description: Kullanıcının izleme listesinden içerik silmesini sağlar.
      responses:
        "204":
          description: İçerik listeden çıkarıldı

  /api/contents/{contentId}/rating:
    parameters:
      - name: contentId
        in: path
        required: true
        schema:
          type: string
    put:
      tags:
        - Contents
      summary: İçeriğe Puan Verme
      description: Kullanıcının izlediği içeriği değerlendirmesini sağlar.
      responses:
        "200":
          description: Puan kaydedildi

  /api/users/{userId}/history:
    parameters:
      - name: userId
        in: path
        required: true
        schema:
          type: string
    get:
      tags:
        - Users
      summary: İzleme Geçmişi Görüntüleme
      description: Kullanıcının izlediği içerikleri listeler.
      responses:
        "200":
          description: İzleme geçmişi getirildi

  /api/users/{userId}/recommendations:
    parameters:
      - name: userId
        in: path
        required: true
        schema:
          type: string
    get:
      tags:
        - Users
      summary: Kişiselleştirilmiş Öneri Sunma
      description: Kullanıcının geçmişine dayalı yapay zeka destekli içerik önerir.
      responses:
        "200":
          description: Öneriler listelendi

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    AuthInput:
      type: object
      properties:
        email:
          type: string
          example: "zehra@example.com"
        password:
          type: string
          example: "sifre123"
      required:
        - email
        - password
```
