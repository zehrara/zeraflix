# zera'nın Gereksinimleri

Zeraflix projesinin tüm geliştirme süreçleri tek kişi tarafından yürütüldüğü için, projeye ait 11 adet (10 temel, 1 ekstra) gereksinimin tamamı aşağıda listelenmiş ve detaylandırılmıştır.

1. **Kullanıcı Kaydı Olma**
   - **API Metodu:** `POST /auth/register`
   - **Açıklama:** Kullanıcıların sisteme yeni bir hesap oluşturarak dahil olmasını sağlar. Ad, e-posta adresi ve şifre gibi temel bilgilerin toplanıp güvenli bir şekilde kaydedilmesini içerir. Geçerli bir e-posta zorunludur.

2. **Giriş Yapma**
   - **API Metodu:** `POST /auth/login`
   - **Açıklama:** Kayıtlı kullanıcıların e-posta ve şifreleriyle kimlik doğrulaması yaparak sisteme güvenli erişim sağlamasını kapsar. Başarılı giriş sonrasında kullanıcıya oturum yetkisi (token) verilir.

3. **Profil Bilgilerini Güncelleme**
   - **API Metodu:** `PUT /users/{userId}`
   - **Açıklama:** Kullanıcının sistemde kayıtlı olan profil adını, dil tercihini veya profil fotoğrafını değiştirmesine olanak tanır. Güvenlik gereği giriş yapmış olmak şarttır ve kullanıcılar yalnızca kendi profillerini güncelleyebilir.

4. **Profil Silme**
   - **API Metodu:** `DELETE /users/{userId}`
   - **Açıklama:** Kullanıcının hesabını ve ilişkili profil verilerini sistemden kalıcı olarak silmesini sağlar. Bu işlem geri alınamaz ve kullanıcının tüm listeleri silinir. İşlem için giriş yapmış olmak zorunludur.

5. **Film ve Dizi Listeleme**
   - **API Metodu:** `GET /contents`
   - **Açıklama:** Sisteme giriş yapan kullanıcılara, platformda yer alan dizi ve filmlerin kategoriler (Aksiyon, Dram, Komedi vb.) halinde sunulmasını sağlar. Ana sayfada içeriklerin düzenli bir şekilde görüntülenmesi işlemidir.

6. **İçerik Arama**
   - **API Metodu:** `GET /contents/search`
   - **Açıklama:** Kullanıcıların belirli bir film, dizi veya oyuncu adını aratarak istedikleri içeriğe hızlıca ulaşmasını sağlar. Girilen anahtar kelimeye göre veritabanında filtreleme yapar.

7. **Listeye İçerik Ekleme**
   - **API Metodu:** `POST /users/{userId}/list`
   - **Açıklama:** Kullanıcının daha sonra izlemek veya takip etmek istediği içerikleri kendi kişisel "Listem" sayfasına kaydetmesini sağlar. Sadece sisteme giriş yapmış kullanıcılar kendi listelerine ekleme yapabilir.

8. **Listeden İçerik Çıkarma**
   - **API Metodu:** `DELETE /users/{userId}/list/{contentId}`
   - **Açıklama:** Kullanıcının daha önce izleme listesine eklediği bir içeriği, artık listede tutmak istemediğinde sistemden kaldırmasını sağlar. Kullanıcı yalnızca kendi listesine müdahale edebilir.

9. **İçeriğe Puan Verme**
   - **API Metodu:** `PUT /contents/{contentId}/rating`
   - **Açıklama:** Kullanıcıların izledikleri içerikleri değerlendirmesini (beğenme/beğenmeme) ve bu değerlendirmenin sisteme kaydedilmesini sağlar. Bu veri, ileride öneri algoritması için de kullanılır.

10. **İzleme Geçmişi Görüntüleme**
    - **API Metodu:** `GET /users/{userId}/history`
    - **Açıklama:** Kullanıcının daha önce izlemeye başladığı, yarım bıraktığı veya bitirdiği içeriklerin kronolojik bir listesini görüntülemesini sağlar. Kişisel veri olduğu için sadece ilgili kullanıcı erişebilir.

11. **Kişiselleştirilmiş Öneri Sunma**
    - **API Metodu:** `GET /users/{userId}/recommendations`
    - **Açıklama:** Sistemin, kullanıcının izleme geçmişi ve puanlama verilerini analiz ederek, sevebileceği yeni dizi ve filmleri özel olarak listelemesini sağlar. Kullanıcı deneyimini artıran ekstra bir özelliktir.
