/* app.js — WS Tech Router Lab */

// ---- Navbar scroll ----
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ---- Mobile menu ----
const mobileBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));
}

// ---- Filter buttons ----
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.filter;
        document.querySelectorAll('.router-card').forEach(card => {
            if (filter === 'all') {
                card.classList.remove('hidden');
            } else if (filter === 'thai') {
                card.classList.toggle('hidden', !card.dataset.thai);
            } else {
                card.classList.toggle('hidden', card.dataset.difficulty !== filter);
            }
        });
    });
});

// ---- Router Data (Modal content) ----
const routerData = {
    'xiaomi-ax3000t': {
        brand: 'xiaomi',
        brandName: 'Xiaomi',
        icon: 'fa-solid fa-m',
        title: 'Xiaomi AX3000T',
        chip: 'MediaTek MT7981B · Wi-Fi 6 · AX3000',
        difficulty: 'easy',
        diffLabel: 'ง่าย / Easy',
        risk: 'ต่ำ',
        riskClass: 'low',
        overview: `AX3000T เป็นหนึ่งในเราเตอร์ที่ง่ายที่สุดในการปลดล็อค เนื่องจาก Xiaomi ใช้ระบบ API ภายในที่ไม่ได้ป้องกัน authentication ครบถ้วน ทำให้สามารถเปิด SSH ได้โดยไม่ต้อง downgrade firmware หรือใช้อุปกรณ์พิเศษ<br><br>
        <em>ข้อควรระวัง: ตรวจสอบว่าคุณมี RD03 ไม่ใช่ RD03v2 — version ใหม่นั้น chipset ต่างออกไปและ OpenWrt ยังไม่รองรับ</em>`,
        steps: [
            'ดาวน์โหลด xmir-patcher และ Python 3 ติดตั้งให้เรียบร้อย',
            'เชื่อมต่อ LAN cable จาก PC ไปยังเราเตอร์, login ที่ 192.168.31.1 และอัปเดต firmware ให้เป็น version ล่าสุดจาก Xiaomi ก่อน',
            'รัน script: python xmir-patcher.py เลือก "Enable SSH" จาก menu',
            'SSH เข้า router: ssh root@192.168.31.1 (default pass: admin หรือ password ของ router)',
            'หลังจาก SSH เข้าได้แล้ว ใช้ mtd write ในการ flash OpenWrt initramfs แล้วตามด้วย sysupgrade'
        ],
        tip: `💡 <strong>เทคนิคพิเศษจาก WS:</strong> ก่อน flash OpenWrt ให้รัน <code>cat /proc/cmdline</code> เพื่อ verify hardware version ก่อน — หาก output มีคำว่า "rd03v2" ให้หยุดทันที เพราะนั่นคือ hardware ที่ยังไม่รองรับ`,
        warning: '⚠️ อย่า flash firmware จาก YouTube หรือ blog ที่ไม่น่าเชื่อถือ ใช้ OpenWrt Firmware Selector เท่านั้น',
        afterUnlock: ['AdGuard Home', 'WireGuard VPN', 'OpenWrt LuCI', 'EasyMesh', 'Bandwidth Monitor', 'Custom DNS'],
        codeExample: 'ssh root@192.168.31.1\n# หลัง login:\ncat /proc/version\nmtd list'
    },
    'xiaomi-ax9000': {
        brand: 'xiaomi',
        brandName: 'Xiaomi',
        icon: 'fa-solid fa-m',
        title: 'Xiaomi AX9000',
        chip: 'Qualcomm IPQ8072A Quad-Core · Wi-Fi 6 · Tri-band',
        difficulty: 'medium',
        diffLabel: 'ปานกลาง / Medium',
        risk: 'กลาง',
        riskClass: 'medium',
        overview: `AX9000 ใช้ chipset Qualcomm ซึ่งมีการสนับสนุน OpenWrt แบบ partial เท่านั้น การเปิด SSH ทำได้ผ่าน MiWiFi backend API แต่ต้องระวังเรื่อง firmware version เพราะ Xiaomi ปิดช่องโหว่นี้ใน version ใหม่กว่า`,
        steps: [
            'ตรวจสอบ firmware version ปัจจุบัน — หากเกิน 3.0.xx อาจต้อง downgrade ก่อน',
            'ใช้ MiWiFi repair exploit หรือ SSH enable บน stock ROM version เก่า',
            'เข้า developer mode ผ่าน API: POST /api/misystem/set_sys_time',
            'SSH เข้า router และติดตั้ง Entware สำหรับ package manager',
            'หากต้องการ full OpenWrt: ต้องทำผ่าน UART เนื่องจาก bootloader ถูก lock'
        ],
        tip: `💡 <strong>เทคนิคพิเศษจาก WS:</strong> AX9000 รัน Qualcomm NSS (Network Subsystem) ซึ่งให้ performance สูงมาก ถ้า flash OpenWrt แล้ว NSS offload จะหายไป — แนะนำให้ใช้ Entware บน stock ROM แทนถ้าต้องการ performance สูงสุด`,
        warning: '⚠️ การ downgrade firmware มีความเสี่ยงปานกลาง ควรมี UART adapter สำรองไว้ก่อนทำ',
        afterUnlock: ['Entware Package Manager', 'AdGuard', 'OpenVPN', 'Custom Firewall', 'QoS Tuning'],
        codeExample: 'curl -X POST http://192.168.31.1/api/misystem/set_sys_time\n# Enable SSH via API exploit'
    },
    'xiaomi-be7000': {
        brand: 'xiaomi',
        brandName: 'Xiaomi',
        icon: 'fa-solid fa-m',
        title: 'Xiaomi BE7000',
        chip: 'Qualcomm IPQ5332 · Wi-Fi 7 · BE7000',
        difficulty: 'hard',
        diffLabel: 'ยาก / Hard',
        risk: 'สูง',
        riskClass: 'high',
        overview: `BE7000 เป็น Wi-Fi 7 รุ่นใหม่ของ Xiaomi ที่ยังอยู่ในช่วง early exploration สำหรับ OpenWrt/custom firmware ต้องใช้ UART serial หรือ FTP exploit ที่พบในบาง firmware version เท่านั้น`,
        steps: [
            'เปิดเครื่องและหา UART pads บน PCB (ต้องถอด case)',
            'ต่อสาย UART ด้วย CH340/FTDI adapter (baud: 115200)',
            'Boot เข้า U-Boot และ interrupt boot sequence',
            'ใช้ tftp เพื่อ load test firmware หรือ modify boot args',
            'สำหรับ method ไม่ต้องถอดเครื่อง: รอ community exploit บน firmware เก่า'
        ],
        tip: `💡 <strong>เทคนิคพิเศษจาก WS:</strong> ณ ปัจจุบัน BE7000 ที่ง่ายที่สุดคือการใช้ FTP service ที่เปิดอยู่โดย default ใน firmware < 1.0.30 เพื่อ upload modified config file แล้วเปิด Telnet`,
        warning: '⚠️ Wi-Fi 7 hardware support ใน Linux kernel ยังไม่สมบูรณ์ — ระวัง radio อาจทำงานได้แค่บางส่วน',
        afterUnlock: ['SSH access', 'Custom firewall rules', 'Basic monitoring'],
        codeExample: '# UART connection\nscreen /dev/ttyUSB0 115200\n# Interrupt U-Boot:\nPress any key to stop autoboot...'
    },
    'tplink-ax50': {
        brand: 'tplink',
        brandName: 'TP-Link',
        icon: 'fa-solid fa-t',
        title: 'TP-Link Archer AX50',
        chip: 'Broadcom BCM6750 · Wi-Fi 6 · AX3000 Dual-band',
        difficulty: 'easy',
        diffLabel: 'ง่าย / Easy',
        risk: 'ต่ำ',
        riskClass: 'low',
        overview: `Archer AX50 เป็น target ที่ดีมากสำหรับ OpenWrt เพราะ Broadcom BCM6750 มี driver ที่ค่อนข้างสมบูรณ์ การ flash ทำได้ผ่าน web interface โดยตรง — ไม่ต้องใช้อุปกรณ์พิเศษ`,
        steps: [
            'ตรวจ hardware version: พลิกดูข้างล่างเครื่อง ต้องเป็น v1 (v2 ขึ้นไปอาจต่างกัน)',
            'ดาวน์โหลด OpenWrt factory image สำหรับ AX50 จาก firmware-selector.openwrt.org',
            'เข้าหน้า admin panel → Advanced → System Tools → Firmware Upgrade',
            'Upload OpenWrt factory image, รอ reboot ประมาณ 3 นาที',
            'เข้า LuCI ที่ 192.168.1.1 ตั้ง password และ configure'
        ],
        tip: `💡 <strong>เทคนิคพิเศษจาก WS:</strong> ถ้าเกิด brick ให้ใช้ TFTP recovery: กด reset ค้างไว้ขณะ power on แล้วส่ง recovery image ผ่าน TFTP ที่ IP 192.168.0.1`,
        warning: '⚠️ ตรวจ hardware version ก่อนทุกครั้ง — v2/v3 อาจมี chipset ต่างออกไป',
        afterUnlock: ['LuCI Web UI', 'OpenVPN/WireGuard', 'AdGuard Home', 'VLAN', 'QoS', 'Bandwidth Control'],
        codeExample: '# TFTP Recovery (ถ้า brick)\ntftp 192.168.0.1\n> binary\n> put ArcherAX50_recovery.bin'
    },
    'tplink-ax73': {
        brand: 'tplink',
        brandName: 'TP-Link',
        icon: 'fa-solid fa-t',
        title: 'TP-Link Archer AX73',
        chip: 'MediaTek MT7621A + MT7905/7975 · Wi-Fi 6',
        difficulty: 'easy',
        diffLabel: 'ง่าย / Easy',
        risk: 'ต่ำ',
        riskClass: 'low',
        overview: `AX73 ใช้ MediaTek ซึ่ง OpenWrt รองรับได้ดีมาก การปลดล็อคทำได้ง่ายผ่าน web interface เช่นเดียวกับ AX50 แต่มีข้อดีคือ MT chipset ให้ Wi-Fi performance ที่ดีกว่าบน OpenWrt เพราะ opensource driver สมบูรณ์กว่า Broadcom`,
        steps: [
            'เข้า admin panel → Advanced → System Tools → Firmware',
            'Download OpenWrt สำหรับ Archer AX73 (ระวัง version ด้วย)',
            'Upload factory image ผ่าน web interface',
            'รอ reboot และเข้า LuCI ที่ 192.168.1.1'
        ],
        tip: `💡 <strong>เทคนิคพิเศษจาก WS:</strong> MediaTek driver ใน OpenWrt รองรับ 160MHz channel width ได้เต็มๆ ทำให้ได้ throughput จริงสูงกว่า stock firmware มาก`,
        warning: '⚠️ ตรวจสอบ hardware revision อย่างละเอียด AX73 v1 และ v2 ใช้ image คนละตัวกัน',
        afterUnlock: ['Full OpenWrt', 'WireGuard', 'AdGuard', 'SQM QoS', 'VLAN isolation'],
        codeExample: '# หลัง flash OpenWrt\nssh root@192.168.1.1\nopkg update && opkg install luci-app-adblock'
    },
    'zte-f6600': {
        brand: 'zte',
        brandName: 'ZTE',
        icon: 'ZTE',
        title: 'ZTE F6600 (NT/TOT GPON)',
        chip: 'Qualcomm IPQ4019 · GPON ONU · ISP Locked',
        difficulty: 'hard',
        diffLabel: 'ยาก / Hard',
        risk: 'สูง',
        riskClass: 'high',
        overview: `ZTE F6600 เป็น GPON ONU ที่ ISP ไทย (NT, TOT) แจกให้ลูกค้า fiber ทั่วไป router นี้มีระบบ config encryption ด้วย AES-128 ที่ ZTE ออกแบบเอง และมี Telnet service ซ่อนอยู่ที่สามารถ enable ได้ด้วย trick พิเศษ<br><br>
        <em>ข้อมูลนี้มาจากการ reverse engineer โดยตรง ไม่มีในเอกสาร official</em>`,
        steps: [
            'เข้าหน้า admin web UI ที่ 192.168.1.1 ด้วย super admin credential (ไม่ใช่ password ปกติ)',
            'Download config backup (.bin) จาก diagnostic page',
            'Decrypt config ด้วย AES-128 key ที่คำนวณจาก model+serial number',
            'แก้ไข config เพื่อเปิด Telnet service และ debug mode',
            'Re-encrypt และ upload กลับ จากนั้น reboot เพื่อ apply'
        ],
        tip: `💡 <strong>เทคนิคพิเศษจาก WS:</strong> ZTE ใช้ AES-128-ECB สำหรับ config encryption โดย key ถูก derive มาจาก string "ZXHN" + เลข model + serial number บางส่วน — นี่คือ discovery ที่ทีม WS ค้นพบจากการ reverse ไม่มีในเอกสาร ZTE official`,
        warning: '⚠️ การแก้ไข GPON ONU อาจขัดต่อเงื่อนไขการใช้งานของ ISP ทำด้วยความระวังและความรับผิดชอบของตัวเอง',
        afterUnlock: ['Telnet Shell', 'Custom DNS', 'Port Forwarding unlock', 'VLAN config', 'TR-069 disable'],
        codeExample: '# หลัง decrypt config\ntelnet 192.168.1.1\n# login ด้วย super user credential\n$ cat /etc/passwd'
    },
    'zte-f6107': {
        brand: 'zte',
        brandName: 'ZTE',
        icon: 'ZTE',
        title: 'ZTE F6107',
        chip: 'MediaTek MT7628 · EPON/GPON · ISP Locked',
        difficulty: 'hard',
        diffLabel: 'ยาก / Hard',
        risk: 'สูง',
        riskClass: 'high',
        overview: `F6107 เป็นรุ่นพี่เก่ากว่า F6600 ใช้ MediaTek MT7628 และมี UART pad ที่หา pin ได้ค่อนข้างง่ายกว่า ISP บางรายยังใช้รุ่นนี้อยู่ในพื้นที่ห่างไกล`,
        steps: [
            'ถอด case และหา UART pad บน PCB (TX, RX, GND)',
            'ต่อ UART adapter (3.3V) baud rate 115200',
            'Boot เข้า shell ผ่าน serial console',
            'แก้ไข /etc/config/firewall เพื่อเปิด Telnet port',
            'หรือใช้ config backup method เช่นเดียวกับ F6600'
        ],
        tip: `💡 <strong>เทคนิคพิเศษจาก WS:</strong> F6107 บางล็อตมี default credentials ที่ยัง default อยู่ใน Telnet: username "root" password "Zte521" — ลองดูก่อน UART เสมอ`,
        warning: '⚠️ UART ต้องใช้ 3.3V logic เท่านั้น ห้ามใช้ 5V TTL เพราะจะเผา chip',
        afterUnlock: ['UART Shell', 'Custom firewall', 'DNS override', 'Port forward full access'],
        codeExample: '# UART login\nscreen /dev/ttyUSB0 115200\n\nlogin: root\nPassword: Zte521'
    },
    'asus-rtax88u': {
        brand: 'asus',
        brandName: 'ASUS',
        icon: 'ASUS',
        title: 'ASUS RT-AX88U',
        chip: 'Broadcom BCM4908 Quad-Core · Wi-Fi 6 · AX6000',
        difficulty: 'easy',
        diffLabel: 'ง่ายมาก / Very Easy',
        risk: 'ต่ำมาก',
        riskClass: 'low',
        overview: `RT-AX88U เป็นหนึ่งในเราเตอร์ที่ "hacker-friendly" ที่สุดในตลาด เพราะ ASUS เปิด SSH ให้ใช้ได้จากใน web UI โดยตรง และ Merlin firmware ก็รองรับเต็มที่ — เกือบไม่มีความเสี่ยง`,
        steps: [
            'เข้า admin panel → Administration → System → Enable SSH',
            'Set SSH port (แนะนำเปลี่ยนจาก 22 เป็น port อื่น)',
            'Flash Asuswrt-Merlin จาก merlin.ng เพื่อ unlock features เพิ่มเติม',
            'SSH เข้า router และติดตั้ง Entware สำหรับ package manager',
            'ติดตั้ง AdGuard Home, WireGuard, หรือ custom scripts'
        ],
        tip: `💡 <strong>เทคนิคพิเศษจาก WS:</strong> Asuswrt-Merlin บน AX88U รองรับ Adaptive QoS + AIMESH ได้พร้อมกัน ซึ่ง stock OpenWrt ยังทำไม่ได้ เพราะ Broadcom NSS ไม่มี open source driver เต็มรูปแบบ`,
        warning: '⚠️ Merlin ยังใช้ Broadcom closed-source driver ดังนั้น OpenWrt จะให้ Wi-Fi performance ต่ำกว่ามาก',
        afterUnlock: ['Entware', 'AdGuard Home', 'WireGuard VPN', 'Custom Scripts', 'JFFS Scripts', 'AiMesh', 'USB Storage'],
        codeExample: 'ssh admin@192.168.1.1\n# ติดตั้ง Entware:\ncurl -fsL --retry 3 "https://bin.entware.net/armv7sf-k3.10/installer/generic.sh" | /bin/sh'
    },
    'asus-tufax4200': {
        brand: 'asus',
        brandName: 'ASUS',
        icon: 'ASUS',
        title: 'ASUS TUF-AX4200',
        chip: 'MediaTek MT7986A (Filogic 830) · Wi-Fi 6 · AX4200',
        difficulty: 'medium',
        diffLabel: 'ปานกลาง / Medium',
        risk: 'ต่ำ',
        riskClass: 'low',
        overview: `TUF-AX4200 ใช้ MediaTek Filogic 830 ซึ่ง OpenWrt รองรับได้ดีมาก และเป็นหนึ่งใน router ที่ give best OpenWrt experience เพราะ MT open-source driver สมบูรณ์ที่สุด`,
        steps: [
            'Enable SSH ผ่าน ASUS web UI → Administration',
            'Download OpenWrt สำหรับ TUF-AX4200 จาก openwrt.org',
            'Flash ผ่าน web UI หรือ SSH + mtd write',
            'Reboot และเข้า LuCI ที่ 192.168.1.1',
            'ตั้งค่า Wi-Fi และ configure ตามต้องการ'
        ],
        tip: `💡 <strong>เทคนิคพิเศษจาก WS:</strong> Filogic 830 รองรับ hardware offload ใน OpenWrt ทำให้ได้ throughput ใกล้เคียง wire speed แม้เปิด NAT — นี่คือจุดเด่นที่ทำให้ดีกว่า Broadcom-based รุ่นอื่น`,
        warning: '⚠️ บาง factory firmware version ต้องการ intermediate step ก่อน flash OpenWrt ตรวจสอบ OpenWrt wiki ก่อน',
        afterUnlock: ['Full OpenWrt', 'HW Offload', 'WireGuard', 'AdGuard', 'VLAN', 'EasyMesh'],
        codeExample: 'ssh admin@192.168.1.1\nmtd write /tmp/openwrt-factory.bin firmware'
    },
    'huawei-ax3': {
        brand: 'huawei',
        brandName: 'Huawei',
        icon: 'fa-solid fa-h',
        title: 'Huawei AX3 / Honor Router 3',
        chip: 'HiSilicon Kirin 659 · Wi-Fi 6 · AX3000',
        difficulty: 'hard',
        diffLabel: 'ยาก / Hard',
        risk: 'สูง',
        riskClass: 'high',
        overview: `Huawei และ Honor router ใช้ HiSilicon chipset ของตัวเอง ซึ่ง OpenWrt ไม่รองรับ การปลดล็อคหมายถึงการ enable Telnet ที่ซ่อนอยู่ ผ่าน payload ใน URL ของ web admin`,
        steps: [
            'Login เข้า web UI ที่ 192.168.3.1',
            'ส่ง HTTP request พิเศษ เพื่อ enable Telnet service (exploit ใน firmware เก่า)',
            'Telnet เข้า 192.168.3.1 port 23',
            'login ด้วย super user credential ที่ derived จาก S/N',
            'แก้ไข config ตามต้องการผ่าน CLI'
        ],
        tip: `💡 <strong>เทคนิคพิเศษจาก WS:</strong> Huawei router มี "diagnostic mode" ที่เปิดได้ด้วย URL: /api/nms/cmd?module=admin พร้อม payload ที่ถูกต้อง credential ถูก generate จาก IMEI+MAC แบบ custom algorithm`,
        warning: '⚠️ ไม่มี OpenWrt support — สามารถแก้ไข stock firmware เท่านั้น และ Telnet exploit ถูกปิดใน firmware ใหม่',
        afterUnlock: ['Telnet CLI', 'Custom DNS', 'Firewall rules', 'QoS manual config'],
        codeExample: 'telnet 192.168.3.1\nlogin: telecomadmin\nPassword: <derived from S/N>'
    },
    'glinet-mt3000': {
        brand: 'glinet',
        brandName: 'GL.iNet',
        icon: 'GL',
        title: 'GL.iNet MT3000 Beryl AX',
        chip: 'MediaTek MT7981B · Wi-Fi 6 · AX3000',
        difficulty: 'easy',
        diffLabel: 'ง่ายมาก / Beginner-Friendly',
        risk: 'ต่ำมาก',
        riskClass: 'low',
        overview: `GL.iNet Beryl AX คือ "OpenWrt by default" — router ตัวนี้รัน OpenWrt modified มาแต่แรกและเปิด SSH ให้ใช้ได้เลยโดย default เหมาะสำหรับคนที่เริ่มต้นเรียนรู้ router modding ที่สุด`,
        steps: [
            'เปิดเครื่องและเข้า web UI ที่ 192.168.8.1',
            'ตั้ง admin password และ enable SSH จาก settings',
            'SSH เข้า: ssh root@192.168.8.1',
            'ใช้ opkg install เพื่อติดตั้ง package ต่างๆ',
            'สามารถ flash standard OpenWrt เพื่อ unlock LuCI full features'
        ],
        tip: `💡 <strong>เทคนิคพิเศษจาก WS:</strong> GL.iNet ใช้ GL-SDK ซึ่ง based on OpenWrt แต่มี GL UI overlay สามารถ flash OpenWrt "vanilla" เพื่อ remove GL layer และได้ LuCI เต็มๆ — ผลลัพธ์คือ travel router ที่ทรงพลังมาก`,
        warning: '⚠️ ถ้า flash OpenWrt vanilla จะไม่มี GL interface แล้ว — ต้องใช้ LuCI เท่านั้น',
        afterUnlock: ['Full OpenWrt/LuCI', 'WireGuard', 'OpenVPN', 'AdGuard', 'Tor routing', 'USB Tethering'],
        codeExample: 'ssh root@192.168.8.1\nopkg update\nopkg install adguardhome wireguard-tools'
    },
    'netgear-rax50': {
        brand: 'netgear',
        brandName: 'Netgear',
        icon: 'fa-solid fa-n',
        title: 'Netgear Nighthawk RAX50',
        chip: 'Broadcom BCM6750 · Wi-Fi 6 · AX5400',
        difficulty: 'medium',
        diffLabel: 'ปานกลาง / Medium',
        risk: 'กลาง',
        riskClass: 'medium',
        overview: `Nighthawk RAX50 ใช้ chipset เดียวกับ TP-Link AX50 แต่ Netgear ล็อค bootloader แน่นกว่า DD-WRT มี support แบบ partial และ OpenWrt ยังอยู่ในช่วง testing`,
        steps: [
            'Enable Telnet ผ่าน Netgear debug URL: http://192.168.1.1/debug.htm',
            'Telnet เข้าและ check filesystem layout',
            'สำหรับ DD-WRT: ใช้ web flash ผ่าน Netgear admin UI',
            'สำหรับ OpenWrt: ต้องมี TFTP recovery method เตรียมไว้ก่อน'
        ],
        tip: `💡 <strong>เทคนิคพิเศษจาก WS:</strong> Netgear มี hidden debug page ที่ /debug.htm ซึ่งเปิดให้ enable Telnet และดู system info ลึกมาก — ลองเข้าดูก่อน flash ทุกครั้ง`,
        warning: '⚠️ Netgear Armor (Bitdefender) จะหยุดทำงานหลัง flash custom firmware',
        afterUnlock: ['DD-WRT', 'Telnet CLI', 'Custom Firewall', 'VPN Client'],
        codeExample: 'telnet 192.168.1.1\n# หลัง enable จาก debug.htm\nbusybox ash'
    },
    'thai-isp-oem': {
        brand: 'isp',
        brandName: 'Thai ISP OEM',
        icon: 'ISP',
        title: 'TOT / NT / AIS OEM Routers',
        chip: 'ZTE / Huawei / Nokia OEM · GPON/EPON',
        difficulty: 'hard',
        diffLabel: 'ยาก / Expert',
        risk: 'สูงมาก',
        riskClass: 'high',
        overview: `เราเตอร์ OEM ที่ ISP ไทยแจกให้ลูกค้า มักเป็น ZTE, Huawei หรือ Nokia ที่ถูก rebrand และ lock config ด้วย ISP profile ปิด Telnet, TR-069 เข้ามาจาก ISP และ admin credential ถูกเปลี่ยน<br><br>
        <em>ทีม WS มีประสบการณ์ตรงกับ ZTE F6600 (NT), ZTE T3 (AIS), และ Huawei HG8145V5 (TRUE)</em>`,
        steps: [
            'ตรวจสอบ model จากสติกเกอร์: ZTE, Huawei, Nokia, Sercomm หรือ Fiberhome',
            'ลอง default credential ของ ISP: admin/admin, user/user, telecomadmin/admintelecom',
            'ถ้า login ได้: ลอง URL exploit เพื่อ enable Telnet หรือ SSH',
            'ถ้าไม่ได้: download config backup และ decrypt AES',
            'UART เป็น last resort: เปิดเครื่องและ connect serial ก่อน boot'
        ],
        tip: `💡 <strong>เทคนิคพิเศษจาก WS:</strong> NT F6600 ใช้ super-admin credential ที่ derive มาจาก MAC address บางส่วน — algorithm คือ base64(md5(mac[:6] + "ZXHN")) ซึ่งทีม WS reverse ออกมาได้จากการ dump firmware`,
        warning: '⚠️ การแก้ไข ONU ของ ISP อาจผิดกฎหมายหรือสัญญาให้บริการ ควรทำบน device ที่เป็นของตัวเองที่ซื้อมาเท่านั้น ไม่ใช่ device ที่ ISP ยังเป็นเจ้าของ',
        afterUnlock: ['TR-069 disable', 'Custom DNS', 'Port forwarding full', 'VLAN config', 'QoS override', 'DMZ'],
        codeExample: '# NT F6600 super admin\nUSERNAME: telecomadmin\nPASSWORD: <derived from MAC>\n\n# หรือ Telnet:\ntelnet 192.168.1.1 23'
    },
    'mikrotik-hap': {
        brand: 'mikrotik',
        brandName: 'MikroTik',
        icon: 'MT',
        title: 'MikroTik hAP ax3',
        chip: 'Qualcomm IPQ-6010 · Wi-Fi 6 · RouterOS 7',
        difficulty: 'easy',
        diffLabel: 'ง่าย / Professional',
        risk: 'ต่ำมาก',
        riskClass: 'low',
        overview: `MikroTik เป็น "open by design" — RouterOS ให้ control เต็มที่ผ่าน Winbox, SSH, API ตั้งแต่ box ไม่ต้อง "ปลดล็อค" แต่การ "unlock" คือการเรียนรู้ RouterOS ให้ถึงขีดสุด และสามารถ install container packages รวมถึง AdGuard, WireGuard ได้เลย`,
        steps: [
            'เปิดเครื่อง เชื่อมต่อ ether1 และเข้าผ่าน Winbox (download จาก mikrotik.com)',
            'Login: admin / password ว่าง (default)',
            'ตั้ง password ทันที และ update RouterOS: /system package update install',
            'Enable SSH: /ip service enable ssh',
            'ติดตั้ง Container package และรัน AdGuard Home / WireGuard ใน container'
        ],
        tip: `💡 <strong>เทคนิคพิเศษจาก WS:</strong> RouterOS Container support ช่วยให้รัน Docker image บน router ได้เลย — ทำให้ hAP ax3 กลายเป็น all-in-one: Router + VPN server + AdBlock + monitoring ในกล่องเดียว`,
        warning: '⚠️ RouterOS license ต้องการ activation หลัง 24 ชม. แต่ hAP ax3 มี license ฝังมาในตัว',
        afterUnlock: ['RouterOS Full', 'Container/Docker', 'AdGuard', 'WireGuard', 'BGP/OSPF routing', 'Bandwidth queue', 'Hotspot'],
        codeExample: '/system package update install\n/ip service enable ssh\n/container add remote-image=adguard/adguardhome'
    },
    'redmi-ax6000': {
        brand: 'xiaomi',
        brandName: 'Redmi (Xiaomi)',
        icon: 'fa-solid fa-m',
        title: 'Redmi AX6000',
        chip: 'MediaTek MT7986A (Filogic 830) · Wi-Fi 6 · AX6000',
        difficulty: 'medium',
        diffLabel: 'ปานกลาง / Medium',
        risk: 'กลาง',
        riskClass: 'medium',
        overview: `Redmi AX6000 ใช้ Filogic 830 เช่นเดียวกับ ASUS TUF-AX4200 ทำให้ OpenWrt performance ดีเยี่ยม วิธีการ unlock SSH ใช้ API exploit บน stock firmware ซึ่ง community พัฒนา tool ไว้ให้แล้ว`,
        steps: [
            'ดาวน์โหลด tool จาก community (xiaomi-ax6000-exploit)',
            'รัน script บน Windows/Linux: python exploit.py -t 192.168.31.1',
            'Script จะ enable SSH อัตโนมัติผ่าน API chain exploit',
            'SSH เข้า: ssh -oHostKeyAlgorithms=+ssh-rsa root@192.168.31.1',
            'Flash OpenWrt ImmortalWrt สำหรับ Filogic 830 target'
        ],
        tip: `💡 <strong>เทคนิคพิเศษจาก WS:</strong> AX6000 + ImmortalWrt + HW offload = throughput > 2.5 Gbps NAT จริงที่วัดได้ ดีกว่า stock firmware มาก ถ้าเน้นความเร็วอย่างเดียวรุ่นนี้คุ้มที่สุด`,
        warning: '⚠️ Exploit ใช้ได้กับ firmware version ที่จำกัด ต้องตรวจสอบ compatibility ก่อน',
        afterUnlock: ['ImmortalWrt', 'HW Offload 2.5G+', 'AdGuard', 'WireGuard', 'Breed Bootloader'],
        codeExample: 'python exploit.py -t 192.168.31.1\n# รอ SSH enable\nssh -oHostKeyAlgorithms=+ssh-rsa root@192.168.31.1'
    }
};

