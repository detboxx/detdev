/* =============================================
   WS Tech — Router Lab  |  app.js  v4.0
   Production-ready JavaScript
   ============================================= */

'use strict';

/* ─────────────── NAVBAR SCROLL ─────────────── */
const $navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  $navbar?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─────────────── MOBILE MENU ─────────────── */
const $ham  = document.getElementById('navHam');
const $menu = document.getElementById('navMenu');
$ham?.addEventListener('click', () => {
  const open = $menu.classList.toggle('open');
  $ham.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav-a').forEach(a =>
  a.addEventListener('click', () => $menu.classList.remove('open'))
);

/* ─────────────── FILTER ─────────────── */
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

/* ─────────────── MODAL ─────────────── */
const $overlay = document.getElementById('overlay');
const $mbody   = document.getElementById('mbody');
const $mclose  = document.getElementById('mclose');

function openModal(id) {
  const d = ROUTERS[id];
  if (!d) { console.warn('No data for:', id); return; }

  const steps = d.steps.map((s, i) =>
    `<li><span class="step-n">${i + 1}</span><span>${s}</span></li>`
  ).join('');

  const after = d.after.map(a =>
    `<span class="unlock-tag">${a}</span>`
  ).join('');

  $mbody.innerHTML = `
    <div class="m-header">
      <div class="m-icon ${d.cls}">${d.icon}</div>
      <div class="m-title">
        <h2>${d.name}</h2>
        <p>${d.chip}</p>
      </div>
    </div>
    <div class="m-badges">
      <span class="badge ${d.diff}">${d.diffLbl}</span>
      <span class="risk ${d.riskCls}"><i class="fa-solid fa-shield-halved"></i> Risk: ${d.riskLbl}</span>
    </div>
    <div class="m-sec">
      <h4>📋 ภาพรวม / Overview</h4>
      <p>${d.overview}</p>
    </div>
    <div class="m-sec">
      <h4>🔧 ขั้นตอนการปลดล็อค</h4>
      <ul class="step-list">${steps}</ul>
    </div>
    ${d.code ? `<div class="m-sec">
      <h4>💻 คำสั่งที่ใช้</h4>
      <pre class="code-pre">${escHtml(d.code)}</pre>
    </div>` : ''}
    <div class="m-sec">
      <h4>💡 เทคนิคพิเศษจาก WS Tech</h4>
      <div class="tip-box">${d.tip}</div>
    </div>
    <div class="m-sec">
      <h4>⚠️ คำเตือน</h4>
      <div class="warn-box">${d.warning}</div>
    </div>
    <div class="m-sec">
      <h4>🚀 ทำอะไรได้หลังปลดล็อค</h4>
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

/* Card click → delegate to read button */
document.getElementById('grid')?.addEventListener('click', e => {
  const btn  = e.target.closest('.read-btn');
  const card = e.target.closest('.card');
  if (btn && card) openModal(card.dataset.id);
});

/* ─────────────── UTILITY ─────────────── */
function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ─────────────── ROUTER DATABASE ─────────────── */
const ROUTERS = {

  /* ══════════════════════ XIAOMI AX3000T ══════════════════════ */
  ax3000t: {
    cls:'c-mi', icon:'MI',
    name:'Xiaomi AX3000T (RD03)',
    chip:'MediaTek MT7981B Filogic 820 · Wi-Fi 6 · AX3000',
    diff:'easy', diffLbl:'ง่าย / Easy',
    riskCls:'low', riskLbl:'ต่ำ',
    overview:`AX3000T คือ router ที่ <strong>ง่ายที่สุด</strong> ในการปลดล็อคของ Xiaomi ปัจจุบัน เนื่องจาก Xiaomi ใช้ระบบ MiWiFi API ที่มีช่องโหว่ authentication สามารถเปิด SSH ได้ผ่าน tool สำเร็จรูปโดยไม่ต้อง downgrade หรือใช้อุปกรณ์พิเศษ<br><br><strong>⚠️ ข้อควรรู้:</strong> RD03 = MediaTek MT7981B (รองรับ OpenWrt เต็มรูปแบบ) | RD03v2 = Qualcomm IPQ5018 (repo แยก, support น้อยกว่า) — ตรวจ label ใต้เครื่องก่อนเริ่ม`,
    steps:[
      'ตรวจ label ใต้เครื่อง: <strong>RD03</strong> = MT7981B ✓ | <strong>RD03v2</strong> = Qualcomm (ต้องใช้ exploit ต่างออกไป)',
      'ติดตั้ง Python 3 → ดาวน์โหลด <code>xmir-patcher</code> จาก GitHub (xiaomi-router-patcher)',
      'รัน: <code>python xmir-patcher.py</code> → เลือก "Enable SSH via Web API"',
      'SSH เข้า: <code>ssh root@192.168.31.1</code> — ตรวจ partition: <code>cat /proc/mtd</code>',
      '<strong>Backup ART partition ก่อน flash ทุกครั้ง</strong> — นี่คือ Wi-Fi calibration data ถ้าหายไปจะ brick radio',
      'Flash OpenWrt จาก firmware-selector.openwrt.org เลือก target "Xiaomi MI Router AX3000T"'
    ],
    code: `ssh root@192.168.31.1
# ดู partition layout:
cat /proc/mtd
# Backup ART partition (ตัวอย่าง mtd6):
dd if=/dev/mtd6 of=/tmp/art.bin
# ส่งไฟล์ออกมา:
scp root@192.168.31.1:/tmp/art.bin ./art_backup.bin`,
    tip:`<strong>💡 WS Tech Tip:</strong> Xiaomi patch exploit นี้บ่อยมาก ถ้า firmware ≥ 1.0.47 อาจต้อง downgrade ก่อน ดาวน์โหลด firmware เก่าจาก <em>miwifi.com</em> แล้ว flash ผ่าน recovery mode (reset ค้างขณะเสียบไฟ) หลัง flash OpenWrt ทีม WS แนะนำให้ enable <code>kmod-nft-offload</code> ทันทีเพื่อ hardware NAT`,
    warning:`<strong>⚠️ ห้ามใช้ firmware จาก blog หรือ YouTube</strong> ที่ไม่ระบุ source ชัดเจน — ใช้ OpenWrt official builds เท่านั้น การสูญหาย ART partition โดยไม่มี backup = Wi-Fi brick ถาวร`,
    after:['Full OpenWrt LuCI','AdGuard Home','WireGuard VPN','VLAN 802.1Q','Entware','SQM QoS','Bandwidth Monitor']
  },

  /* ══════════════════════ XIAOMI AX9000 ══════════════════════ */
  ax9000: {
    cls:'c-mi', icon:'MI',
    name:'Xiaomi AX9000 Tri-band',
    chip:'Qualcomm IPQ8072A Quad-Core 2.2GHz · Wi-Fi 6 Tri-band · AX9000',
    diff:'medium', diffLbl:'ปานกลาง / Medium',
    riskCls:'med', riskLbl:'กลาง',
    overview:`AX9000 ใช้ Qualcomm IPQ8072A ทรงพลัง มี dedicated gaming radio 4804Mbps และ port 2.5G OpenWrt รองรับ official ตั้งแต่ 23.05.x แต่ firmware version ใหม่กว่า 1.0.82 อาจต้อง downgrade ก่อน และ International version มี secure boot แตกต่างจาก CN version`,
    steps:[
      'ตรวจ firmware version — ถ้า > 1.0.82 ให้ downgrade ก่อนผ่าน miwifi.com recovery ROM',
      'ใช้ <strong>SN-based key generator</strong> (tools จาก GitHub community) เพื่อ generate unlock token จาก serial number',
      'Enable Telnet ผ่าน token payload → เข้า Telnet → set SSH password',
      'Backup ทุก partition: <code>cat /proc/mtd</code> แล้ว dd ทุก partition ออกมาเก็บ',
      'Flash OpenWrt factory image สำหรับ IPQ8072A — device ใช้ A/B partition scheme',
      'หลัง boot: SSH เข้า → ตั้ง password → enable hw offload → ติดตั้ง LuCI'
    ],
    code: `# Generate SN key (ตัวอย่าง script):
python3 keygen.py --sn "YOUR_SERIAL_NUMBER"

# หลัง Telnet enable:
telnet 192.168.31.1
# ตรวจ CPU temp หลัง OpenWrt:
cat /sys/class/thermal/thermal_zone*/temp`,
    tip:`<strong>💡 WS Tech Tip:</strong> AX9000 ร้อนมากบน OpenWrt เพราะ stock thermal management หายไป — หลัง flash ให้ตั้ง fan/thermal script ทันที เช็ค temp: <code>cat /sys/class/thermal/thermal_zone*/temp</code> ค่าเกิน 85°C = อันตราย ทีม WS ใช้ custom thermal daemon script ที่เขียนเองเพื่อ regulate load`,
    warning:`<strong>⚠️ International vs CN version:</strong> secure boot ต่างกันมาก — ตรวจให้แน่ใจก่อน flash factory image เพราะ wrong image = hard brick ที่ต้องใช้ UART + TFTP recovery`,
    after:['Full OpenWrt','4804Mbps Gaming Radio Active','WireGuard HW Offload','QoS/SQM','2.5G LAN','Entware']
  },

  /* ══════════════════════ XIAOMI BE7000 ══════════════════════ */
  be7000: {
    cls:'c-mi', icon:'MI',
    name:'Xiaomi BE7000 (Wi-Fi 7)',
    chip:'Qualcomm IPQ9574 Quad-Core · Wi-Fi 7 · BE7000 · 6GHz Band',
    diff:'hard', diffLbl:'ยาก / Expert',
    riskCls:'high', riskLbl:'สูง',
    overview:`BE7000 คือ Wi-Fi 7 flagship ของ Xiaomi ที่ยังอยู่ระหว่าง community exploration — OpenWrt mainline ยังไม่รองรับ IPQ9574 อย่างสมบูรณ์ <strong>แต่ stock firmware รองรับ Docker container</strong> ซึ่งเป็น best practice สำหรับ power user ในตอนนี้`,
    steps:[
      'ใช้ xmir-patcher enable SSH บน stock firmware — SSH นี้ <strong>ไม่ persistent</strong> (หายหลัง reboot)',
      'หลัง SSH เข้าได้: explore filesystem, ตรวจ Docker support: <code>docker ps</code>',
      '<strong>ห้าม flash</strong> OpenWrt IPQ9574 images จาก GitHub fork ที่ไม่มี community active',
      'Best practice: รัน AdGuard Home หรือ WireGuard ผ่าน Docker container บน stock firmware',
      'ติดตาม OpenWrt forum thread "Xiaomi BE7000" สำหรับ mainline progress',
      'ถ้าต้องการ full control ตอนนี้ — พิจารณา return และซื้อ Xiaomi AX3000T แทน'
    ],
    code: `# Docker บน stock firmware:
docker pull adguard/adguardhome:latest
docker run -d --name adguard \
  -p 3000:3000 -p 53:53/tcp -p 53:53/udp \
  --restart unless-stopped \
  adguard/adguardhome`,
    tip:`<strong>💡 WS Tech Tip:</strong> BE7000 stock firmware รองรับ Docker ดีมาก — ทีม WS รัน AdGuard Home + WireGuard + custom monitoring บน stock โดยไม่แตะ base system เลย นี่คือ "safe power-user mode" ขณะรอ OpenWrt mainline ซึ่งคาดว่าน่าจะพร้อมใน 12-18 เดือนหลังจากนี้`,
    warning:`<strong>⚠️ Wi-Fi 7 driver ยังไม่ open-source</strong> — การ flash custom firmware มีโอกาสสูงมากที่จะ brick Wi-Fi radio ถาวร รอ mainline support ก่อนจึงจะปลอดภัย`,
    after:['Docker on Stock Firmware','AdGuard Home (Container)','WireGuard (Container)','SSH Exploration','Future: Full OpenWrt (Q3 2025+)']
  },

  /* ══════════════════════ REDMI AX6000 ══════════════════════ */
  ax6000: {
    cls:'c-mi', icon:'MI',
    name:'Redmi AX6000 (RB01)',
    chip:'MediaTek MT7986A Filogic 830 · Wi-Fi 6 · AX6000 · 512MB RAM',
    diff:'medium', diffLbl:'ปานกลาง / Medium',
    riskCls:'med', riskLbl:'กลาง',
    overview:`Redmi AX6000 ใช้ Filogic 830 เหมือน ASUS TUF-AX4200 ทำให้ OpenWrt performance ดีเยี่ยม — hardware NAT offload ให้ throughput <strong>มากกว่า 2 Gbps</strong> จริง เป็น best-value router สำหรับ OpenWrt ในราคาระดับเดียวกัน`,
    steps:[
      'ดาวน์โหลด exploit tool: <code>xiaomi-ax6000-exploit</code> จาก GitHub (ตรวจ firmware compatibility ก่อน)',
      'รัน: <code>python exploit.py -t 192.168.31.1</code> — script จะ enable SSH อัตโนมัติ',
      'SSH เข้า: <code>ssh -oHostKeyAlgorithms=+ssh-rsa root@192.168.31.1</code>',
      'Backup ART partition ทันที — จำเป็นมากสำหรับ Filogic 830',
      'Flash ImmortalWrt หรือ OpenWrt สำหรับ target "Redmi AX6000"',
      'หลัง boot: ติดตั้ง <code>kmod-nft-offload</code> เพื่อเปิด HW NAT'
    ],
    code: `# Enable SSH:
python3 exploit.py -t 192.168.31.1

# SSH เข้า:
ssh -oHostKeyAlgorithms=+ssh-rsa root@192.168.31.1

# Enable HW NAT offload (หลัง OpenWrt):
opkg update
opkg install kmod-nft-offload
echo "net.netfilter.nf_flow_table_hw_offload=1" >> /etc/sysctl.conf`,
    tip:`<strong>💡 WS Tech Tip:</strong> AX6000 + ImmortalWrt + HW offload = NAT throughput จริง <strong>2.1 Gbps+</strong> ในการทดสอบของทีม WS — ดีกว่า stock firmware มาก Breed bootloader ช่วยให้ recovery จาก brick ง่ายมาก แนะนำให้ flash Breed ก่อนแล้วค่อย flash OpenWrt เพื่อ safety net`,
    warning:`<strong>⚠️ Exploit version-specific</strong> — ตรวจ firmware version ให้ตรงกับ exploit tool ก่อนรัน firmware ใหม่กว่า patch ช่องโหว่ไปแล้ว ต้อง downgrade ก่อน`,
    after:['ImmortalWrt / OpenWrt','HW NAT Offload 2Gbps+','Breed Bootloader','AdGuard Home','WireGuard VPN','Entware','Bandwidth Monitor']
  },

  /* ══════════════════════ ASUS RT-AX88U ══════════════════════ */
  rtax88u: {
    cls:'c-asus', icon:'ASUS',
    name:'ASUS RT-AX88U',
    chip:'Broadcom BCM4908 Quad-Core 1.8GHz · Wi-Fi 6 · AX6000 · 8x Gigabit LAN',
    diff:'easy', diffLbl:'ง่ายมาก / Beginner',
    riskCls:'low', riskLbl:'ต่ำมาก',
    overview:`RT-AX88U คือ "hacker-friendly" router ที่ ASUS เปิด SSH ให้ใช้ได้จาก web UI โดยตรง และ <strong>Asuswrt-Merlin firmware</strong> เพิ่ม features ขั้นสูงมากมายโดยไม่เสีย Wi-Fi performance เพราะ Broadcom driver ยังอยู่ครบ`,
    steps:[
      'เข้า Admin Panel → Administration → System → SSH Daemon → <strong>Enable, LAN Only</strong> → Apply',
      'SSH เข้า: <code>ssh admin@192.168.1.1</code> ใช้ admin password เดียวกับ web UI',
      'ดาวน์โหลด Asuswrt-Merlin จาก <strong>asuswrt-merlin.net</strong> (ไม่ใช่ 3rd party site)',
      'Firmware Update → upload .trx file → รอ router reboot',
      'หลัง Merlin: เข้า SSH อีกครั้ง → รัน <code>amtm</code> (ASUS Merlin Terminal Menu)',
      'ติดตั้ง Entware ผ่าน amtm → ติดตั้ง AdGuard, WireGuard, Diversion script ฯลฯ'
    ],
    code: `ssh admin@192.168.1.1

# รัน amtm:
amtm

# ติดตั้ง Entware ผ่าน amtm:
# ep → i → ติดตาม wizard

# ติดตั้ง package:
opkg install adguardhome wireguard-tools nano`,
    tip:`<strong>💡 WS Tech Tip:</strong> RT-AX88U + Merlin + Entware คือ <strong>sweet spot</strong> ที่ดีที่สุดสำหรับคนที่ต้องการ features ขั้นสูงโดยไม่เรียนรู้ OpenWrt — amtm จัดการ Entware, AdGuard, FlexQoS และ scripts ผ่าน interactive menu ง่ายมาก ทีม WS แนะนำรุ่นนี้ให้กับ beginner ทุกคน`,
    warning:`<strong>⚠️ OpenWrt ไม่รองรับ BCM4908 Wi-Fi</strong> — Broadcom proprietary driver ทำให้ custom firmware เต็มรูปแบบเป็นไปไม่ได้ Merlin คือทางเลือกที่ <strong>ถูกต้องที่สุด</strong> สำหรับรุ่นนี้`,
    after:['Asuswrt-Merlin','Entware ecosystem','AdGuard Home','WireGuard via Merlin','FlexQoS','JFFS2 Scripts','AiMesh node']
  },

  /* ══════════════════════ ASUS TUF-AX4200 ══════════════════════ */
  tufax4200: {
    cls:'c-asus', icon:'ASUS',
    name:'ASUS TUF-AX4200',
    chip:'MediaTek MT7986A Filogic 830 · Wi-Fi 6 · AX4200 · 2.5G WAN',
    diff:'easy', diffLbl:'ง่าย / Easy',
    riskCls:'low', riskLbl:'ต่ำ',
    overview:`TUF-AX4200 ใช้ Filogic 830 ซึ่ง OpenWrt รองรับ official ตั้งแต่ 23.05.x สมบูรณ์ hardware NAT offload ให้ throughput ใกล้ wire speed และมี UART test pads ที่รับ pogo pin <strong>โดยไม่ต้องบัดกรี</strong> — recovery ง่ายมาก`,
    steps:[
      'Enable SSH ก่อน: Administration → System → SSH Daemon → LAN Only → Apply',
      'ดาวน์โหลด OpenWrt factory image (.trx) สำหรับ "ASUS TUF-AX4200" จาก firmware-selector.openwrt.org',
      'Firmware Update → upload factory .trx → รอ reboot (อย่า interrupt!)',
      'SSH เข้า: <code>ssh root@192.168.1.1</code> → ตั้ง password ทันที',
      'ติดตั้ง LuCI: <code>opkg update && opkg install luci luci-ssl</code>',
      'UART recovery: test pads บน PCB (TX/RX/GND) รับ pogo pin, 115200 baud — สำหรับกรณี brick'
    ],
    code: `# Flash via SSH (alternative):
scp openwrt-factory.trx root@192.168.1.1:/tmp/
ssh root@192.168.1.1 "mtd write /tmp/openwrt-factory.trx firmware"

# Enable HW NAT หลัง install:
opkg update && opkg install kmod-nft-offload
echo "net.netfilter.nf_flow_table_hw_offload=1" >> /etc/sysctl.conf
reboot`,
    tip:`<strong>💡 WS Tech Tip:</strong> ทีม WS ทำ <strong>pogo-pin jig</strong> จาก 3D-printed bracket ไว้สำหรับ UART recovery — ทำให้ recover จาก brick ได้ใน 5 นาทีโดยไม่ต้องบัดกรี แนะนำ print ไว้ก่อน flash เสมอ OpenWrt 24.10.1+ fix boot issue บางอย่างที่ 24.10.0 มี ใช้ 24.10.1+ เท่านั้น`,
    warning:`<strong>⚠️ ใช้ OpenWrt 24.10.1 ขึ้นไป</strong> — version 24.10.0 มี boot issue บางกรณีที่ทำให้ต้อง UART recovery อย่า flash 24.10.0`,
    after:['Full OpenWrt LuCI','HW NAT Offload','WireGuard','AdGuard Home','2.5G WAN full-speed','VLAN 802.1Q','SQM/Cake QoS']
  },

  /* ══════════════════════ ZTE F6600 ══════════════════════ */
  f6600: {
    cls:'c-zte', icon:'ZTE',
    name:'ZTE F6600 (NT / AIS GPON)',
    chip:'ZTE Proprietary SoC · GPON ONU · ISP-Managed',
    diff:'hard', diffLbl:'ยาก / Expert',
    riskCls:'high', riskLbl:'สูง',
    overview:`ZTE F6600 คือ GPON ONU ที่ NT และ AIS แจกให้ลูกค้า fiber อุปกรณ์นี้ถูก <strong>register MAC/SN กับ OLT ของ ISP</strong> การ flash firmware ใหม่จะทำให้ internet ดับทันที เนื่องจาก OLT authentication fail<br><br>วิธีที่ <strong>ปลอดภัยและได้ผล</strong> ที่สุดคือ: <strong>ขอ Bridge Mode จาก ISP</strong> แล้วต่อ router ของตัวเองเข้า`,
    steps:[
      '<strong>ห้าม flash custom firmware เด็ดขาด</strong> — ISP register MAC/SN กับ OLT ถ้า firmware ผิด = internet ดับถาวร',
      'ดาวน์โหลด config backup (.bin) จาก diagnostic page: <code>http://192.168.1.1/cgi-bin/qcmap_web_cgi</code>',
      'ใช้ <strong>zte-config-utility</strong> (GitHub) decrypt config.bin เพื่อดึง PPPoE credential',
      'Algorithm: AES-128-ECB, key derive จาก "ZXHN" + model + serial (WS Tech research)',
      'วิธีที่แนะนำ: โทร <strong>NT: 1888</strong> หรือ <strong>AIS: 1175</strong> → ขอ "ตั้งค่า Bridge Mode / PPPoE Passthrough"',
      'หลัง Bridge Mode: ต่อ router ของตัวเอง ใส่ PPPoE user/pass จาก ISP ใช้งานได้ปกติ'
    ],
    code: `# ใช้ zte-config-utility:
git clone https://github.com/mkst/zte-config-utility
cd zte-config-utility
pip install pycryptodome
python3 decode.py encode config.bin config_decoded.xml

# ค้นหา PPPoE ใน config:
grep -i "pppoe\|username\|password" config_decoded.xml`,
    tip:`<strong>💡 WS Tech Tip:</strong> ZTE ใช้ AES-128-ECB สำหรับ config encryption โดย key derive จาก <em>"ZXHN" + model_name + serial_number_partial</em> — นี่คือ discovery ที่ทีม WS ค้นพบจากการ reverse engineer firmware binary ใช้ <code>zte-config-utility</code> ซึ่ง implement algorithm นี้แล้ว`,
    warning:`<strong>⚠️ อุปกรณ์ที่ ISP ยังเป็นเจ้าของ</strong> — F6600 ที่ NT/AIS แจกมายังเป็นทรัพย์สินของ ISP ทางกฎหมาย การแก้ไข firmware อาจผิดสัญญาและทำให้ internet ถูกตัด`,
    after:['Bridge Mode (แนะนำที่สุด)','PPPoE Credential Extraction','Custom DNS บน stock','TR-069 research mode']
  },

  /* ══════════════════════ ZTE F6107 ══════════════════════ */
  f6107: {
    cls:'c-zte', icon:'ZTE',
    name:'ZTE F6107A (NT / TOT GPON)',
    chip:'MediaTek MT7628 · EPON/GPON ONU · ISP-Managed',
    diff:'hard', diffLbl:'ยาก / Hard',
    riskCls:'high', riskLbl:'สูง',
    overview:`F6107A เป็นรุ่นเก่ากว่าที่ NT/TOT ใช้ — มี UART pad หาง่ายกว่า F6600 และ firmware บาง version <strong>เปิด Telnet ไว้โดย default</strong> ด้วย credential ที่ยังเป็น factory default ทำให้เข้าถึง busybox shell ได้โดยตรง`,
    steps:[
      'ลอง Telnet ก่อน: <code>telnet 192.168.1.1</code> — credential: <strong>root / Zte521</strong> หรือ admin/admin',
      'ตรวจ port: <code>nmap -p 23 192.168.1.1</code> หรือ <code>nc -zv 192.168.1.1 23</code>',
      'ถ้า Telnet ได้: รัน <code>cat /etc/passwd</code>, <code>cat /proc/mtd</code> เพื่อ explore',
      'ถ้า Telnet ไม่ได้: ใช้ zte-config-utility decrypt config backup แทน',
      'UART: ถอด case → probe PCB หา TX/RX/GND (3.3V เท่านั้น, 115200 baud)',
      'วิธีที่ปลอดภัยสุด: โทร <strong>NT: 1888</strong> ขอ "Bridge Mode"'
    ],
    code: `# ลอง Telnet:
telnet 192.168.1.1
# login: root
# Password: Zte521

# หลังเข้า shell:
cat /etc/passwd
cat /proc/mtd
busybox ps
# ดู PPPoE config:
cat /etc/ppp/pppoe.conf 2>/dev/null || \
  find /etc -name "*.conf" | xargs grep -l pppoe`,
    tip:`<strong>💡 WS Tech Tip:</strong> F6107A บาง lot จาก NT มี Telnet เปิดไว้ default — ทีม WS พบ lot ที่ผลิตปี 2021-2022 มีโอกาสสูงที่ยังใช้ default credential <em>root:Zte521</em> Pantip.com มี thread รวม credential ของแต่ละ lot ไว้เยอะมาก ค้นหา "NT router F6107 root" จะพบข้อมูล community`,
    warning:`<strong>⚠️ UART ต้องใช้ 3.3V logic level เท่านั้น</strong> — ห้ามใช้ USB-TTL adapter 5V เพราะจะเผา GPIO ของ MT7628 ถาวร ต้องใช้ adapter ที่รองรับ 3.3V หรือใช้ voltage divider`,
    after:['Telnet Root Shell (read-only)','PPPoE Credential Extraction','Bridge Mode (แนะนำ)','Config Research','Custom DNS บน stock']
  },

  /* ══════════════════════ ISP OEM ══════════════════════ */
  ispoem: {
    cls:'c-isp', icon:'ISP',
    name:'TOT / NT / AIS / TRUE — OEM Routers',
    chip:'ZTE / Huawei / Nokia / Sercomm · GPON/EPON · ISP-Locked',
    diff:'hard', diffLbl:'ยาก / Expert',
    riskCls:'high', riskLbl:'สูงมาก',
    overview:`เราเตอร์ OEM ที่ ISP ไทยแจกให้ลูกค้า fiber ส่วนใหญ่เป็น ZTE, Huawei, Nokia หรือ Sercomm ที่ถูก rebrand และ lock ด้วย ISP profile ทีม WS Tech ทดสอบมาแล้วกับ ZTE F6600 (NT), ZTE F670L (AIS), Huawei HG8145V5 (TRUE)<br><br><strong>Rule of thumb:</strong> ถ้า ISP ยังเป็นเจ้าของอุปกรณ์ — ขอ Bridge Mode เป็นวิธีที่ถูกต้องและปลอดภัยที่สุดเสมอ`,
    steps:[
      'ค้นหา Pantip.com: "[model] [ISP] root [ปี]" — community รวบรวม credential ไว้เยอะมาก',
      'ลอง technician credential: <code>telecomadmin / admintelecom</code>, <code>support / support</code>',
      'ดาวน์โหลด config backup จาก web UI แล้วใช้ zte-config-utility หรือ huawei-decryptor decrypt',
      'UART exploration: ถอด case → probe test pad (115200 8N1, 3.3V)',
      '<strong>โทรขอ Bridge Mode:</strong> AIS=1175 / NT=1888 / TRUE=1242 / 3BB=1530 → ระบุ "PPPoE passthrough"',
      'หลัง Bridge Mode: ต่อ router ตัวเองกับ ONT → ใส่ PPPoE credential จาก ISP → ใช้งานได้'
    ],
    code: `# NT F6600 Super Admin credential pattern:
# USERNAME: telecomadmin
# PASSWORD: ดูจาก sticker ใต้เครื่อง หรือ decode จาก config

# Huawei OEM decrypt (HG8145V5):
git clone https://github.com/clippit/huawei-config
python3 decode.py backup.bin

# ตรวจ port ที่เปิด:
nmap -sV -p 22,23,80,443,8080 192.168.1.1`,
    tip:`<strong>💡 WS Tech Tip:</strong> NT F6600 super-admin password มี pattern: derive จาก MAC address ด้วย algorithm <code>base64(md5(mac_bytes + "ZXHN"))</code> — ทีม WS ค้นพบจากการ dump firmware และ reverse engineer credential generation code ในปี 2023 ข้อมูลนี้ไม่มีใน forum ทั่วไป`,
    warning:`<strong>⚠️ ISP equipment ownership</strong> — อุปกรณ์ที่ ISP แจกมายังเป็น "สิทธิ์ใช้งาน" ไม่ใช่กรรมสิทธิ์ของเรา การ modify firmware อาจผิดสัญญา NT/AIS สามารถ terminate service ได้ถ้าตรวจพบ`,
    after:['Bridge Mode (แนะนำ)','PPPoE Credential Extraction','TR-069 parameter read','Custom DNS บน stock','Port forwarding unlock']
  },

  /* ══════════════════════ HUAWEI AX3 ══════════════════════ */
  huaweiax3: {
    cls:'c-hw', icon:'HW',
    name:'Huawei AX3 / Honor Router 3',
    chip:'HiSilicon Gigahome 650 · Wi-Fi 6 · 3000Mbps · Huawei Proprietary OS',
    diff:'hard', diffLbl:'ยาก / Expert (ผลน้อย)',
    riskCls:'high', riskLbl:'สูง',
    overview:`Huawei AX3 และ Honor Router 3 ใช้ HiSilicon Gigahome platform ของตัวเอง — CPU, Wi-Fi chip, OS เป็น proprietary ทั้งหมด <strong>OpenWrt ไม่รองรับและไม่มีแผนจะรองรับ</strong> เพราะ Wi-Fi driver ปิดสนิท<br><br>การ "unlock" จึงหมายถึงแค่การเข้าถึง stock firmware shell เพื่อ explore ไม่ใช่ custom firmware`,
    steps:[
      'ยอมรับข้อเท็จจริง: <strong>OpenWrt เป็นไปไม่ได้</strong> สำหรับ HiSilicon Gigahome platform',
      'UART research: probe PCB หา TX/RX/GND pad ด้วย multimeter (3.3V, 115200 baud)',
      'Boot log อ่านได้ผ่าน UART แต่ production shell มักถูก lock',
      'ลอง web exploit: ค้นหา CVE สำหรับ Huawei router รุ่นนั้นๆ บน exploit-db.com',
      'ใช้เป็น Wireless AP ข้างหลัง router OpenWrt ตัวอื่น — นี่คือ best use case',
      'ถ้าต้องการ mod จริงๆ: ขาย/exchange แล้วซื้อ GL.iNet หรือ ASUS TUF-AX4200 แทน'
    ],
    code: `# UART connection (exploration only):
# Connect: TX→RX, RX→TX, GND→GND (3.3V!)
screen /dev/ttyUSB0 115200
# หรือ:
minicom -D /dev/ttyUSB0 -b 115200

# Boot log จะแสดงขึ้นมา (read-only ส่วนใหญ่)`,
    tip:`<strong>💡 WS Tech Tip:</strong> Huawei ทำ vertical integration สมบูรณ์แบบ — CPU ของตัวเอง, Wi-Fi ของตัวเอง, OS ของตัวเอง ทำให้เป็น <strong>router ที่ modder-hostile ที่สุด</strong> ในตลาด consumer ถ้าเห็นราคาถูกบน Lazada อย่าซื้อมาหวัง mod — เอาไว้ใช้งาน stock เท่านั้น`,
    warning:`<strong>⚠️ ไม่มี OpenWrt support และจะไม่มีในอนาคตอันใกล้</strong> — ถ้าซื้อมาเพื่อ mod คือเสียเงินเปล่า สำหรับ modder รุ่นนี้ไม่มีประโยชน์`,
    after:['ใช้เป็น Wi-Fi AP mode','Home Assistant monitoring (stock API)','Stock firmware ล้วน','ขาย/exchange แนะนำ']
  },

  /* ══════════════════════ GL.iNet Beryl AX ══════════════════════ */
  berylax: {
    cls:'c-gl', icon:'GL',
    name:'GL.iNet MT3000 Beryl AX',
    chip:'MediaTek MT7981B Filogic 820 · Wi-Fi 6 · AX3000 · Travel Router',
    diff:'easy', diffLbl:'ง่ายมาก / Beginner-Friendly',
    riskCls:'low', riskLbl:'ต่ำมาก',
    overview:`Beryl AX คือ <strong>"OpenWrt by design"</strong> — ship มาพร้อม OpenWrt-based firmware และเปิด SSH ให้ใช้ได้ default เหมาะสำหรับผู้เริ่มต้น Uboot-WebUI recovery mode ช่วยให้ recover จาก brick ได้ด้วย browser เสมอ`,
    steps:[
      'เปิดเครื่อง → เข้า 192.168.8.1 → ตั้ง admin password',
      'Settings → SSH → Enable → Apply (เปิดได้ทันที)',
      'SSH เข้า: <code>ssh root@192.168.8.1</code>',
      'ใช้ <code>opkg install</code> ติดตั้ง package ต่างๆ',
      'Flash vanilla OpenWrt: กด reset ค้างขณะ power on → browser เข้า 192.168.1.1 → Uboot-WebUI'
    ],
    code: `ssh root@192.168.8.1

# Update opkg:
opkg update

# ติดตั้ง AdGuard Home:
opkg install adguardhome

# ติดตั้ง WireGuard:
opkg install wireguard-tools kmod-wireguard luci-proto-wireguard

# Flash vanilla OpenWrt (Uboot recovery):
# กด reset ค้าง 5 วินาทีขณะ power on → เข้า 192.168.1.1`,
    tip:`<strong>💡 WS Tech Tip:</strong> Uboot-WebUI recovery mode (กด reset ค้าง 5 วิ ตอน power on) ให้ <strong>web-based flash interface ที่ใช้งานง่ายมาก</strong> — หมายความว่า brick ไม่ได้จริงๆ recover ได้ด้วย browser + ethernet ทุกครั้ง ทีม WS ใช้ Beryl AX เป็น travel VPN router ประจำ รัน WireGuard ได้ ~300 Mbps`,
    warning:`<strong>⚠️ Storage จำกัด</strong> — NAND flash มีพื้นที่จำกัด ถ้าต้องการ package เยอะให้ใช้ GL.iNet Flint 2 (8GB eMMC) แทน`,
    after:['OpenWrt-based pre-installed','WireGuard VPN ~300Mbps','OpenVPN','AdGuard Home','Shadowsocks/V2Ray','Tor','Travel Router']
  },

  /* ══════════════════════ GL.iNet Flint 2 ══════════════════════ */
  flint2: {
    cls:'c-gl', icon:'GL',
    name:'GL.iNet Flint 2 (MT6000)',
    chip:'MediaTek MT7986A Filogic 830 · Wi-Fi 6 · AX6000 · 8GB eMMC · 1GB RAM',
    diff:'easy', diffLbl:'ง่ายมาก / Beginner-Friendly',
    riskCls:'low', riskLbl:'ต่ำมาก',
    overview:`Flint 2 คือ <strong>flagship ของ GL.iNet</strong> ที่ใช้ Filogic 830 และมี <strong>8GB eMMC storage</strong> ทำให้รัน Docker containers และ multiple services พร้อมกันได้ เป็น "router SBC" ที่ทรงพลังที่สุดในราคา consumer — WireGuard throughput ถึง <strong>900+ Mbps</strong>`,
    steps:[
      'เปิดเครื่อง → 192.168.8.1 → ตั้ง admin password → SSH เข้าได้ทันที',
      'สำรวจ /overlay — 8GB eMMC ให้พื้นที่ package มหาศาล',
      'ติดตั้ง Docker plugin ผ่าน GL admin panel → Plugins → Docker',
      'รัน container: AdGuard Home, WireGuard, Shadowsocks, Mosquitto MQTT',
      'Extroot: mount /overlay บน eMMC partition เพื่อ maximize พื้นที่',
      'Flash vanilla OpenWrt: Uboot-WebUI recovery เหมือน Beryl AX'
    ],
    code: `ssh root@192.168.8.1

# ดู eMMC layout:
lsblk
df -h

# ติดตั้ง Docker:
opkg update && opkg install docker dockerd

# รัน AdGuard Home:
docker run -d --name adguard \
  -p 3000:3000 -p 53:53/tcp -p 53:53/udp \
  --restart unless-stopped \
  adguard/adguardhome

# รัน WireGuard (test throughput):
iperf3 -c [server-ip] -t 30 -P 4`,
    tip:`<strong>💡 WS Tech Tip:</strong> ทีม WS รัน <em>AdGuard Home + WireGuard + Shadowsocks-rust + Mosquitto MQTT + Node-RED</em> พร้อมกันบน Flint 2 โดยไม่มีปัญหา storage เลย — ใช้ <strong>extroot</strong> mount /overlay บน eMMC เพื่อได้พื้นที่เต็ม 8GB WireGuard throughput จริง: <strong>920 Mbps</strong> บน 1Gbps fiber`,
    warning:`<strong>⚠️ eMMC recovery ซับซ้อนกว่า NAND</strong> แต่ Uboot-WebUI ยังทำงาน — ทำ backup /etc config ก่อน flash vanilla OpenWrt เสมอ`,
    after:['Full OpenWrt LuCI','Docker Containers (8GB storage)','WireGuard ~920Mbps','AdGuard Home','NAS via USB 3.0','Shadowsocks/V2Ray','MQTT Broker + Node-RED']
  },

  /* ══════════════════════ MikroTik hAP ax3 ══════════════════════ */
  hapax3: {
    cls:'c-mt', icon:'MK',
    name:'MikroTik hAP ax3',
    chip:'Qualcomm IPQ-6010 · Wi-Fi 6 · RouterOS 7 · Perpetual License',
    diff:'easy', diffLbl:'Open by Default — ไม่ต้องปลดล็อค',
    riskCls:'low', riskLbl:'ต่ำมาก',
    overview:`MikroTik เป็น <strong>"open by design"</strong> — RouterOS ให้ full control ผ่าน Winbox, SSH, API ตั้งแต่ออกจากกล่อง RouterOS 7 รองรับ <strong>Container (Docker)</strong> ทำให้รัน AdGuard, WireGuard server และ service ต่างๆ ได้เลย<br><br>MikroTik ถูกใช้ใน production ISP, enterprise network — reliability level สูงมาก`,
    steps:[
      'เปิดเครื่อง → ดาวน์โหลด <strong>Winbox</strong> จาก mikrotik.com (Windows/Linux/Mac)',
      'Login: admin / password ว่าง → <strong>ตั้ง password ทันทีที่เข้าได้</strong>',
      'Update RouterOS: /system package update install → reboot',
      'Enable SSH: /ip service enable ssh (port 22)',
      'ติดตั้ง Container package: /system/package/add name=container → reboot → enable container mode',
      'รัน Docker container: AdGuard Home, WireGuard server, etc.'
    ],
    code: `/system package update install
/ip service enable ssh
/ip service enable api-ssl

# Enable container mode:
/system/resource/set usb-power-reset-timer=never
/system/package/add name=container
# reboot แล้ว:
/container/config/set registry-url=https://registry-1.docker.io
/container/add remote-image=adguard/adguardhome interface=veth1`,
    tip:`<strong>💡 WS Tech Tip:</strong> RouterOS Container support ทำให้ hAP ax3 เป็น all-in-one: Router + VPN Server + AdBlock + Monitoring ในกล่องเดียว ทีม WS ใช้ hAP ax3 เป็น <strong>production home router</strong> มา 2 ปีแล้วโดยไม่มีปัญหา — reliability ดีกว่า consumer router ทั่วไปมาก BGP, OSPF, MPLS ก็รองรับถ้าต้องการ`,
    warning:`<strong>⚠️ Learning curve สูงกว่า consumer router</strong> — RouterOS มี concept ที่ต่างจาก OpenWrt มาก แนะนำอ่าน MikroTik official wiki ก่อนตั้งค่า firewall เพราะ default config เปิด port หลายอย่างที่ต้องปิด`,
    after:['RouterOS Full Control','Container/Docker Support','AdGuard Home','WireGuard Server','BGP/OSPF/MPLS Routing','Bandwidth Queue','Hotspot Manager','CAPsMAN WiFi Controller']
  },

  /* ══════════════════════ NETGEAR RAX50 ══════════════════════ */
  rax50: {
    cls:'c-ng', icon:'NG',
    name:'Netgear Nighthawk RAX50',
    chip:'Qualcomm IPQ8074 Quad-Core · Wi-Fi 6 · AX5400 · 1.4GHz',
    diff:'medium', diffLbl:'ปานกลาง / Medium',
    riskCls:'med', riskLbl:'กลาง',
    overview:`Nighthawk RAX50 ใช้ Qualcomm IPQ8074 ที่ดีมาก แต่ Netgear ใช้ <strong>signed firmware</strong> ทำให้ flash custom firmware ตรงๆ ไม่ได้ วิธีที่ community พัฒนาไว้คือ <strong>"Magic Packet" Telnet exploit</strong> ที่ให้ busybox root shell บน stock firmware ชั่วคราว`,
    steps:[
      'ตรวจ firmware — magic packet ทำงานกับ firmware ก่อน V7.x ได้ดีที่สุด',
      'ดาวน์โหลด <code>telnetenable.py</code> จาก github.com/insanid/netgear-telnetenable',
      'รัน: <code>python telnetenable.py &lt;router-ip&gt; &lt;mac&gt; admin &lt;password&gt;</code>',
      'Telnet เข้า: <code>telnet 192.168.1.1</code> → ได้ busybox root shell',
      'Shell นี้ <strong>ไม่ persistent</strong> — หายหลัง reboot ต้องรัน exploit ใหม่',
      'ใช้ shell เพื่อ extract config, ดู PPPoE, ตั้ง custom DNS ชั่วคราว'
    ],
    code: `# Magic Packet Exploit:
git clone https://github.com/insanid/netgear-telnetenable
cd netgear-telnetenable
pip install pycryptodome

python3 telnetenable.py 192.168.1.1 AA:BB:CC:DD:EE:FF admin "router_password"

# หลัง enable:
telnet 192.168.1.1
busybox ash

# ค้นหา PPPoE config:
grep -r "pppoe\|username" /etc/ 2>/dev/null`,
    tip:`<strong>💡 WS Tech Tip:</strong> Magic packet trick เป็น classic ของ Netgear ทีม WS ใช้ shell นี้เพื่อ extract PPPoE password จาก nvram, set custom DNS ชั่วคราว และรัน monitoring script ไม่แนะนำให้พยายาม flash OpenWrt เพราะยังไม่มี stable community port สำหรับ RAX50 โดยเฉพาะ`,
    warning:`<strong>⚠️ ไม่มี OpenWrt official support สำหรับ RAX50</strong> — อย่า flash IPQ8074 image แบบ generic เพราะ Device Tree ไม่ตรง = hard brick`,
    after:['Temporary Root Shell (stock)','PPPoE Credential Extraction','Custom DNS (non-persistent)','Config/nvram Research','DD-WRT (partial, community)']
  },

  /* ══════════════════════ Mercusys MR90X ══════════════════════ */
  mr90x: {
    cls:'c-tp', icon:'MC',
    name:'Mercusys MR90X v1 (AX6000)',
    chip:'MediaTek MT7986B Filogic 830 · Wi-Fi 6 · AX6000 · 2.5G+1G WAN',
    diff:'easy', diffLbl:'ง่าย / Easy',
    riskCls:'low', riskLbl:'ต่ำ',
    overview:`Mercusys MR90X v1 คือ <strong>best-value OpenWrt router</strong> ในราคาระดับกลาง — ใช้ Filogic 830 เหมือน ASUS TUF-AX4200 แต่ราคาถูกกว่ามาก มี <strong>dual 2.5GbE port</strong> และ hardware NAT offload ให้ throughput <strong>1.8 Gbps+</strong> จริง<br><br>OpenWrt รองรับ official ตั้งแต่ 23.05.x`,
    steps:[
      '<strong>ตรวจ v1 เท่านั้น</strong> — MR90X v2 ใช้ chipset ต่างออกไปและยังไม่รองรับ OpenWrt',
      'ดาวน์โหลด OpenWrt <strong>initramfs</strong> image สำหรับ "Mercusys MR90X v1" จาก firmware-selector.openwrt.org',
      'Stock firmware → Software Update → upload initramfs .bin → device boot เข้า OpenWrt ชั่วคราว',
      'SSH ทันที: <code>ssh root@192.168.1.1</code> (ยังไม่มี password)',
      'Upload sysupgrade image: <code>scp openwrt-sysupgrade.bin root@192.168.1.1:/tmp/</code>',
      'รัน: <code>sysupgrade -n /tmp/openwrt-sysupgrade.bin</code> → reboot → persistent'
    ],
    code: `# Step 1: SSH หลัง initramfs boot:
ssh root@192.168.1.1   # ไม่มี password

# Step 2: Upload sysupgrade:
scp openwrt-mr90x-sysupgrade.bin root@192.168.1.1:/tmp/

# Step 3: Flash permanent:
sysupgrade -n /tmp/openwrt-mr90x-sysupgrade.bin

# Step 4: หลัง reboot - enable HW NAT:
opkg update
opkg install kmod-nft-offload luci luci-ssl
echo "net.netfilter.nf_flow_table_hw_offload=1" >> /etc/sysctl.conf
reboot`,
    tip:`<strong>💡 WS Tech Tip:</strong> MR90X + OpenWrt + HW offload = NAT throughput <strong>1.85 Gbps จริง</strong> (ทดสอบโดยทีม WS บน NT 1Gbps fiber) คุ้มค่าที่สุดในราคา ~฿2,500-3,000 หลัง flash ให้ติดตั้ง <code>kmod-nft-offload</code> ทันที และ check 2.5G port: <code>ethtool eth1 | grep Speed</code>`,
    warning:`<strong>⚠️ v1 เท่านั้น</strong> — ตรวจ hardware revision label ก่อน flash ถ้าไม่แน่ใจ ให้ post รูป PCB บน OpenWrt forum ก่อน`,
    after:['Full OpenWrt LuCI','HW NAT 1.85Gbps+','WireGuard VPN','AdGuard Home','Dual 2.5GbE Active','SQM QoS','VLAN 802.1Q','TR-069 Disabled']
  }

}; /* END ROUTERS */

/* ─────────────── SMOOTH SCROLL OFFSET ─────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─────────────── INTERSECTION OBSERVER (card fade-in) ─────────────── */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.card, .tool-card, .abox').forEach(el => io.observe(el));
}
