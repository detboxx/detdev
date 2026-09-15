/* app.js v3.1 — WS Tech Router Lab (Fixed) */

// ---- Navbar scroll ----
window.addEventListener('scroll', () => {
    const nb = document.getElementById('navbar');
    if (nb) nb.classList.toggle('scrolled', window.scrollY > 40);
});

// ---- Mobile menu ----
const mobileBtn = document.getElementById('mobileMenuBtn');
const navLinks  = document.getElementById('navLinks');
if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    document.querySelectorAll('.nav-link').forEach(l =>
        l.addEventListener('click', () => navLinks.classList.remove('open'))
    );
}

// ---- Filter ----
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const f = this.dataset.filter;
        document.querySelectorAll('.router-card').forEach(card => {
            if (f === 'all') {
                card.classList.remove('hidden');
            } else if (f === 'thai') {
                card.classList.toggle('hidden', !card.dataset.thai);
            } else {
                card.classList.toggle('hidden', card.dataset.difficulty !== f);
            }
        });
    });
});

// ---- Router Data ----
const DB = {
    'xiaomi-ax3000t': {
        cls:'xiaomi', icon:'MI', title:'Xiaomi AX3000T', chip:'MediaTek MT7981B · Wi-Fi 6 · AX3000',
        diff:'easy', diffLbl:'ง่าย / Easy', risk:'low', riskLbl:'ต่ำ',
        overview:`AX3000T เป็นหนึ่งในเราเตอร์ที่ง่ายที่สุดในการปลดล็อค เนื่องจาก Xiaomi ใช้ระบบ API ภายในที่ไม่ได้ป้องกัน authentication ครบถ้วน ทำให้สามารถเปิด SSH ได้โดยไม่ต้อง downgrade firmware หรือใช้อุปกรณ์พิเศษ<br><br><em>⚠️ ตรวจสอบว่าคุณมี RD03 ไม่ใช่ RD03v2 — version ใหม่นั้น chipset ต่างออกไปและ OpenWrt ยังไม่รองรับ mainline</em>`,
        steps:[
            'ตรวจสอบ label ใต้เครื่อง: RD03 = MediaTek MT7981B (รองรับ), RD03v2 = Qualcomm IPQ5018 (แยก repo)',
            'ดาวน์โหลด xmir-patcher และ Python 3 ติดตั้งให้เรียบร้อย',
            'รัน: python xmir-patcher.py เลือก "Enable SSH" จาก menu',
            'SSH เข้า: ssh root@192.168.31.1 — ก่อน flash ให้รัน cat /proc/mtd เพื่อ backup partition',
            'Flash custom U-Boot bootloader ก่อน แล้วตามด้วย OpenWrt sysupgrade image'
        ],
        tip:`💡 <strong>เทคนิคพิเศษจาก WS:</strong> รัน <code>cat /proc/mtd</code> หลัง SSH เข้าได้ เพื่อ backup ART partition — นั่นคือ Wi-Fi calibration data ถ้าหายไปโดยไม่มี backup, radio จะทำงานผิดปกติถาวร Xiaomi patch exploit นี้บ่อยมาก ถ้า firmware ใหม่กว่า 1.0.47 อาจต้อง downgrade ก่อน`,
        warn:'⚠️ ห้ามใช้ firmware จาก YouTube หรือ blog ที่ไม่น่าเชื่อถือ ใช้ OpenWrt Firmware Selector เท่านั้น',
        code:'ssh root@192.168.31.1\n# หลัง login:\ncat /proc/mtd        # ดู partition layout\ncat /proc/version    # ตรวจ kernel version',
        after:['Full OpenWrt','AdGuard Home','WireGuard VPN','VLAN','Bandwidth Monitor','Entware']
    },
    'xiaomi-ax9000': {
        cls:'xiaomi', icon:'MI', title:'Xiaomi AX9000', chip:'Qualcomm IPQ8072A Quad-Core · Wi-Fi 6 Tri-band',
        diff:'medium', diffLbl:'ปานกลาง / Medium', risk:'medium', riskLbl:'กลาง',
        overview:`AX9000 ใช้ chipset Qualcomm IPQ8072A ที่ทรงพลัง มี 2.5G gaming port และ tri-band radio OpenWrt รองรับ official ตั้งแต่ 23.05.x แต่ต้องระวัง: firmware version ใหม่กว่า 1.0.82 อาจต้อง downgrade ก่อนทำ exploit`,
        steps:[
            'ตรวจสอบ firmware version — ถ้าเกิน 1.0.82 ให้ downgrade ผ่าน Xiaomi อย่างเป็นทางการก่อน',
            'ใช้ SN-based key generator tool จาก community เพื่อ generate unlock payload',
            'Enable Telnet ผ่าน payload, เข้า Telnet แล้ว set SSH root password',
            'Backup ทุก partition ก่อน flash โดยเฉพาะ ART — Qualcomm Wi-Fi calibration อยู่ใน nvmem nodes',
            'Flash OpenWrt factory image แล้ว sysupgrade — device ใช้ A/B partition scheme'
        ],
        tip:`💡 <strong>เทคนิคพิเศษจาก WS:</strong> AX9000 รัน HOT มากบน OpenWrt เพราะ stock thermal management หายไป ทำอันดับแรกหลัง flash คือเช็ค CPU temp: <code>cat /sys/class/thermal/thermal_zone*/temp</code> แล้วพิจารณา set fan control script หรือปรับ airflow ก่อน`,
        warn:'⚠️ International version มี secure boot ที่ยากกว่า Chinese version มาก ตรวจสอบ variant ก่อนเริ่ม',
        code:'# หลัง SSH เข้าได้:\ncat /sys/class/thermal/thermal_zone*/temp\n# ตรวจ 2.5G port:\nip link show | grep -i eth',
        after:['Full OpenWrt','4804Mbps Gaming Radio','WireGuard HW Offload','QoS/SQM','Entware','Custom DNS']
    },
    'xiaomi-be7000': {
        cls:'xiaomi', icon:'MI', title:'Xiaomi BE7000 (Wi-Fi 7)', chip:'Qualcomm IPQ9574 · Wi-Fi 7 · BE7000',
        diff:'hard', diffLbl:'ยาก / Hard', risk:'high', riskLbl:'สูง',
        overview:`BE7000 เป็น Wi-Fi 7 รุ่นใหม่ที่ยังอยู่ใน early exploration OpenWrt mainline ยังไม่รองรับ IPQ9574 แต่ stock firmware รองรับ Docker ซึ่งเป็น workaround ที่ดีที่สุดในตอนนี้`,
        steps:[
            'ใช้ xmir-patcher เพื่อ enable SSH ชั่วคราวบน stock firmware',
            'SSH นี้ไม่ persistent — ต้องรัน exploit ใหม่ทุกครั้งหลัง reboot',
            'ห้าม flash OpenWrt IPQ9574 images จาก GitHub fork ที่ไม่มี community รับรอง',
            'วิธีที่ดีที่สุด: รัน Docker container บน stock firmware (AdGuard, WireGuard)',
            'ติดตาม OpenWrt forum thread สำหรับ IPQ95xx — รอ mainline support'
        ],
        tip:`💡 <strong>เทคนิคพิเศษจาก WS:</strong> BE7000 stock firmware รองรับ Docker containers ซึ่งหมายความว่าคุณรัน AdGuard Home, Pi-hole หรือแม้แต่ WireGuard inside container ได้เลยโดยไม่ต้องแตะ base system — นี่คือ best power-user move ขณะรอ OpenWrt mainline`,
        warn:'⚠️ Wi-Fi 7 kernel driver ecosystem ยังไม่ open-source พร้อม การ flash จะสูญเสีย Wi-Fi หรือ brick อุปกรณ์ได้',
        code:'# Docker บน stock firmware:\ndocker pull adguard/adguardhome\ndocker run -d --name adguard adguard/adguardhome',
        after:['Docker on Stock (AdGuard, WireGuard)','SSH Exploration','Future: Full OpenWrt (TBD)']
    },
    'redmi-ax6000': {
        cls:'xiaomi', icon:'MI', title:'Redmi AX6000', chip:'MediaTek MT7986A (Filogic 830) · Wi-Fi 6 · AX6000',
        diff:'medium', diffLbl:'ปานกลาง / Medium', risk:'medium', riskLbl:'กลาง',
        overview:`Redmi AX6000 ใช้ Filogic 830 เช่นเดียวกับ ASUS TUF-AX4200 ทำให้ OpenWrt performance ดีเยี่ยม community พัฒนา SSH exploit tool ไว้ให้แล้ว และ hardware NAT offload ให้ throughput สูงมาก`,
        steps:[
            'ดาวน์โหลด exploit tool จาก community (xiaomi-ax6000-exploit บน GitHub)',
            'รัน: python exploit.py -t 192.168.31.1 — script จะ enable SSH อัตโนมัติ',
            'SSH เข้า: ssh -oHostKeyAlgorithms=+ssh-rsa root@192.168.31.1',
            'Backup ART partition ก่อน flash: dd if=/dev/mtd จาก cat /proc/mtd',
            'Flash ImmortalWrt หรือ OpenWrt สำหรับ Filogic 830 target'
        ],
        tip:`💡 <strong>เทคนิคพิเศษจาก WS:</strong> AX6000 + ImmortalWrt + HW offload = throughput จริงมากกว่า 2 Gbps NAT — ดีกว่า stock firmware มาก สำหรับสาย performance รุ่นนี้คุ้มที่สุดในราคาระดับเดียวกัน Breed bootloader ช่วยให้ recover ง่ายมากถ้าเกิด brick`,
        warn:'⚠️ Exploit ใช้ได้กับ firmware version ที่จำกัด ตรวจสอบ compatibility ของ firmware version กับ exploit tool ก่อน',
        code:'python exploit.py -t 192.168.31.1\n# หลัง SSH enable:\nssh -oHostKeyAlgorithms=+ssh-rsa root@192.168.31.1',
        after:['ImmortalWrt / OpenWrt','HW Offload 2Gbps+','AdGuard Home','WireGuard','Breed Bootloader']
    },
    'asus-rtax88u': {
        cls:'asus', icon:'ASUS', title:'ASUS RT-AX88U', chip:'Broadcom BCM4908 Quad-Core · Wi-Fi 6 · AX6000',
        diff:'easy', diffLbl:'ง่ายมาก / Very Easy', risk:'low', riskLbl:'ต่ำมาก',
        overview:`RT-AX88U เป็นหนึ่งใน "hacker-friendly" router ที่ดีที่สุดในตลาด เพราะ ASUS เปิด SSH ให้ใช้ได้โดยตรงจาก web UI และ Asuswrt-Merlin firmware เพิ่ม features มากมายโดยไม่เสีย Wi-Fi performance`,
        steps:[
            'เข้า admin panel → Administration → System → Enable SSH → LAN Only → Apply',
            'SSH เข้า: ssh admin@192.168.1.1 ด้วย router admin password',
            'Flash Asuswrt-Merlin: ดาวน์โหลดจาก asuswrt-merlin.net, upload ผ่าน Firmware Update',
            'หลัง Merlin: ใช้ amtm (ASUS Merlin Terminal Menu) ติดตั้ง Entware',
            'ติดตั้ง AdGuard Home, WireGuard หรือ script ต่างๆ ผ่าน Entware'
        ],
        tip:`💡 <strong>เทคนิคพิเศษจาก WS:</strong> RT-AX88U กับ Asuswrt-Merlin + Entware คือ sweet spot ที่ดีที่สุดสำหรับคนที่ต้องการ features ขั้นสูงโดยไม่ต้องเรียนรู้ OpenWrt — amtm script จัดการ Entware, AdGuard, FlexQoS และ script ต่างๆ ผ่าน interactive menu ง่ายมาก`,
        warn:'⚠️ OpenWrt ไม่รองรับ Broadcom BCM4908 Wi-Fi — Merlin คือทางเลือกที่ถูกต้องและดีที่สุดสำหรับรุ่นนี้',
        code:'ssh admin@192.168.1.1\n# ติดตั้ง Entware:\ncurl -fsL --retry 3 "https://bin.entware.net/armv7sf-k3.10/installer/generic.sh" | /bin/sh',
        after:['Asuswrt-Merlin','Entware','AdGuard Home','WireGuard via Merlin','FlexQoS','JFFS Scripts','AiMesh']
    },
    'asus-tufax4200': {
        cls:'asus', icon:'ASUS', title:'ASUS TUF-AX4200', chip:'MediaTek MT7986A (Filogic 830) · Wi-Fi 6 · AX4200',
        diff:'easy', diffLbl:'ง่าย / Easy', risk:'low', riskLbl:'ต่ำ',
        overview:`TUF-AX4200 ใช้ MediaTek Filogic 830 ซึ่ง OpenWrt รองรับ official ตั้งแต่ 23.05.x และ hardware NAT offload ทำงานได้ดีมาก ทำให้ได้ throughput ใกล้ wire speed UART test pads รับ pogo pin ได้โดยไม่ต้องบัดกรี`,
        steps:[
            'Enable SSH ก่อน: Administration → System → Enable SSH → LAN Only',
            'ดาวน์โหลด OpenWrt factory .trx image สำหรับ TUF-AX4200 จาก firmware-selector.openwrt.org',
            'Upload ผ่าน ASUS web UI Firmware Update page (หรือ SSH + fw_setenv)',
            'หลัง reboot: SSH เข้า root@192.168.1.1 ตั้ง password ทันที',
            'ถ้า brick: UART pads บน PCB รับ pogo pin — ใช้ TFTP recovery ผ่าน browser'
        ],
        tip:`💡 <strong>เทคนิคพิเศษจาก WS:</strong> TUF-AX4200 มี UART test pads ที่รับ pogo pin โดยไม่ต้องบัดกรี — ทีม WS ทำ jig จาก 3D-printed bracket ไว้สำรองตลอด ทำให้ recovery จาก brick ทำได้ใน 5 นาที ไม่ต้องกังวลเรื่องทำพัง`,
        warn:'⚠️ ตรวจสอบ OpenWrt wiki สำหรับ TUF-AX4200 ก่อน flash — version 24.10.0 มี boot issue บางตัว ใช้ 24.10.1+ ขึ้นไป',
        code:'# Flash via SSH:\nssh admin@192.168.1.1\nmtd write /tmp/openwrt-factory.trx firmware\n\n# TFTP Recovery:\ntftp 192.168.1.1',
        after:['Full OpenWrt','HW NAT Offload','WireGuard','AdGuard Home','2.5G WAN','VLAN 802.1Q','SQM QoS']
    },
    'zte-f6600': {
        cls:'zte', icon:'ZTE', title:'ZTE F6600 (NT/AIS GPON)', chip:'ZTE Proprietary SoC · GPON ONU · ISP-Locked',
        diff:'hard', diffLbl:'ยาก / Expert', risk:'high', riskLbl:'สูง',
        overview:`ZTE F6600 เป็น GPON ONU ที่ ISP ไทย (NT, AIS) แจกให้ลูกค้า fiber อุปกรณ์นี้ถูก register MAC/SN กับ OLT ของ ISP ดังนั้นการ flash firmware ใหม่จะทำให้ internet ดับทันที<br><br><em>ข้อมูลนี้มาจากการ reverse engineer โดยตรงโดยทีม WS — ไม่มีใน official ZTE documentation</em>`,
        steps:[
            'ห้าม flash custom firmware เด็ดขาด — ISP register MAC/SN กับ OLT ถ้า firmware ผิด = internet ดับ',
            'ดาวน์โหลด config backup (.bin) จาก diagnostic page ของ web UI',
            'ใช้ zte-config-utility (GitHub) decrypt config.bin เพื่อดึง PPPoE credential',
            'วิธีที่ดีที่สุดและปลอดภัยที่สุด: โทรขอ Bridge Mode จาก ISP (AIS: 1175, NT: 1888)',
            'หลัง Bridge Mode: ต่อ router ของตัวเองเข้ากับ ONT แล้วใส่ PPPoE credential'
        ],
        tip:`💡 <strong>เทคนิคพิเศษจาก WS:</strong> ZTE ใช้ AES-128-ECB สำหรับ config encryption โดย key derive จาก "ZXHN" + model + serial number บางส่วน — นี่คือ discovery จากการ reverse ของทีม WS ใช้ zte-config-utility ซึ่ง implement algorithm นี้แล้ว`,
        warn:'⚠️ การแก้ไข GPON ONU อาจขัดเงื่อนไข ISP และถ้า firmware ผิดจะสูญเสีย internet ทั้งบ้าน ทำด้วยความระวัง',
        code:'# ใช้ zte-config-utility:\ngit clone https://github.com/... zte-config-utility\npython zte_config.py decrypt config.bin\n\n# ดู PPPoE credential ใน output',
        after:['Bridge Mode (แนะนำ)','PPPoE Credential Extraction','Custom DNS บน stock','TR-069 research']
    },
    'zte-f6107': {
        cls:'zte', icon:'ZTE', title:'ZTE F6107A (NT/TOT GPON)', chip:'MediaTek MT7628 · EPON/GPON · ISP-Locked',
        diff:'hard', diffLbl:'ยาก / Hard', risk:'high', riskLbl:'สูง',
        overview:`F6107A เป็นรุ่นเก่ากว่า F6600 ที่ NT/TOT ใช้ มี UART pad ที่หาค่อนข้างง่ายกว่า firmware บาง version เปิด Telnet ไว้โดย default ด้วย credential ที่ยังเป็น default`,
        steps:[
            'ลอง Telnet ก่อน: telnet 192.168.1.1 — credential: root/Zte521 หรือ admin/admin',
            'ตรวจสอบ port 23 เปิดหรือไม่: nmap -p 23 192.168.1.1',
            'ถ้า Telnet ไม่ได้: ใช้ zte-config-utility decrypt config backup',
            'UART path: ถอด case หา TX/RX/GND pad (3.3V ห้ามใช้ 5V), baud 115200',
            'ขอ Bridge Mode จาก NT (1888) — วิธีปลอดภัยและง่ายที่สุด'
        ],
        tip:`💡 <strong>เทคนิคพิเศษจาก WS:</strong> F6107A บาง lot มี default Telnet credential: username "root" password "Zte521" ลองก่อนเสมอ — ถ้าเข้าได้จะได้ busybox shell แบบ restricted แต่อ่าน /etc config ได้ Pantip.com มีข้อมูล Thai community สำหรับรุ่นนี้เยอะมาก`,
        warn:'⚠️ UART ต้องใช้ 3.3V logic เท่านั้น — ห้ามใช้ 5V TTL เพราะจะเผา GPIO ของ SoC',
        code:'# ลอง Telnet:\ntelnet 192.168.1.1\nlogin: root\nPassword: Zte521\n\n# หลังเข้า:\ncat /etc/passwd\nbusybox ps',
        after:['Telnet Shell (read-only)','PPPoE Extraction','Bridge Mode (แนะนำ)','Custom DNS research']
    },
    'thai-isp-oem': {
        cls:'isp', icon:'ISP', title:'TOT / NT / AIS OEM Routers', chip:'ZTE/Huawei/Nokia/Fiberhome · GPON/EPON · ISP-Locked',
        diff:'hard', diffLbl:'ยาก / Expert', risk:'high', riskLbl:'สูงมาก',
        overview:`เราเตอร์ OEM ที่ ISP ไทยแจกให้ลูกค้า fiber มักเป็น ZTE, Huawei, Nokia, Sercomm หรือ Fiberhome ที่ถูก rebrand และ lock ด้วย ISP profile ทีม WS มีประสบการณ์ตรงกับ ZTE F6600 (NT), ZTE F670L (AIS), Huawei HG8145V5 (TRUE)`,
        steps:[
            'ค้นหา Pantip.com ด้วยชื่อ model + ISP: "NT fiber F6600 root 2566" — Thai community รวบรวมไว้แล้วเยอะมาก',
            'ลอง default credential ของ ISP technician: telecomadmin/admintelecom, support/support',
            'ใช้ zte-config-utility หรือ huawei-config-decrypt เพื่อ extract PPPoE จาก config backup',
            'โทรขอ Bridge Mode: AIS=1175, NT=1888, TRUE=1242 — ระบุ "ขอ PPPoE passthrough / Bridge Mode"',
            'หลัง Bridge Mode: ซื้อ router ตัวเอง (ASUS/Xiaomi/GL.iNet) ใส่ PPPoE credential ได้เลย'
        ],
        tip:`💡 <strong>เทคนิคพิเศษจาก WS:</strong> NT F6600 super-admin credential derive มาจาก MAC address: algorithm คือ base64(md5(mac[:6] + "ZXHN")) — ทีม WS ค้นพบจากการ dump firmware และ reverse engineer credential generation code`,
        warn:'⚠️ การแก้ไข device ที่ ISP ยังเป็นเจ้าของอยู่อาจผิดกฎหมาย ทำเฉพาะบน device ที่ซื้อมาเป็นของตัวเองเท่านั้น',
        code:'# NT F6600 Super Admin (derived):\nUSERNAME: telecomadmin\nPASSWORD: <base64(md5(mac[:6]+"ZXHN"))>\n\n# Telnet:\ntelnet 192.168.1.1 23',
        after:['Bridge Mode (แนะนำ)','TR-069 disable','PPPoE Extraction','Port Forward unlock','Custom DNS']
    },
    'huawei-ax3': {
        cls:'huawei', icon:'HW', title:'Huawei AX3 / Honor Router 3', chip:'HiSilicon Gigahome 650 · Wi-Fi 6 · Proprietary',
        diff:'hard', diffLbl:'ยาก / Expert (ไม่มีประโยชน์)', risk:'high', riskLbl:'สูง',
        overview:`Huawei AX3 และ Honor Router 3 ใช้ HiSilicon Gigahome platform ของตัวเอง ซึ่ง OpenWrt ไม่รองรับและไม่มีแผนจะรองรับ เพราะ Wi-Fi driver เป็น proprietary ทั้งหมด การ "unlock" จึงหมายถึงแค่การเข้าถึง stock firmware shell เท่านั้น`,
        steps:[
            'ยอมรับว่าเราเตอร์ตัวนี้จะอยู่กับ stock firmware ตลอดไป — OpenWrt เป็นไปไม่ได้',
            'UART research: probe PCB หา TX/RX/GND pad ด้วย multimeter (115200 8N1)',
            'Boot log อ่านได้ผ่าน UART แต่ shell มักถูก lock บน production firmware',
            'ใช้ Huawei AI Life app หรือ web UI (192.168.3.1) เพื่อ management',
            'วิธีที่ดีที่สุด: ใช้เป็น AP mode ข้างหลัง router OpenWrt ตัวอื่น'
        ],
        tip:`💡 <strong>เทคนิคพิเศษจาก WS:</strong> Huawei ทำ vertical integration สมบูรณ์แบบ — CPU ของตัวเอง, Wi-Fi ของตัวเอง, OS ของตัวเอง ทำให้เป็น router ที่ modder-hostile ที่สุดในตลาด consumer ถ้าเห็นราคาถูกบน Lazada อย่าซื้อมาหวัง mod`,
        warn:'⚠️ ไม่มี OpenWrt support และจะไม่มีในอนาคต — สำหรับ modder รุ่นนี้เป็นเงินทิ้งถ้าซื้อมาเพื่อ mod',
        code:'# UART connection (research only):\nscreen /dev/ttyUSB0 115200\n# Boot log readable, shell likely locked',
        after:['Stock Firmware Only','ใช้เป็น AP mode','Home Assistant monitoring (ผ่าน stock API)']
    },
    'glinet-mt3000': {
        cls:'glinet', icon:'GL', title:'GL.iNet Beryl AX (MT3000)', chip:'MediaTek MT7981B (Filogic 820) · Wi-Fi 6 · AX3000',
        diff:'easy', diffLbl:'ง่ายมาก / Beginner-Friendly', risk:'low', riskLbl:'ต่ำมาก',
        overview:`GL.iNet Beryl AX คือ "OpenWrt by design" — ship มาพร้อม OpenWrt-based firmware และ SSH เปิดให้ใช้ได้ default เหมาะที่สุดสำหรับคนที่เริ่มต้นเรียนรู้ router modding Uboot-WebUI ช่วยให้ recovery ง่ายมาก`,
        steps:[
            'เปิดเครื่อง เข้า web UI ที่ 192.168.8.1 ตั้ง admin password',
            'Enable SSH จาก settings → SSH ใช้งานได้ทันที',
            'SSH เข้า: ssh root@192.168.8.1',
            'ใช้ opkg install ติดตั้ง package ต่างๆ — พื้นที่จำกัดบน NAND flash',
            'Flash vanilla OpenWrt ผ่าน Uboot-WebUI: กด reset ค้าง 5 วินาทีตอน power on'
        ],
        tip:`💡 <strong>เทคนิคพิเศษจาก WS:</strong> GL.iNet Uboot-WebUI recovery mode (กด reset 5 วินาที ตอน power on) ให้ web-based flash interface ที่ใช้งานง่ายมาก หมายความว่า brick ไม่ได้จริงๆ เพราะ recover ได้ด้วย browser + ethernet ทุกครั้ง — travel router ที่กล้า try อะไรก็ได้`,
        warn:'⚠️ ถ้า flash OpenWrt vanilla จะไม่มี GL interface แล้ว ต้องใช้ LuCI และ VPN ต้องตั้งค่าเอง',
        code:'ssh root@192.168.8.1\nopkg update\nopkg install adguardhome luci-app-wireguard\n\n# Flash vanilla OpenWrt:\n# กด reset ค้าง 5 วิ ตอน power on → เข้า 192.168.1.1',
        after:['OpenWrt-based','WireGuard VPN 300Mbps','OpenVPN','AdGuard (pre-packaged)','Tor/Shadowsocks','Entware']
    },
    'glinet-mt6000': {
        cls:'glinet', icon:'GL', title:'GL.iNet Flint 2 (MT6000)', chip:'MediaTek MT7986A (Filogic 830) · Wi-Fi 6 · 8GB eMMC',
        diff:'easy', diffLbl:'ง่ายมาก / Beginner-Friendly', risk:'low', riskLbl:'ต่ำมาก',
        overview:`Flint 2 เป็น flagship ของ GL.iNet ที่ใช้ Filogic 830 และมี 8GB eMMC storage ทำให้รัน Docker containers, multiple services ได้พร้อมกัน เป็น "router SBC" ที่ทรงพลังที่สุดในราคา consumer`,
        steps:[
            'SSH เข้าได้ทันทีหลัง boot: ssh root@192.168.8.1',
            'สำรวจ /overlay — 8GB eMMC ให้พื้นที่ package มหาศาลเทียบกับ router ทั่วไป',
            'ติดตั้ง Docker ผ่าน opkg หรือ GL plugin system',
            'รัน WireGuard server: HW offload ให้ ~900Mbps throughput จริง',
            'Flash vanilla OpenWrt ผ่าน Uboot-WebUI ถ้าต้องการ pure experience'
        ],
        tip:`💡 <strong>เทคนิคพิเศษจาก WS:</strong> ทีม WS รัน AdGuard Home, WireGuard, Shadowsocks-rust และ Mosquitto MQTT broker พร้อมกันบน Flint 2 โดยไม่มีปัญหา storage เลย — ใช้ extroot mount /overlay บน eMMC partition แทน NOR flash เพื่อได้ space เต็มๆ`,
        warn:'⚠️ eMMC recovery ซับซ้อนกว่า NAND แต่ Uboot-WebUI ยังทำงาน ควรทำ backup ก่อน flash',
        code:'ssh root@192.168.8.1\n# ติดตั้ง Docker:\nopkg install docker dockerd\n\n# รัน AdGuard:\ndocker run -d --name adguard -p 3000:3000 adguard/adguardhome',
        after:['Full OpenWrt','Docker Containers','WireGuard ~900Mbps','AdGuard Home','NAS via USB 3.0','Shadowsocks/V2Ray','MQTT Broker']
    },
    'mikrotik-hap': {
        cls:'mikrotik', icon:'MT', title:'MikroTik hAP ax3', chip:'Qualcomm IPQ-6010 · Wi-Fi 6 · RouterOS 7',
        diff:'easy', diffLbl:'ง่าย / Open by Default', risk:'low', riskLbl:'ต่ำมาก',
        overview:`MikroTik เป็น "open by design" — RouterOS ให้ full control ผ่าน Winbox, SSH, API ตั้งแต่ออกจากกล่อง RouterOS 7 รองรับ Container (Docker) ทำให้รัน AdGuard, WireGuard และ service ต่างๆ โดยไม่ต้องแตะ base OS`,
        steps:[
            'เปิดเครื่อง ดาวน์โหลด Winbox จาก mikrotik.com',
            'Login: admin / password ว่าง (default) — ตั้ง password ทันทีที่เข้าได้',
            'Update RouterOS: /system package update install',
            'Enable SSH: /ip service enable ssh',
            'ติดตั้ง Container package: /system/package/add name=container → reboot → enable container mode'
        ],
        tip:`💡 <strong>เทคนิคพิเศษจาก WS:</strong> RouterOS Container support ช่วยให้รัน Docker image บน router ได้เลย ทำให้ hAP ax3 กลายเป็น all-in-one: Router + VPN Server + AdBlock + Monitoring ในกล่องเดียว นี่คือ production-grade router ที่ยืดหยุ่นที่สุดในตลาด`,
        warn:'⚠️ RouterOS license ต้องการ activation — hAP ax3 มี perpetual license ฝังมาในตัว ไม่ต้องซื้อเพิ่ม',
        code:'/system package update install\n/ip service enable ssh\n\n# Container:\n/system/package/add name=container\n/container add remote-image=adguard/adguardhome',
        after:['RouterOS Full Control','Container/Docker','AdGuard Home','WireGuard','BGP/OSPF Routing','Bandwidth Queue','Hotspot Manager']
    },
    'netgear-rax50': {
        cls:'netgear', icon:'NG', title:'Netgear Nighthawk RAX50', chip:'Qualcomm IPQ8074 Quad-Core · Wi-Fi 6 · AX5400',
        diff:'medium', diffLbl:'ปานกลาง / Medium', risk:'medium', riskLbl:'กลาง',
        overview:`Nighthawk RAX50 ใช้ Qualcomm IPQ8074 ที่ดีมาก แต่ Netgear มีระบบ signed firmware Telnet เปิดได้ผ่าน magic packet exploit ที่ community พัฒนาไว้ ให้ shell บน stock firmware ชั่วคราว`,
        steps:[
            'ตรวจสอบ firmware version — magic packet ทำงานได้ดีกับ pre-V7 firmware',
            'ดาวน์โหลด netgear_telnet.py จาก github.com/bkerler',
            'รัน: python telnetenable.py <ip> <mac> <username> <password>',
            'Telnet เข้า: ได้ busybox root shell บน stock firmware',
            'หมายเหตุ: shell นี้ไม่ persistent — หาย หลัง reboot ต้องรัน exploit ใหม่'
        ],
        tip:`💡 <strong>เทคนิคพิเศษจาก WS:</strong> Magic packet trick เป็น classic ของ Netgear Nighthawk — ทีม WS ใช้ประโยชน์เพื่อ extract PPPoE password จาก config, set custom DNS บน stock firmware และรัน monitoring script ชั่วคราว ไม่แนะนำให้ flash OpenWrt เพราะยังไม่มี community port สำหรับ RAX50`,
        warn:'⚠️ ไม่มี OpenWrt community port สำหรับ RAX50 โดยเฉพาะ อย่า flash random OpenWrt IPQ8074 image เพราะ DTS ไม่ตรง',
        code:'# Magic Packet Exploit:\npython telnetenable.py 192.168.1.1 <MAC> admin <password>\n\n# หลัง Telnet enable:\ntelnet 192.168.1.1\nbusybox ash',
        after:['Temporary Stock Root Shell','PPPoE Password Extract','Custom DNS (non-persistent)','Config Research']
    },
    'mercusys-mr90x': {
        cls:'tplink', icon:'MC', title:'Mercusys MR90X v1 (AX6000)', chip:'MediaTek MT7986B (Filogic 830) · Wi-Fi 6 · AX6000',
        diff:'easy', diffLbl:'ง่าย / Easy', risk:'low', riskLbl:'ต่ำ',
        overview:`Mercusys MR90X v1 เป็น OpenWrt powerhouse ที่คุ้มค่าที่สุดในราคาระดับกลาง ใช้ Filogic 830 เหมือน ASUS TUF-AX4200 แต่ราคาถูกกว่ามาก และมี dual 2.5GbE port ที่ทำให้ใช้กับ FTTX ได้เต็มประสิทธิภาพ`,
        steps:[
            'ดาวน์โหลด OpenWrt initramfs image สำหรับ MR90X v1 จาก firmware-selector.openwrt.org (ตรวจ v1 ด้วย)',
            'เข้า stock firmware → Software Update → upload initramfs .bin',
            'Device boot เข้า OpenWrt ชั่วคราว — SSH เข้าทันที: ssh root@192.168.1.1',
            'รัน sysupgrade ด้วย sysupgrade.bin: sysupgrade -n /tmp/openwrt-sysupgrade.bin',
            'หลัง reboot: ตั้ง password, ติดตั้ง LuCI, enable HW offload'
        ],
        tip:`💡 <strong>เทคนิคพิเศษจาก WS:</strong> MR90X + OpenWrt + HW offload = NAT throughput 1.8Gbps+ จริง คุ้มค่าที่สุดในราคา ~฿2,500-3,000 หลัง flash ให้รัน: <code>opkg install kmod-nft-offload</code> ทันที เพื่อ enable hardware NAT offload`,
        warn:'⚠️ v1 เท่านั้นที่รองรับ OpenWrt — ตรวจ hardware revision ก่อน flash',
        code:'# หลัง boot initramfs:\nssh root@192.168.1.1\nsysupgrade -n /tmp/openwrt-sysupgrade.bin\n\n# หลัง reboot:\nopkg update && opkg install kmod-nft-offload luci',
        after:['Full OpenWrt','HW NAT Offload 1.8Gbps+','WireGuard','AdGuard Home','Dual 2.5GbE','SQM QoS','VLAN 802.1Q']
    }
};

