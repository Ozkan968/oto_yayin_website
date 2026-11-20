# Oto Yayın — Video İçerik Yönetim Platformu

Oto Yayın, video içeriklerini tek bir yerden yönetmenize yardımcı olan Windows masaüstü uygulamasıdır. Yerel bilgisayarınızda video dosyalarını düzenlemenizi, yapay zeka destekli metin hazırlama araçlarıyla başlık ve açıklamalar oluşturmanızı ve sosyal medya platformlarının resmi API'leri üzerinden yayın iş akışını yönetmenizi sağlar.

> **Önemli Not:** Oto Yayın bağımsız bir masaüstü yazılımıdır. YouTube, TikTok veya Instagram tarafından geliştirilmemiş ya da onaylanmış değildir.

## Özellikler

- **Yerel Video Yönetimi:** Kullanıcının yerel video klasörlerine erişir ve dosya yollarını, medya bilgilerini (süre, çözünürlük, boyut) ve SHA-256 özetlerini yerel olarak işler.
- **Yapay Zeka Destekli Metin Hazırlama:** Yerel Ollama kurulumunu kullanarak platforma uygun başlık ve açıklamalar hazırlar.
- **Video Kuyruğu ve Takip:** Oluşturulan veya düzenlenen içeriklerin yayın kuyruğunu ve zamanlama durumunu yönetir.
- **Sosyal Platform Entegrasyonları:** Desteklenen sosyal platformların resmi API'leri üzerinden video yayınlama veya taslak gönderme iş akışlarını yönetir (YouTube, TikTok, Instagram).
- **İçerik Düzenleme:** Video dosyalarını yerel bilgisayar üzerinde düzenleme yeteneği sunar.

## Kullanılan Teknolojiler

Verilen kod örneklerine ve proje yapısına dayanarak şu teknolojilerin kullanıldığı tespit edilmiştir:

- **HTML5:** Sayfa yapısı ve semantik etiketler için (`index.html`, `privacy.html` vb.).
- **CSS3 (Modern):** Özelleştirilmiş CSS değişkenleri (`--bg`, `--cyan`), Flexbox, Grid ve backdrop-filter efektleri için (`assets/site.css`).
- **Yerel Yapay Zeka:** Ollama kütüphanesi veya API entegrasyonu.
- **Medya İşleme:** FFmpeg ve FFprobe (PATH içinde olması beklenir).

## Proje Yapısı

```text
oto_yayin_website/
├── assets/
│   ├── oto-yayin-icon.png
│   └── site.css
├── index.html
├── privacy.html
├── support.html
└── terms.html
```

## Kurulum / Çalıştırma

Verilen dosya listesinde ve kod örneklerinde doğrudan kurulum komutları (örn. `npm install`, `pip install`) veya derleme adımları bulunmamaktadır. Proje, statik web sayfaları (`index.html` vb.) içerdiği için sunucu gerektirmez ancak uygulamanın çalışması için aşağıdaki ön koşulların sağlanması gerektiği destek dokümantasyonunda belirtilmiştir:

1.  **Ollama:** Uygulamanın yerel yapay zeka özelliklerini kullanabilmesi için bilgisayarınızda Ollama'nın çalışıyor olması ve ayarlarda doğru bir adres tanımlanmış olması gerekir.
2.  **FFmpeg:** Video işleme ve kurgu işlemleri için FFmpeg ve FFprobe kurulumunun PATH içinde bulunması gerekmektedir.
3.  **API Anahtarları:** TikTok veya Instagram gibi platformlarla bağlantı kurulabilmesi için Client Key/Secret, OAuth token ve ilgili izin belirteçlerinin doğru yapılandırılmış olması gerekir.

*Not: Bu proje dizini statik web içeriği barındırır. Masaüstü uygulamasının kendisi bu dizinde yer almamaktadır.*

## Kullanım

1.  **İçerik Seçimi:** Yerel video klasörlerini seçerek dosyaları listeyin.
2.  **Metin Oluşturma:** Ollama entegrasyonu üzerinden otomatik başlık ve açıklama taslakları oluşturun.
3.  **Düzenleme:** Taslakları yerel bilgisayarınızda düzenleyin.
4.  **Yayın Kuyruğu:** İçerikleri kuyruğa ekleyin ve zamanlama ayarlarını yapın.
5.  **Yayın:** Sosyal medya platformlarının API'leri üzerinden içeriği yayınlayın veya taslak olarak gönderin.

## Katkıda Bulunma

Bu proje, video içeriklerini yönetmek için geliştirilmiş bağımsız bir masaüstü yazılımıdır. Kod tabanı statik web dosyalarından oluşmaktadır. Yeni özellikler eklemek veya hata bildirmek için destek e-postasına başvurulabilir.

- **Destek:** [GEÇERLİ DESTEK E-POSTASI]
- **Gizlilik Politikası:** Verilerin yerel olarak işlendiği ve hangi verilerin üçüncü taraf hizmetlerle paylaşılabileceği hakkında bilgi için `privacy.html` dosyasını inceleyin.
