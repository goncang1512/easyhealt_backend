import { generateId } from "better-auth";
import { doc, setDoc, writeBatch } from "firebase/firestore";
import { firestoreDb } from "../../lib/firebase.js";

const notifStore = {
  updateStatusBooking: async (
    user_id: string,
    status: string,
    antrian: string,
    hospital: string,
    from: string,
    admin: string[]
  ) => {
    // Normalisasi status ke lower-case supaya lebih tahan banting
    const s = (status || "").toLowerCase();

    let bodyNotif: { title: string; message: string };

    // ====== STATUS: CANCEL ======
    if (s === "cancel" || s === "cancelled" || s === "canceled") {
      if (from === "dokter") {
        bodyNotif = {
          title: `Booking ${antrian} di ${hospital} dibatalkan oleh ${from}`,
          message: `Booking Anda dengan nomor antrian ${antrian} di rumah sakit ${hospital} telah dibatalkan oleh ${from}. Mohon periksa kembali jadwal atau hubungi klinik untuk informasi lebih lanjut.`,
        };
      } else {
        bodyNotif = {
          title: `Booking ${antrian} di ${hospital} dibatalkan oleh ${from}`,
          message: `Booking Anda dengan nomor antrian ${antrian} di rumah sakit ${hospital} telah dibatalkan oleh ${from}. Hubungi admin untuk informasi lebih lanjut.`,
        };
      }

      // ====== STATUS: CONFIRM ======
    } else if (s === "confirm" || s === "confirmed") {
      bodyNotif = {
        title: `Booking ${antrian} di ${hospital} telah dikonfirmasi`,
        message: `${from} telah mengonfirmasi booking Anda dengan nomor antrian ${antrian} di rumah sakit ${hospital}. Harap datang sesuai jadwal atau hubungi klinik jika ingin menjadwalkan ulang.`,
      };

      // ====== STATUS: FINISHED ======
    } else if (
      s === "finished" ||
      s === "done" ||
      s === "completed" ||
      s === "finish"
    ) {
      bodyNotif = {
        title: `Booking ${antrian} di ${hospital} selesai`,
        message: `Kunjungan Anda dengan nomor antrian ${antrian} di rumah sakit ${hospital} telah selesai. Terima kasih telah menggunakan layanan kami.`,
      };

      // ====== FALLBACK ======
    } else {
      bodyNotif = {
        title: `Pembaruan status booking ${antrian} di di ${hospital}`,
        message: `Ada pembaruan untuk booking Anda dengan nomor antrian ${antrian} di rumah sakit ${hospital}. Silakan cek detail booking di aplikasi untuk informasi lengkap.`,
      };
    }

    const receiverId = [user_id, ...admin];

    const batch = writeBatch(firestoreDb);

    receiverId.forEach((uid) => {
      const id = generateId(32);
      const document = doc(firestoreDb, "notification", id);
      batch.set(document, {
        ...bodyNotif,
        userId: uid,
        createdAt: new Date(),
      });
    });

    await batch.commit();

    return {
      ...bodyNotif,
    };
  },
};

export default notifStore;
