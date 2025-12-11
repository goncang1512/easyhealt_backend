import { generateId } from "better-auth";
import { doc, setDoc } from "firebase/firestore";
import { firestoreDb } from "../../lib/firebase.js";

const notifStore = {
  updateStatusBooking: async (
    user_id: string,
    status: string,
    antrian: string
  ) => {
    // Normalisasi status ke lower-case supaya lebih tahan banting
    const s = (status || "").toLowerCase();

    let bodyNotif: { title: string; message: string };

    // ====== STATUS: CANCEL ======
    if (s === "cancel" || s === "cancelled" || s === "canceled") {
      bodyNotif = {
        title: `Booking ${antrian} dibatalkan oleh dokter`,
        message: `Booking Anda dengan nomor antrian ${antrian} telah dibatalkan oleh dokter. Mohon periksa kembali jadwal atau hubungi klinik untuk informasi lebih lanjut.`,
      };

      // ====== STATUS: CONFIRM ======
    } else if (s === "confirm" || s === "confirmed") {
      bodyNotif = {
        title: `Booking ${antrian} telah dikonfirmasi`,
        message: `Dokter telah mengonfirmasi booking Anda dengan nomor antrian ${antrian}. Harap datang sesuai jadwal atau hubungi klinik jika ingin menjadwalkan ulang.`,
      };

      // ====== STATUS: FINISHED ======
    } else if (
      s === "finished" ||
      s === "done" ||
      s === "completed" ||
      s === "finish"
    ) {
      bodyNotif = {
        title: `Booking ${antrian} selesai`,
        message: `Kunjungan Anda dengan nomor antrian ${antrian} telah selesai. Terima kasih telah menggunakan layanan kami.`,
      };

      // ====== FALLBACK ======
    } else {
      bodyNotif = {
        title: `Pembaruan status booking ${antrian}`,
        message: `Ada pembaruan untuk booking Anda dengan nomor antrian ${antrian}. Silakan cek detail booking di aplikasi untuk informasi lengkap.`,
      };
    }

    const id = generateId(32);
    const document = doc(firestoreDb, "notification", id);
    await setDoc(document, { ...bodyNotif, userId: user_id });

    return {
      id,
      ...bodyNotif,
    };
  },
};

export default notifStore;