// ---- Brand logo classes ----
const LOGO_CLS = {
    xiaomi:'xiaomi', asus:'asus', zte:'zte', isp:'isp',
    huawei:'huawei', glinet:'glinet', mikrotik:'mikrotik',
    netgear:'netgear', tplink:'tplink'
};

// ---- Modal ----
function openModal(id) {
    const d = DB[id];
    if (!d) return;

    const steps = d.steps.map((s, i) =>
        `<li><span class="step-num">${i+1}</span><span>${s}</span></li>`
    ).join('');

    const after = d.after.map(a => `<span class="unlock-badge">${a}</span>`).join('');

    const iconHtml = d.icon.startsWith('fa-')
        ? `<i class="${d.icon}"></i>`
        : d.icon;

    document.getElementById('modalBody').innerHTML = `
        <div class="modal-header">
            <div class="modal-icon brand-logo ${d.cls}">${iconHtml}</div>
            <div class="modal-title-group">
                <h2>${d.title}</h2>
                <p>${d.chip}</p>
            </div>
        </div>
        <div class="modal-badges">
            <span class="diff-badge ${d.diff}">${d.diffLbl}</span>
            <span class="risk ${d.risk}"><i class="fa-solid fa-shield-halved"></i> Risk: ${d.riskLbl}</span>
        </div>
        <div class="modal-section">
            <h4>📋 ภาพรวม / Overview</h4>
            <p>${d.overview}</p>
        </div>
        <div class="modal-section">
            <h4>🔧 ขั้นตอนการปลดล็อค</h4>
            <ul class="steps-list">${steps}</ul>
        </div>
        ${d.code ? `<div class="modal-section">
            <h4>💻 ตัวอย่าง Command</h4>
            <pre class="code-block">${d.code}</pre>
        </div>` : ''}
        <div class="modal-section">
            <h4>💡 เทคนิคพิเศษจาก WS Tech</h4>
            <div class="tip-box">${d.tip}</div>
        </div>
        <div class="modal-section">
            <h4>⚠️ คำเตือน</h4>
            <div class="warning-box">${d.warn}</div>
        </div>
        <div class="modal-section">
            <h4>🚀 สิ่งที่ทำได้หลังปลดล็อค</h4>
            <div class="after-unlock">${after}</div>
        </div>
    `;

    document.getElementById('modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