// ---- Modal Functions ----
function openModal(id) {
    const data = routerData[id];
    if (!data) return;

    const diffColors = { easy: 'var(--emerald)', medium: 'var(--amber)', hard: 'var(--red)' };
    const diffColor = diffColors[data.difficulty] || 'var(--text-muted)';

    const stepsHtml = data.steps.map((s, i) =>
        `<li><span class="step-num">${i+1}</span><span>${s}</span></li>`
    ).join('');

    const afterHtml = data.afterUnlock.map(a => `<span class="unlock-badge">${a}</span>`).join('');

    const logoClasses = { xiaomi:'xiaomi',tplink:'tplink',zte:'zte',asus:'asus',huawei:'huawei',glinet:'glinet',netgear:'netgear',isp:'isp',mikrotik:'mikrotik' };

    document.getElementById('modalBody').innerHTML = `
        <div class="modal-header">
            <div class="brand-logo ${logoClasses[data.brand] || ''}" style="width:56px;height:56px;font-size:1.1rem">
                ${data.icon && data.icon.startsWith('fa-') ? `<i class="${data.icon}"></i>` : data.icon}
            </div>
            <div class="modal-title-group">
                <h2>${data.title}</h2>
                <p>${data.chip}</p>
            </div>
        </div>
        <div class="modal-badges">
            <span class="diff-badge ${data.difficulty}" style="font-size:0.8rem">${data.diffLabel}</span>
            <span class="risk ${data.riskClass}" style="font-size:0.82rem"><i class="fa-solid fa-shield-halved"></i> Risk: ${data.risk}</span>
        </div>
        <div class="modal-section">
            <h4>📋 ภาพรวม / Overview</h4>
            <p>${data.overview}</p>
        </div>
        <div class="modal-section">
            <h4>🔧 ขั้นตอนการปลดล็อค</h4>
            <ul class="steps-list">${stepsHtml}</ul>
        </div>
        ${data.codeExample ? `
        <div class="modal-section">
            <h4>💻 ตัวอย่าง Command</h4>
            <pre class="code-block">${data.codeExample}</pre>
        </div>` : ''}
        <div class="modal-section">
            <h4>💡 เทคนิคจาก WS Tech</h4>
            <div class="tip-box">${data.tip}</div>
        </div>
        <div class="modal-section">
            <h4>⚠️ คำเตือน</h4>
            <div class="warning-box">${data.warning}</div>
        </div>
        <div class="modal-section">
            <h4>🚀 สิ่งที่ทำได้หลังปลดล็อค</h4>
            <div class="after-unlock">${afterHtml}</div>
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

// ---- Smooth active nav link ----
const sections = document.querySelectorAll('section[id], .filter-section[id]');
const navItems = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navItems.forEach(a => {
        a.classList.toggle('active-nav', a.getAttribute('href') === '#' + current);
    });
});
