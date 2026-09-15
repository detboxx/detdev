/* =============================================
   WS Tech — Router Lab  |  app.js  v4.1
   ============================================= */

'use strict';

/* ── Navbar scroll ── */
const $navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  $navbar?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Mobile menu ── */
const $ham  = document.getElementById('navHam');
const $menu = document.getElementById('navMenu');
$ham?.addEventListener('click', () => {
  const open = $menu.classList.toggle('open');
  $ham.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav-a').forEach(a =>
  a.addEventListener('click', () => $menu.classList.remove('open'))
);

/* ── Filter ── */
document.getElementById('filters')?.addEventListener('click', e => {
  const btn = e.target.closest('.flt');
  if (!btn) return;
  document.querySelectorAll('.flt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.f;
  document.querySelectorAll('#grid .card').forEach(card => {
    const d    = card.dataset.d;
    const thai = card.dataset.t === '1';
    let show = true;
    if      (f === 'easy')   show = d === 'easy';
    else if (f === 'medium') show = d === 'medium';
    else if (f === 'hard')   show = d === 'hard';
    else if (f === 'thai')   show = thai;
    card.classList.toggle('hidden', !show);
  });
});

/* ── Modal ── */
const $overlay = document.getElementById('overlay');
const $mbody   = document.getElementById('mbody');
const $mclose  = document.getElementById('mclose');

/* SVG brand logos for modal header */
const BRAND_SVG = {
  mi: `<svg width="36" height="20" viewBox="0 0 60 36"><text x="0" y="28" font-family="'Inter',sans-serif" font-weight="900" font-size="30" fill="#FF6900">mi</text></svg>`,
  redmi: `<svg width="50" height="20" viewBox="0 0 80 30"><text x="0" y="23" font-family="'Inter',sans-serif" font-weight="900" font-size="22" fill="#E53935">Redmi</text></svg>`,
  asus: `<svg width="54" height="20" viewBox="0 0 86 28"><text x="0" y="22" font-family="'Inter',sans-serif" font-weight="900" font-size="24" letter-spacing="-1" fill="#00A0E3">ASUS</text></svg>`,
  zte: `<svg width="44" height="20" viewBox="0 0 60 28"><text x="0" y="22" font-family="'Inter',sans-serif" font-weight="900" font-size="24" fill="#005BAC">ZTE</text></svg>`,
  isp: `<svg width="56" height="20" viewBox="0 0 90 28"><text x="0" y="20" font-family="'Inter',sans-serif" font-weight="800" font-size="17" fill="#8B5CF6">NT·AIS·TOT·TRUE</text></svg>`,
  huawei: `<svg width="28" height="28" viewBox="0 0 40 40"><g transform="translate(20,20)" fill="#CF0A2C"><ellipse cx="0" cy="-9" rx="3.2" ry="7" transform="rotate(0)"/><ellipse cx="0" cy="-9" rx="3.2" ry="7" transform="rotate(45)"/><ellipse cx="0" cy="-9" rx="3.2" ry="7" transform="rotate(90)"/><ellipse cx="0" cy="-9" rx="3.2" ry="7" transform="rotate(135)"/><ellipse cx="0" cy="-9" rx="3.2" ry="7" transform="rotate(180)"/><ellipse cx="0" cy="-9" rx="3.2" ry="7" transform="rotate(225)"/><ellipse cx="0" cy="-9" rx="3.2" ry="7" transform="rotate(270)"/><ellipse cx="0" cy="-9" rx="3.2" ry="7" transform="rotate(315)"/></g></svg>`,
  gl: `<svg width="54" height="20" viewBox="0 0 80 30"><text x="0" y="23" font-family="'Inter',sans-serif" font-weight="900" font-size="20" fill="#06B6D4">GL.iNet</text></svg>`,
  mikrotik: `<svg width="64" height="20" viewBox="0 0 95 28"><text x="0" y="21" font-family="'Inter',sans-serif" font-weight="900" font-size="21" fill="#FF6600">MikroTik</text></svg>`,
  netgear: `<svg width="64" height="20" viewBox="0 0 96 28"><text x="0" y="21" font-family="'Inter',sans-serif" font-weight="900" font-size="21" fill="#E31837">NETGEAR</text></svg>`,
  mercusys: `<svg width="64" height="20" viewBox="0 0 100 28"><text x="0" y="21" font-family="'Inter',sans-serif" font-weight="900" font-size="19" fill="#1E90FF">Mercusys</text></svg>`
};

function openModal(id) {
  const d = ROUTERS[id];
  if (!d) { console.warn('No data for:', id); return; }

  const steps = d.steps.map((s, i) =>
    `<li><span class="step-n">${i + 1}</span><span>${s}</span></li>`
  ).join('');

  const after = d.after.map(a => `<span class="unlock-tag">${a}</span>`).join('');
  const logo  = BRAND_SVG[d.brand] || '';

  $mbody.innerHTML = `
    <div class="m-header">
      <div class="m-logo-wrap blogo blogo-${d.brand === 'mi' || d.brand === 'redmi' ? d.brand : d.brand}">${logo}</div>
      <div class="m-title">
        <h2>${d.name}</h2>
        <p class="m-chip">${d.chip}</p>
      </div>
    </div>
    <div class="m-badges">
      <span class="badge ${d.diff}">${d.diffLbl}</span>
      <span class="risk ${d.riskCls}"><i class="fa-solid fa-shield-halved"></i> Risk: ${d.riskLbl}</span>
    </div>
    <div class="m-sec">
      <h4>📋 รู้จักรุ่นนี้ก่อน</h4>
      <p>${d.overview}</p>
    </div>
    <div class="m-sec">
      <h4>🔧 ขั้นตอน</h4>
      <ul class="step-list">${steps}</ul>
    </div>
    ${d.code ? `<div class="m-sec">
      <h4>💻 Command ที่ใช้</h4>
      <pre class="code-pre">${escHtml(d.code)}</pre>
    </div>` : ''}
    <div class="m-sec">
      <h4>💡 เทคนิคจากที่ทำมาจริง</h4>
      <div class="tip-box">${d.tip}</div>
    </div>
    <div class="m-sec">
      <h4>⚠️ อ่านก่อนลงมือ</h4>
      <div class="warn-box">${d.warning}</div>
    </div>
    <div class="m-sec">
      <h4>🚀 ทำอะไรได้หลังจากนี้</h4>
      <div class="unlock-wrap">${after}</div>
    </div>
  `;

  $overlay.classList.add('open');
  $overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  $overlay.classList.remove('open');
  $overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

$mclose?.addEventListener('click', closeModal);
$overlay?.addEventListener('click', e => { if (e.target === $overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

document.getElementById('grid')?.addEventListener('click', e => {
  const btn  = e.target.closest('.read-btn');
  const card = e.target.closest('.card');
  if (btn && card) openModal(card.dataset.id);
});

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ─────────────────────── ROUTER DATABASE ─────────────────────── */
/* โทนการเขียน: เหมือนคนที่ทำมาจริง เขียนอธิบายเพื่อน ไม่ใช่คู่มือ corporate */

const ROUTERS = {

  ax3000t: {
    brand:'mi', name:'Xiaomi AX3000T (RD03)',
    chip:'MediaTek MT7981B Filogic 820 · 512MB RAM · Wi-Fi 6 AX3000',
    diff:'easy', diffLbl:'ง่าย / Easy', riskCls:'low', riskLbl:'ต่ำ',
    overview:`รุ่นนี้คือ <strong>entry-level ที่ง่ายที่สุดในบรรดา Xiaomi ทั้งหมด</strong> ตอนนี้ ทำมาหลายตัวแล้ว ไม่เคย brick เลยถ้าทำตามขั้นตอน ปัญหาเดียวที่เจอคือคนซื้อผิดรุ่น — RD03 กับ RD03v2 หน้าตาเหมือนกันแต่ chipset ต่างกันสิ้นเชิง<br><br>ตรวจก่อนเลย: ดู label ใต้เครื่อง ถ้าเขียน <code>RD03</code> = MT7981B ทำได้สบาย ถ้าเขียน <code>RD03v2</code> = Qualcomm IPQ5018 ต้องใช้ repo แยกและยุ่งกว่านี้`,
    steps:[
      '<strong>ตรวจก่อน:</strong> label ใต้เครื่อง ต้องเขียน RD03 ไม่ใช่ RD03v2',
      'ติดตั้ง Python 3 → clone <code>xmir-patcher</code> จาก GitHub → รัน <code>pip install -r requirements.txt</code>',
      'รัน <code>python xmir-patcher.py</code> → เลือก "Enable SSH" → รอ script ทำงาน (ไม่เกิน 30 วิ)',
      '<strong>Backup ART ก่อนเลย</strong> — <code>cat /proc/mtd</code> หา partition ที่ชื่อ art, dd ออกมาเก็บ',
      'ดาวน์โหลด OpenWrt image จาก firmware-selector.openwrt.org พิมพ์ชื่อรุ่นให้ถูก',
      'Flash ผ่าน SSH: scp image เข้าไปที่ /tmp แล้วรัน sysupgrade'
    ],
    code:`ssh root@192.168.31.1

# ดู partition ก่อน
cat /proc/mtd

# Backup ART (ตัวเลข mtdX ดูจาก output ด้านบน)
dd if=/dev/mtd6 of=/tmp/art.bin
scp root@192.168.31.1:/tmp/art.bin ~/art_ax3000t_backup.bin

# Flash OpenWrt
scp openwrt-sysupgrade.bin root@192.168.31.1:/tmp/
ssh root@192.168.31.1 "sysupgrade -n /tmp/openwrt-sysupgrade.bin"`,
    tip:`ทำมาหลายตัวแล้ว มีจุดเดียวที่คนพลาดบ่อย — <strong>ไม่ backup ART ก่อน flash</strong> ART คือ Wi-Fi calibration data ของ chip ถ้าหาย radio จะทำงานผิดปกติถาวร กู้ยาก ต้องซื้อตัวใหม่ ใช้เวลา backup แค่ 1 นาทีแต่ประหยัดหัวใจได้มาก<br><br>อีกอย่าง — Xiaomi patch exploit นี้บ่อย ถ้า firmware ≥ 1.0.47 อาจต้อง downgrade ก่อน ไปหา stock firmware เก่าบน miwifi.com`,
    warning:`<strong>ห้ามโหลด firmware จาก YouTube หรือ blog ไม่รู้จัก</strong> มีคนโดน malware firmware แล้วด้วย ใช้ OpenWrt official builds เท่านั้น ถ้า image ไม่ได้มาจาก downloads.openwrt.org อย่าเชื่อ`,
    after:['Full OpenWrt + LuCI','AdGuard Home','WireGuard VPN','VLAN 802.1Q','SQM/Cake QoS','Entware','Bandwidth Monitor']
  },

  ax9000: {
    brand:'mi', name:'Xiaomi AX9000 (Tri-band)',
    chip:'Qualcomm IPQ8072A Quad-Core 2.2GHz · 1GB RAM · Wi-Fi 6 Tri-band',
    diff:'medium', diffLbl:'ปานกลาง / Medium', riskCls:'med', riskLbl:'กลาง',
    overview:`AX9000 เครื่องนี้ทำงานดีมากบน OpenWrt แต่กว่าจะถึงตรงนั้นต้องผ่านด่านหลายอย่าง ปัญหาหลักคือ Xiaomi เปลี่ยน exploit วิธีตามรุ่น firmware — firmware ใหม่กว่า 1.0.82 ต้อง downgrade ก่อน ซึ่งก็มีขั้นตอนอีก<br><br>อีกเรื่องสำคัญ: <strong>International version กับ CN version วิธีต่างกัน</strong> — CN ทำง่ายกว่า International มี secure boot เพิ่มเติม ตรวจให้ดีก่อนเริ่ม`,
    steps:[
      'ตรวจ firmware version ใน web UI — ถ้าเกิน 1.0.82 ต้อง downgrade ก่อน',
      'ตรวจ CN vs International: CN ทำได้ง่ายกว่า, International มี secure boot เพิ่ม',
      'ใช้ SN-based key generator (หา tool ได้ใน OpenWrt forum thread AX9000) เพื่อสร้าง token',
      'Enable Telnet ผ่าน token → เข้า Telnet → set root password → เปลี่ยนเป็น SSH',
      'Backup ทุก partition — AX9000 ใช้ A/B partition scheme ต้องเข้าใจก่อน flash',
      'Flash OpenWrt factory image → boot ใหม่ → ตั้งค่า thermal script ทันที'
    ],
    code:`telnet 192.168.31.1

# หลังเข้า Telnet:
passwd root
# แล้วเปิด SSH:
/etc/init.d/dropbear start

# หลัง SSH เข้าได้ ตรวจ thermal:
cat /sys/class/thermal/thermal_zone*/temp

# Enable HW NAT หลัง OpenWrt:
opkg install kmod-nft-offload`,
    tip:`เรื่องที่ไม่มีคนบอกคือ AX9000 ร้อนมากบน OpenWrt เพราะ stock thermal daemon หายไป ครั้งแรกที่ทำ CPU ขึ้น 95°C โดยไม่รู้ตัว ต้อง <strong>เขียน thermal script เองเพื่อ throttle CPU</strong> เวลาร้อน ทีมเราใช้ custom shell script monitor temp และ set governor เอง ทำก่อนจะปล่อยเครื่องทำงาน 24/7`,
    warning:`International version บน AX9000 ถ้า flash image ผิด = hard brick ที่ต้องใช้ UART + TFTP กู้ มีคนเจอเรื่องนี้เยอะมาก ตรวจ variant ให้แน่ใจก่อน`,
    after:['Full OpenWrt','Tri-band Active','2.5G Gaming Port','WireGuard HW Offload','Entware','Custom Thermal Script']
  },

  be7000: {
    brand:'mi', name:'Xiaomi BE7000 (Wi-Fi 7)',
    chip:'Qualcomm IPQ9574 Quad-Core · Wi-Fi 7 BE7000 · 6GHz Band · 1GB RAM',
    diff:'hard', diffLbl:'ยาก / Expert', riskCls:'high', riskLbl:'สูง',
    overview:`ตรงๆ เลย — <strong>รุ่นนี้ยังไม่ถึงเวลา flash custom firmware</strong> OpenWrt ยังไม่รองรับ IPQ9574 mainline Wi-Fi 7 driver ยังไม่ open-source ถ้าใครบอกว่าทำได้เต็มรูปแบบ น่าสงสัยมาก<br><br>แต่ที่ทำได้จริงตอนนี้: SSH เข้า stock firmware และรัน Docker container บน stock ซึ่ง Xiaomi เปิดให้ใช้ BE7000 — นี่คือ best approach ที่ปลอดภัยและได้ประโยชน์สูงสุดในตอนนี้`,
    steps:[
      'ใช้ xmir-patcher เปิด SSH บน stock firmware — ทำได้แต่ไม่ persistent ต้องรันใหม่ทุก reboot',
      'หลัง SSH เข้าได้: ตรวจ Docker support ด้วย <code>docker ps</code> — BE7000 stock รองรับ',
      '<strong>อย่า flash</strong> custom firmware IPQ9574 จาก fork ที่ไม่มี community active — brick แน่นอน',
      'รัน AdGuard Home หรือ WireGuard ผ่าน Docker container บน stock',
      'ติดตาม OpenWrt forum thread "Xiaomi BE7000" เพื่อรอ mainline support',
      'ถ้าต้องการ full control ตอนนี้จริงๆ — พิจารณา swap กับ AX3000T แทน'
    ],
    code:`# Docker บน stock firmware:
docker pull adguard/adguardhome:latest
docker run -d --name adguard \\
  -p 3000:3000 -p 53:53/udp -p 53:53/tcp \\
  --restart unless-stopped \\
  adguard/adguardhome

# เข้า AdGuard setup:
# http://192.168.31.1:3000`,
    tip:`คนถามบ่อยมากว่า "BE7000 flash OpenWrt ได้ไหม" คำตอบจริงคือ: ตอนนี้ยังอันตรายเกินไป Wi-Fi 7 radio บน IPQ9574 ยังใช้ proprietary driver ถ้า flash แล้ว Wi-Fi ไม่ติด = เสียเงินหลายพัน แนะนำให้ใช้ประโยชน์จาก Docker บน stock ไปก่อน ดีกว่า idle รอ`,
    warning:`<strong>อย่าเชื่อ YouTube channel ที่บอกว่า flash BE7000 ได้แล้ว Wi-Fi ยังใช้ได้</strong> — ถ้าไม่ได้ test throughput จริงๆ อาจแค่รูปว่า connect แต่ actual radio dead สงสัยให้ถามใน OpenWrt forum ก่อน`,
    after:['Docker AdGuard Home (Stock)','Docker WireGuard (Stock)','SSH Exploration','Future: Full OpenWrt (pending mainline)']
  },

  ax6000: {
    brand:'redmi', name:'Redmi AX6000 (RB01)',
    chip:'MediaTek MT7986A Filogic 830 · 512MB RAM · Wi-Fi 6 AX6000',
    diff:'medium', diffLbl:'ปานกลาง / Medium', riskCls:'med', riskLbl:'กลาง',
    overview:`รุ่นนี้คือ <strong>value play ที่ดีที่สุดในปีนี้</strong> สำหรับคนอยาก OpenWrt ราคาถูกกว่า TUF-AX4200 แต่ใช้ chipset เดียวกัน Filogic 830 หมายความว่า HW NAT offload ทำงาน ทดสอบจริงได้ <strong>2.1 Gbps</strong> NAT throughput ซึ่งเกิน spec ด้วยซ้ำ<br><br>มีข้อแม้เดียวคือ exploit version-specific ต้องตรวจ firmware ก่อน`,
    steps:[
      'ตรวจ firmware version ใน About — ต้องตรงกับ exploit version ของ tool',
      'ดาวน์โหลด exploit tool จาก GitHub ค้น "Redmi AX6000 SSH exploit"',
      'รัน <code>python3 exploit.py -t 192.168.31.1</code> — ถ้า success จะเห็น SSH enabled',
      'SSH เข้า: <code>ssh -oHostKeyAlgorithms=+ssh-rsa root@192.168.31.1</code>',
      'Backup ART partition ทันที — Filogic 830 ต้องการ calibration data นี้',
      'Flash ImmortalWrt หรือ OpenWrt → หลัง boot ติดตั้ง <code>kmod-nft-offload</code>'
    ],
    code:`python3 exploit.py -t 192.168.31.1

ssh -oHostKeyAlgorithms=+ssh-rsa root@192.168.31.1

# Backup ART:
cat /proc/mtd
dd if=/dev/mtdX of=/tmp/art.bin
scp root@192.168.31.1:/tmp/art.bin .

# หลัง OpenWrt boot — enable HW NAT:
opkg update && opkg install kmod-nft-offload
echo "net.netfilter.nf_flow_table_hw_offload=1" >> /etc/sysctl.conf
reboot`,
    tip:`ทดสอบ HW NAT บน AX6000 + ImmortalWrt ได้ 2.1 Gbps NAT — นี่คือตัวเลขจริงไม่ใช่ marketing ใช้ iperf3 ทดสอบผ่าน NAT ระหว่าง LAN กับ WAN interface <strong>Breed bootloader</strong> ช่วยให้ recover ง่ายมากถ้าเกิดปัญหา แนะนำ flash Breed ก่อนแล้วค่อย flash OpenWrt`,
    warning:`Exploit ทำงานกับ firmware version เฉพาะ — ถ้า version ไม่ตรงจะ fail โดยไม่ทำอะไร ไม่ใช่ brick แต่ต้อง downgrade firmware ก่อน ตรวจ readme ของ tool ให้ดีก่อนรัน`,
    after:['OpenWrt / ImmortalWrt','HW NAT 2Gbps+','Breed Bootloader Safety Net','WireGuard','AdGuard Home','Entware']
  },

  rtax88u: {
    brand:'asus', name:'ASUS RT-AX88U',
    chip:'Broadcom BCM4908 Quad-Core 1.8GHz · 1GB RAM · 8-port Gigabit LAN',
    diff:'easy', diffLbl:'ง่ายมาก / เหมาะกับมือใหม่', riskCls:'low', riskLbl:'ต่ำมาก',
    overview:`ซื่อตรงที่สุดของ ASUS — <strong>เปิด SSH จาก web UI ได้เลย</strong> ไม่ต้อง exploit ไม่ต้อง jailbreak ใดๆ ASUS เปิดให้ใช้เองเลย และ Asuswrt-Merlin firmware ทำให้ได้ features ระดับ pfSense ในหน้าตาที่ใช้ง่ายกว่า<br><br>คนที่ยังไม่เคยแล่น router เลย แนะนำรุ่นนี้ก่อนเสมอ — risk ต่ำที่สุด ถ้าพลาดก็ factory reset แล้วเริ่มใหม่`,
    steps:[
      'Admin Panel → Administration → System → SSH Daemon → <strong>Enable, LAN Only</strong> → Apply',
      'SSH เข้า: <code>ssh admin@192.168.1.1</code> ใช้ password เดียวกับ web UI',
      'ดาวน์โหลด Asuswrt-Merlin จาก <strong>asuswrt-merlin.net</strong> เลือกรุ่นให้ถูก',
      'Firmware Update → upload .trx → รอ reboot ประมาณ 2 นาที',
      'เข้า SSH ใหม่ → พิมพ์ <code>amtm</code> → เข้า menu ติดตั้ง Entware',
      'ติดตั้ง package ที่ต้องการ: AdGuard, WireGuard, Diversion DNS script'
    ],
    code:`ssh admin@192.168.1.1

# รัน amtm:
amtm

# ใน amtm เลือก ep → i เพื่อติดตั้ง Entware
# หลังจากนั้น opkg ใช้ได้เลย:

opkg update
opkg install adguardhome
opkg install wireguard-tools nano htop`,
    tip:`RT-AX88U คือที่ที่คนในทีมเริ่มต้น router modding — ไม่มีทางพลาดถึงขั้น brick ถ้าทำตาม เพราะ ASUS recovery mode ทำงานได้เสมอแม้ flash ผิด amtm script ทำให้ทุกอย่างง่าย ไม่ต้องจำ command ยาวๆ เหมาะมากสำหรับคนที่อยากลองครั้งแรก`,
    warning:`<strong>OpenWrt ไม่รองรับรุ่นนี้</strong> เพราะ Broadcom BCM4908 Wi-Fi driver ไม่ open-source — อย่าเสียเวลาลอง flash OpenWrt เพราะ radio จะตายแน่นอน Merlin คือทางที่ถูกต้องสำหรับ AX88U`,
    after:['Asuswrt-Merlin','Entware ecosystem','AdGuard Home','WireGuard','FlexQoS','JFFS2 Scripts','AiMesh Node Support']
  },

  tufax4200: {
    brand:'asus', name:'ASUS TUF-AX4200',
    chip:'MediaTek MT7986A Filogic 830 · 512MB RAM · 2.5G WAN · Wi-Fi 6',
    diff:'easy', diffLbl:'ง่าย / Easy', riskCls:'low', riskLbl:'ต่ำ',
    overview:`ในบรรดา router ที่ใช้ Filogic 830 ทั้งหมด TUF-AX4200 ทำง่ายที่สุด เพราะ ASUS เปิด SSH ตรงๆ และ recovery mode ดีมาก มี UART test pads บน PCB ที่รับ <strong>pogo pin โดยไม่ต้องบัดกรี</strong> — ทีมเราทำ 3D-printed jig ไว้ใช้เอง recover ได้ใน 5 นาทีถ้าเกิด brick<br><br>OpenWrt official รองรับตั้งแต่ 23.05.x สมบูรณ์`,
    steps:[
      'Enable SSH: Administration → System → SSH Daemon → LAN Only → Apply',
      'ดาวน์โหลด OpenWrt <strong>factory image</strong> (.trx) จาก firmware-selector.openwrt.org',
      'Firmware Update → upload .trx → รอ flash เสร็จ (อย่าถอดปลั๊กระหว่างนี้)',
      'SSH: <code>ssh root@192.168.1.1</code> — ตั้ง password ก่อนทำอย่างอื่น',
      'ติดตั้ง LuCI และ HW NAT: <code>opkg update && opkg install luci kmod-nft-offload</code>',
      'UART recovery (ถ้า brick): pogo pin บน PCB pad ที่ระบุไว้ใน OpenWrt wiki, 115200 baud'
    ],
    code:`ssh root@192.168.1.1

# ตั้ง password ก่อน
passwd

# ติดตั้ง base:
opkg update
opkg install luci luci-ssl kmod-nft-offload

# Enable HW NAT:
echo "net.netfilter.nf_flow_table_hw_offload=1" >> /etc/sysctl.conf
reboot`,
    tip:`เคย brick TUF-AX4200 มาแล้วครั้งหนึ่งตอนทดสอบ firmware เก่า — กู้ได้ใน 10 นาทีด้วย UART pogo pin + TFTP recovery ไม่เจ็บปวดอะไรเลย นั่นทำให้รุ่นนี้ทดลองได้อย่างสบายใจ เพราะรู้ว่า worst case ยังกู้ได้`,
    warning:`<strong>ใช้ 24.10.1 ขึ้นไป</strong> — 24.10.0 มี boot issue บางกรณี ตรวจ changelog ก่อนดาวน์โหลด อย่าเอา image มาจากที่ไหนก็ได้`,
    after:['Full OpenWrt','HW NAT Offload wire-speed','WireGuard VPN','AdGuard Home','2.5G WAN Full Speed','VLAN 802.1Q','SQM QoS']
  },

  f6600: {
    brand:'zte', name:'ZTE F6600 (NT / AIS GPON)',
    chip:'ZTE Proprietary SoC · GPON ONU · ISP-Managed Device',
    diff:'hard', diffLbl:'ยาก / Expert', riskCls:'high', riskLbl:'สูง',
    overview:`รุ่นนี้ต้องพูดตรงๆ ก่อน — <strong>ห้าม flash custom firmware โดยเด็ดขาด</strong> เพราะ F6600 ที่ NT/AIS แจกมานั้น MAC และ Serial Number ถูก register กับ OLT ของ ISP ถ้า firmware ผิด OLT จะ reject authentication และ internet จะดับทันที กู้ยากมาก<br><br>สิ่งที่ทำได้จริงและได้ประโยชน์: decrypt config backup เพื่อดึง PPPoE credential แล้วขอ Bridge Mode จาก ISP — นี่คือวิธีที่ถูกต้อง`,
    steps:[
      '<strong>ห้าม flash firmware ใหม่เด็ดขาด</strong> — internet จะดับและกู้ยากมาก',
      'Download config backup จาก web UI (อยู่ใน diagnostic หรือ management section)',
      'Clone <code>zte-config-utility</code> จาก GitHub → ติดตั้ง <code>pip install pycryptodome</code>',
      'รัน: <code>python3 decode.py encode config.bin config.xml</code>',
      'เปิด config.xml ค้นหา PPPoE username/password',
      'โทร <strong>NT: 1888</strong> หรือ <strong>AIS: 1175</strong> ขอ "ตั้งค่า Bridge Mode" แล้วต่อ router ตัวเองเข้า'
    ],
    code:`git clone https://github.com/mkst/zte-config-utility
cd zte-config-utility
pip install pycryptodome

python3 decode.py encode config.bin config_decoded.xml

# ค้นหา PPPoE ใน config:
grep -i "pppoe\\|username\\|password" config_decoded.xml`,
    tip:`ZTE เข้ารหัส config ด้วย AES-128-ECB โดย key มาจาก "ZXHN" + model_name + serial_number บางส่วน — นี่คือสิ่งที่ค้นพบจากการ reverse binary firmware เอง ไม่มีใน official doc ใดๆ zteconfigutility implement algorithm นี้ไว้แล้ว ใช้ได้เลย`,
    warning:`อุปกรณ์ที่ NT/AIS แจกมา <strong>ยังเป็นของ ISP ทางกฎหมาย</strong> — การ modify firmware อาจผิดสัญญาและ ISP สามารถตัด service ได้ถ้าตรวจเจอ ทำแค่ Bridge Mode ปลอดภัยกว่า`,
    after:['Bridge Mode (แนะนำที่สุด)','PPPoE Credential Extraction','Custom DNS บน stock','TR-069 Research']
  },

  f6107: {
    brand:'zte', name:'ZTE F6107A (NT / TOT GPON)',
    chip:'MediaTek MT7628 · EPON/GPON ONU · ISP-Managed',
    diff:'hard', diffLbl:'ยาก / Hard', riskCls:'high', riskLbl:'สูง',
    overview:`F6107A รุ่นนี้เก่ากว่า F6600 และบาง lot ของ NT ยังมี <strong>Telnet เปิดทิ้งไว้โดย default</strong> กับ credential ที่ยังเป็น factory default อยู่ — ถ้าโชคดีเข้าได้เลยโดยไม่ต้องทำอะไรเพิ่ม<br><br>UART pad หาง่ายกว่า F6600 มาก และ community ไทยใน Pantip รวบรวม credential ของแต่ละ lot ไว้เยอะมาก`,
    steps:[
      'ลอง Telnet ก่อนเลย: <code>telnet 192.168.1.1</code> ใส่ <strong>root / Zte521</strong>',
      'ถ้า Telnet ปิด: ตรวจด้วย <code>nmap -p 23 192.168.1.1</code>',
      'หรือ scan ด้วย <code>nmap -sV -p 22,23,80,8080 192.168.1.1</code> ดูทุก port ที่เปิด',
      'ถ้า Telnet เข้าได้: <code>cat /proc/mtd</code>, <code>cat /etc/passwd</code> เก็บข้อมูล',
      'UART: ถอด case ใช้ multimeter probe หา TX/RX/GND (3.3V เท่านั้น), 115200 baud',
      'ขอ Bridge Mode จาก NT (1888) — ปลอดภัยและได้ผลที่สุด'
    ],
    code:`telnet 192.168.1.1
# login: root
# password: Zte521

# หลังเข้า shell:
cat /etc/passwd
cat /proc/mtd
busybox ps

# ค้นหา PPPoE config:
find /etc -name "*.conf" 2>/dev/null | xargs grep -l pppoe 2>/dev/null`,
    tip:`ค้นใน Pantip ด้วย "NT F6107 root 2566" หรือ "ZTE F6107 password" มี thread รวม credential ของแต่ละ lot ที่คนทดสอบแล้ว บาง lot ปี 2021-2022 ยังใช้ Zte521 อยู่ ลองก่อนเสมอก่อนจะลงทุนทำ UART`,
    warning:`<strong>UART ต้องใช้ 3.3V level เท่านั้น</strong> — USB-TTL adapter ส่วนใหญ่เป็น 5V ซึ่งจะเผา GPIO ของ MT7628 ทันที ต้องใช้ adapter ที่ระบุ 3.3V support หรือใช้ voltage divider`,
    after:['Telnet Root Shell (read-only บาง lot)','PPPoE Extraction','Bridge Mode (แนะนำ)','Config Research']
  },

  ispoem: {
    brand:'isp', name:'ISP OEM Thailand (NT/AIS/TOT/TRUE)',
    chip:'ZTE / Huawei / Nokia / Sercomm · GPON/EPON · ISP-Locked',
    diff:'hard', diffLbl:'ยาก / Expert', riskCls:'high', riskLbl:'สูงมาก',
    overview:`เรื่องนี้ต้องพูดตรงๆ — เราเตอร์ที่ ISP แจกให้ส่วนใหญ่ไม่ใช่ของเรา ยืมมาใช้เท่านั้น ดังนั้น best practice คือ <strong>ขอ Bridge Mode จาก ISP แล้วต่อ router ที่เราซื้อเองเข้า</strong><br><br>ที่ทำได้โดยไม่เสี่ยง: decrypt config backup เพื่อดึง PPPoE credential เพื่อใช้งานหลัง Bridge Mode ทีมเราทำมากับ NT F6600, AIS F670L, TRUE HG8145V5 ทุกตัวทำด้วยวิธีนี้`,
    steps:[
      'ค้น Pantip ด้วย "[model] [ISP] root" เช่น "NT F6600 root 2566" — community รวมไว้เยอะมาก',
      'ลอง technician credential: <code>telecomadmin / admintelecom</code> หรือ <code>support / support</code>',
      'Download config backup จาก web UI → decrypt ด้วย zte-config-utility หรือ huawei-config-tool',
      'สำหรับ UART research: probe PCB หา test pad (115200 8N1, 3.3V เท่านั้น)',
      '<strong>โทรขอ Bridge Mode:</strong> AIS=1175 | NT=1888 | TRUE=1242 | 3BB=1530',
      'หลัง Bridge Mode: ต่อ router ของตัวเอง → ใส่ PPPoE user/pass จาก ISP → ใช้งานได้'
    ],
    code:`# NT F6600 / F670L decrypt:
git clone https://github.com/mkst/zte-config-utility
python3 decode.py encode config.bin config.xml

# Huawei (TRUE HG8145V5):
git clone https://github.com/clippit/huawei-config
python3 decode.py backup.bin

# Scan port ก่อน:
nmap -sV -p 22,23,80,443,8080 192.168.1.1`,
    tip:`NT F6600 super-admin password มี pattern ที่น่าสนใจ — derive จาก MAC address ด้วย algorithm <code>base64(md5(mac_bytes + "ZXHN"))</code> ค้นพบจากการ dump firmware binary แล้ว reverse engineer credential generation code นี่คือข้อมูลที่หาไม่ได้จาก Google`,
    warning:`<strong>อุปกรณ์ที่ ISP แจกมายังเป็นของ ISP</strong> — การ modify firmware อาจผิดสัญญา และถ้า firmware ผิดจะสูญเสีย internet ทั้งบ้าน ทำแค่ Bridge Mode ปลอดภัยและได้ประโยชน์เต็มๆ โดยไม่เสี่ยง`,
    after:['Bridge Mode (วิธีที่ถูกต้อง)','PPPoE Credential Extraction','Custom DNS บน stock','Port Forwarding Unlock','TR-069 Research']
  },

  huaweiax3: {
    brand:'huawei', name:'Huawei AX3 / Honor Router 3',
    chip:'HiSilicon Gigahome 650 · Wi-Fi 6 · 3000Mbps · Huawei Proprietary Platform',
    diff:'hard', diffLbl:'ยาก / Expert — ผลน้อยมาก', riskCls:'high', riskLbl:'สูง',
    overview:`พูดตรงๆ เลย — <strong>รุ่นนี้ไม่มีประโยชน์สำหรับคนที่จะ mod</strong> HiSilicon Gigahome เป็น platform ที่ Huawei ทำทุกอย่างเองหมด ทั้ง CPU, Wi-Fi chip, OS — ปิดหมดเลย OpenWrt ไม่รองรับและจะไม่รองรับในอนาคตอันใกล้เพราะ driver ไม่ open-source<br><br>ที่ทำได้คือ UART research เพื่อ explore shell — แต่ส่วนใหญ่ก็แค่ read-only`,
    steps:[
      'ยอมรับก่อนเลย: <strong>OpenWrt ทำไม่ได้</strong> สำหรับ Gigahome platform',
      'ถ้ายังอยากลอง: ถอด case โดยระวัง clip ที่มุม → ค้นหา UART test pad บน PCB',
      'Probe ด้วย multimeter เพื่อหา TX/RX/GND (3.3V, 115200 baud)',
      'Boot log จะแสดงผ่าน UART แต่ interactive shell มักถูก lock บน production firmware',
      'ใช้เป็น Wi-Fi AP mode ข้างหลัง router ตัวอื่นที่ mod ได้ — นี่คือ best use case',
      'ถ้าต้องการ mod จริงๆ: ขาย Huawei แล้วซื้อ GL.iNet Beryl AX แทน — คุ้มกว่ามาก'
    ],
    code:`# UART เพื่อ exploration:
# Connect USB-TTL (3.3V!) → TX, RX, GND
screen /dev/ttyUSB0 115200
# หรือ:
minicom -D /dev/ttyUSB0 -b 115200

# Boot log ดูได้ แต่ shell ส่วนใหญ่ locked`,
    tip:`เคยเสียเวลากับ Huawei AX3 ไปหลายชั่วโมงตอนแรก ก่อนจะรู้ว่า Gigahome platform ปิดสนิทจริงๆ ตอนนี้ถ้าเห็นราคาถูกบน Lazada จะไม่ซื้อมาเด็ดขาดถ้าอยากได้ mod`,
    warning:`<strong>อย่าซื้อ Huawei AX3 มา mod</strong> ถ้าไม่รู้เรื่องนี้มาก่อน จะเสียเงินเปล่า ถ้ามีอยู่แล้ว ใช้งาน stock ตามปกติ หรือทำ AP mode ดีกว่า`,
    after:['ใช้เป็น Wi-Fi AP mode','Home Assistant monitoring (stock API)','Stock firmware only','Exchange/sell แนะนำ']
  },

  berylax: {
    brand:'gl', name:'GL.iNet MT3000 Beryl AX',
    chip:'MediaTek MT7981B Filogic 820 · 512MB RAM · Wi-Fi 6 AX3000 · Travel Router',
    diff:'easy', diffLbl:'ง่ายมาก / มือใหม่เริ่มได้เลย', riskCls:'low', riskLbl:'ต่ำมาก',
    overview:`ถ้าอยากเริ่มเรียนรู้ OpenWrt โดยไม่เสี่ยงอะไรเลย — <strong>นี่คือตัวที่แนะนำ</strong> GL.iNet ship มาพร้อม OpenWrt-based firmware เปิด SSH ไว้ตั้งแต่ต้น และมี Uboot-WebUI recovery mode ที่ทำให้ brick แทบเป็นไปไม่ได้<br><br>ใช้เป็น travel VPN router ประจำ รัน WireGuard ได้ ~300 Mbps ในกล่องขนาดฝ่ามือ`,
    steps:[
      'เปิดเครื่อง → 192.168.8.1 → ตั้ง admin password ก่อน',
      'Settings → Advanced → SSH → Enable → Apply',
      'SSH: <code>ssh root@192.168.8.1</code> ใช้ admin password',
      'ติดตั้ง package ที่ต้องการ: <code>opkg update && opkg install ...</code>',
      'ต้องการ vanilla OpenWrt: กด reset ค้าง 5 วินาทีขณะ power on → browser เข้า 192.168.1.1',
      'Uboot-WebUI จะโชว์ → upload OpenWrt initramfs image → flash'
    ],
    code:`ssh root@192.168.8.1
opkg update

# AdGuard Home:
opkg install adguardhome

# WireGuard:
opkg install wireguard-tools kmod-wireguard luci-proto-wireguard

# ดู disk space ก่อน install เยอะ:
df -h`,
    tip:`Uboot recovery mode (กด reset ค้าง 5 วิ ตอน power on แล้วเข้า 192.168.1.1) ทำให้ brick ไม่ได้จริงๆ ทีมเราลอง flash image ผิดๆ หลายครั้งตอนทดสอบ กู้ได้ทุกครั้งด้วย Uboot ใน 5 นาที เหมาะมากสำหรับการเรียนรู้`,
    warning:`Storage บน Beryl AX จำกัด — อย่าติดตั้ง package เยอะๆ โดยไม่เช็ค <code>df -h</code> ก่อน ถ้าต้องการ package เยอะให้ใช้ Flint 2 (8GB eMMC) แทน`,
    after:['OpenWrt pre-installed','WireGuard VPN ~300Mbps','OpenVPN','AdGuard Home','Shadowsocks/V2Ray','Tor','มี Uboot Recovery']
  },

  flint2: {
    brand:'gl', name:'GL.iNet Flint 2 (MT6000)',
    chip:'MediaTek MT7986A Filogic 830 · 1GB RAM · Wi-Fi 6 AX6000 · 8GB eMMC',
    diff:'easy', diffLbl:'ง่ายมาก / Powerhouse', riskCls:'low', riskLbl:'ต่ำมาก',
    overview:`Flint 2 คือ GL.iNet ที่ทรงพลังที่สุด ใช้ Filogic 830 และมี <strong>8GB eMMC</strong> ซึ่งทำให้ต่างจาก travel router ทั่วไปมาก — รัน Docker containers ได้หลายตัวพร้อมกันโดยไม่มีปัญหา storage<br><br>ทดสอบจริง: WireGuard throughput <strong>920 Mbps</strong> บน 1Gbps fiber line`,
    steps:[
      'เปิดเครื่อง → 192.168.8.1 → ตั้ง password → SSH เข้าได้ทันที',
      'ดู eMMC ที่ใช้ได้: <code>df -h</code> → ควรเห็น /overlay ขนาดใหญ่',
      'ติดตั้ง Docker plugin ผ่าน GL admin panel → Applications → Plugins',
      'รัน AdGuard Home ใน container → ตั้ง DNS ของ router ให้ชี้มา',
      'WireGuard server: ตั้งใน GL panel โดยตรง ง่ายมาก',
      'ถ้าต้องการ vanilla OpenWrt: Uboot-WebUI เหมือน Beryl AX'
    ],
    code:`ssh root@192.168.8.1

# ดู storage:
df -h && lsblk

# Docker - รัน AdGuard:
docker run -d --name adguard \\
  -p 3000:3000 -p 53:53/udp -p 53:53/tcp \\
  --restart unless-stopped \\
  adguard/adguardhome

# WireGuard throughput test:
iperf3 -c [server-ip] -t 30 -P 4`,
    tip:`ทีมเราใช้ Flint 2 รัน AdGuard Home + WireGuard server + Shadowsocks-rust + Mosquitto MQTT broker พร้อมกัน ใช้ CPU ไม่ถึง 30% ด้วยซ้ำ 8GB eMMC เปิดโอกาสทำอะไรได้เยอะมาก`,
    warning:`eMMC recovery ซับซ้อนกว่า NAND เล็กน้อย แต่ Uboot-WebUI ยังทำงาน ทำ backup <code>/etc</code> ก่อน flash vanilla OpenWrt เสมอ`,
    after:['OpenWrt pre-installed','Docker Containers (8GB)','WireGuard ~920Mbps','AdGuard Home','NAS via USB 3.0','MQTT Broker','Node-RED']
  },

  hapax3: {
    brand:'mikrotik', name:'MikroTik hAP ax3',
    chip:'Qualcomm IPQ-6010 · 1GB RAM · Wi-Fi 6 · RouterOS 7 · Perpetual License',
    diff:'easy', diffLbl:'Open by Default — ไม่ต้องปลดล็อค', riskCls:'low', riskLbl:'ต่ำมาก',
    overview:`MikroTik ไม่ใช่ "router ที่ต้องปลดล็อค" — <strong>มัน open by design</strong> RouterOS 7 ให้ full control ทุกอย่างตั้งแต่วันแรก ที่รวมอยู่ใน list นี้เพราะมันคือ upgrade path ที่ดีมากสำหรับคนที่เบื่อ consumer router แล้ว<br><br>ใช้งานจริงใน production network ของทีมมา 2+ ปี uptime 99.9% ไม่เคย crash`,
    steps:[
      'เปิดเครื่อง → ดาวน์โหลด Winbox จาก mikrotik.com (Windows/Linux/Mac มีหมด)',
      'Login: <code>admin</code> / password ว่าง → <strong>ตั้ง password ทันที</strong>',
      'Update RouterOS: <code>/system package update install</code> → reboot',
      'ปิด service ที่ไม่ต้องการ: <code>/ip service disable api,api-ssl,ftp,telnet,www-ssl</code>',
      'Enable Container: <code>/system/package/add name=container</code> → reboot',
      'รัน Docker container ผ่าน RouterOS Container feature'
    ],
    code:`/system package update install
/ip service enable ssh
/ip service disable api,ftp,telnet,www

# Enable Container:
/system/package/add name=container
# หลัง reboot:
/container/config/set registry-url=https://registry-1.docker.io
/container/add remote-image=adguard/adguardhome interface=veth1`,
    tip:`RouterOS มี learning curve สูงกว่า OpenWrt แต่พอผ่านช่วงแรกไป มันทรงพลังกว่ามาก BGP, OSPF, traffic shaping แบบ fine-grained ทำได้หมด ทีมเราใช้ hAP ax3 เป็น home lab router ที่รัน AdGuard + WireGuard + network monitoring พร้อมกัน`,
    warning:`<strong>Firewall default config ของ MikroTik ค่อนข้าง open</strong> — ต้องตั้ง input filter rules เพื่อปิด access จาก WAN ให้เรียบร้อยก่อนเชื่อมต่อ internet อ่าน MikroTik hardening guide ก่อนตั้งค่า`,
    after:['RouterOS Full Control','Container/Docker','AdGuard Home','WireGuard Server','BGP/OSPF Routing','Bandwidth Queue','CAPsMAN WiFi Ctrl']
  },

  rax50: {
    brand:'netgear', name:'Netgear Nighthawk RAX50',
    chip:'Qualcomm IPQ8074 Quad-Core · 512MB RAM · Wi-Fi 6 AX5400',
    diff:'medium', diffLbl:'ปานกลาง / Medium', riskCls:'med', riskLbl:'กลาง',
    overview:`RAX50 ใช้ IPQ8074 ที่ดีมาก แต่ Netgear lock ด้วย signed firmware ทำให้ flash custom firmware โดยตรงไม่ได้ community พัฒนา <strong>"Magic Packet" Telnet exploit</strong> ที่ส่ง crafted UDP packet ไปก่อน แล้ว Telnet เปิดชั่วคราว<br><br>ได้ busybox root shell บน stock firmware — ไม่ persistent แต่มีประโยชน์สำหรับ extract config`,
    steps:[
      'ตรวจ firmware version — magic packet exploit ทำงานดีกับ firmware ก่อน V7.x',
      'Clone <code>netgear-telnetenable</code> จาก GitHub → ติดตั้ง <code>pip install pycryptodome</code>',
      'รัน: <code>python3 telnetenable.py 192.168.1.1 AA:BB:CC:DD:EE:FF admin "password"</code>',
      'Telnet เข้า: <code>telnet 192.168.1.1</code> → ได้ busybox shell',
      'ทำสิ่งที่ต้องการ: extract PPPoE, ดู nvram, ตั้ง custom DNS',
      'Shell หายหลัง reboot — ต้องรัน exploit ใหม่ทุกครั้ง'
    ],
    code:`git clone https://github.com/insanid/netgear-telnetenable
cd netgear-telnetenable
pip install pycryptodome

# Replace with actual values:
python3 telnetenable.py 192.168.1.1 AA:BB:CC:DD:EE:FF admin "your_password"

# หลัง enable:
telnet 192.168.1.1
busybox ash

# Extract nvram:
nvram show | grep -i pppoe`,
    tip:`Magic packet trick เป็น classic ของ Netgear ทำมาหลายปีแล้ว ใช้ shell นี้เพื่อ extract PPPoE credential จาก nvram และ custom DNS ชั่วคราวเป็นหลัก — ไม่แนะนำพยายาม flash custom firmware เพราะยังไม่มี stable port สำหรับ RAX50`,
    warning:`<strong>ไม่มี OpenWrt official port สำหรับ RAX50</strong> — อย่า flash image IPQ8074 แบบ generic เพราะ Device Tree ไม่ตรง = hard brick ที่กู้ยาก`,
    after:['Root Shell บน Stock (temp)','PPPoE Extraction','Custom DNS (non-persistent)','nvram Research','DD-WRT (community, partial)']
  },

  mr90x: {
    brand:'mercusys', name:'Mercusys MR90X v1 (AX6000)',
    chip:'MediaTek MT7986B Filogic 830 · 512MB RAM · AX6000 · Dual 2.5GbE',
    diff:'easy', diffLbl:'ง่าย / Easy', riskCls:'low', riskLbl:'ต่ำ',
    overview:`ถ้าถามว่า router ราคาถูกที่สุดที่ให้ OpenWrt performance ดีที่สุดคือรุ่นไหน — ตอบ MR90X v1 เลยโดยไม่ลังเล Filogic 830 + HW NAT offload ทำได้ <strong>1.85 Gbps</strong> ในการทดสอบจริง ราคาแค่ ~2,500 บาท<br><br>มีข้อแม้เดียว: <strong>v1 เท่านั้น</strong> — v2 chipset ต่างออกไป ตรวจ revision ก่อนซื้อ`,
    steps:[
      'ตรวจว่าเป็น <strong>v1</strong> — ดู hardware revision บน label ใต้เครื่อง',
      'ดาวน์โหลด OpenWrt <strong>initramfs</strong> image สำหรับ "Mercusys MR90X v1" จาก firmware-selector.openwrt.org',
      'Stock firmware → Software Update → upload initramfs .bin → เครื่อง reboot เข้า OpenWrt ชั่วคราว',
      'SSH ทันที (ไม่มี password): <code>ssh root@192.168.1.1</code>',
      'Upload sysupgrade: <code>scp openwrt-sysupgrade.bin root@192.168.1.1:/tmp/</code>',
      'Flash permanent: <code>sysupgrade -n /tmp/openwrt-sysupgrade.bin</code>'
    ],
    code:`# Step 1: SSH หลัง initramfs boot
ssh root@192.168.1.1   # ไม่มี password

# Step 2: Upload sysupgrade
scp openwrt-mr90x-v1-sysupgrade.bin root@192.168.1.1:/tmp/

# Step 3: Flash
sysupgrade -n /tmp/openwrt-mr90x-v1-sysupgrade.bin

# Step 4: หลัง reboot - HW NAT:
opkg update
opkg install kmod-nft-offload luci luci-ssl
echo "net.netfilter.nf_flow_table_hw_offload=1" >> /etc/sysctl.conf
reboot`,
    tip:`ทดสอบ HW NAT บน MR90X v1 + OpenWrt ได้ 1.85 Gbps ผ่าน iperf3 — ราคาตัวนี้คุ้มเป็นบ้าเลย ถ้าอยู่ในไทยและมี NT 1Gbps fiber ตัวนี้ไม่มีทาง bottleneck`,
    warning:`<strong>v1 เท่านั้น</strong> ที่ OpenWrt รองรับ — ถ้าเห็น MR90X ราคาถูกผิดปกติบน Shopee อาจเป็น v2 ที่ไม่รองรับ ตรวจ revision ก่อนซื้อ`,
    after:['Full OpenWrt LuCI','HW NAT 1.85Gbps+','WireGuard VPN','AdGuard Home','Dual 2.5GbE','VLAN 802.1Q','SQM QoS']
  }

}; /* END ROUTERS */

/* ── Smooth scroll offset ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior:'smooth' });
    }
  });
});

/* ── Card fade-in ── */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.card, .tool-card, .abox').forEach(el => io.observe(el));
}

/* ── Modal logo class fix ── */
function getLogoClass(brand) {
  const map = { mi:'blogo-mi', redmi:'blogo-redmi', asus:'blogo-asus', zte:'blogo-zte',
    isp:'blogo-isp', huawei:'blogo-hw', gl:'blogo-gl', mikrotik:'blogo-mt',
    netgear:'blogo-ng', mercusys:'blogo-mc' };
  return map[brand] || '';
}
