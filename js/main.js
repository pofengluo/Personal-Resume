/* =========================================================
 *  演示视频接口配置（请在此处填写你的演示视频）
 * =========================================================
 *  支持三种来源：
 *   1) 本地文件：mp4 放在站点根目录（与 index.html 同级）后写文件名，
 *      例如  '图形学演示视频.mp4'  （也可放 assets/videos/ 并写相对路径）
 *   2) 网络 mp4：直接填写可在线播放的 .mp4 链接。
 *   3) 平台链接：Bilibili / YouTube 播放页链接，会自动转成内嵌播放器。
 *
 *  留空（''）时，网页会显示「演示视频（待添加）」占位框，不会报错。
 */
const VIDEOS = {
  graphics: '图形学演示视频.mp4',   // 图形学项目 miniGL 演示视频
  gis:      '水文ocr演示视频.mp4',  // GIS 创新项目（水文 OCR）演示视频
};

(function () {
  'use strict';

  /* ---------- 将平台链接转换为可内嵌地址 ---------- */
  function toEmbedUrl(url) {
    if (!url) return '';
    if (/youtu\.?be/i.test(url)) {
      const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
      if (m) return 'https://www.youtube.com/embed/' + m[1];
    }
    if (/bilibili\.com/i.test(url)) {
      const m = url.match(/(BV[\w]{10})/);
      if (m) return 'https://player.bilibili.com/player.html?bvid=' + m[1] + '&page=1&high_quality=1&autoplay=0';
    }
    return '';
  }

  function isMp4(url) {
    return /\.(mp4|webm|ogg|m4v)(\?.*)?$/i.test(url) || /^blob:/i.test(url);
  }

  /* ---------- 为每个 .video-slot 渲染播放器或占位 ---------- */
  function mountVideos() {
    const slots = document.querySelectorAll('.video-slot');
    slots.forEach(function (slot) {
      const key = slot.getAttribute('data-slot');
      const url = (VIDEOS && VIDEOS[key]) ? VIDEOS[key].trim() : '';
      if (!url) return; // 保留占位框

      const placeholder = slot.querySelector('.video-placeholder');
      const embed = toEmbedUrl(url);
      let playerHtml = '';
      let caption = '';

      if (embed) {
        playerHtml =
          '<iframe class="video-player" src="' + embed +
          '" loading="lazy" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>';
        caption = '演示视频';
      } else if (isMp4(url) || /^https?:/i.test(url)) {
        playerHtml =
          '<video class="video-player" controls preload="metadata" playsinline>' +
          '<source src="' + url + '" />' +
          '您的浏览器不支持 video 标签，请直接下载视频文件查看。</video>';
        caption = '演示视频';
      }

      if (playerHtml) {
        slot.innerHTML =
          '<div class="video-frame">' + playerHtml +
          '<p class="video-cap">' + caption + '</p></div>';
      }
    });
  }

  /* ---------- 移动端导航菜单 ---------- */
  function initNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    mountVideos();
    initNav();
  });
})();
